import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

// Main test suite for EscrowFactory
describe("EscrowFactory", function () {

  // Fixture to set up the initial state for each test
  async function deployEscrowFactoryFixture() {
    // Get signers
    const [owner, otherAccount] = await ethers.getSigners();

    // Deploy MockToken
    const MockToken = await ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy();
    
    // Deploy EscrowFactory
    const EscrowFactory = await ethers.getContractFactory("EscrowFactory");
    const escrowFactory = await EscrowFactory.deploy();

    // Return everything for use in tests
    return { escrowFactory, mockToken, owner, otherAccount };
  }

  // Test suite for the createEscrow function
  describe("createEscrow", function () {

    it("Should create a new escrow with the correct parameters and emit an event", async function () {
      // 1. SETUP: Load the fixture to get a clean state
      const { escrowFactory, mockToken, owner } = await loadFixture(deployEscrowFactoryFixture);

      // 2. DEFINE PARAMETERS for our new escrow
      const tokenAddress = await mockToken.getAddress();
      const dues = ethers.parseUnits("100", 18); // 100 MTK with 18 decimals
      const latestTime = await time.latest(); // Gets the current block's timestamp
      const startTime = latestTime + 60; // 1 minute in the future
      const endTime = latestTime + 3600; // 1 hour in the future
      
      // 3. ACTION & ASSERTION (Events): Call the function and expect it to emit the correct event
      // We check that an `EscrowCreated` event is emitted with the right arguments.
      // Note that the first escrow created will have an ID of 0.
      await expect(
        escrowFactory.createEscrow(tokenAddress, dues, startTime, endTime, false) // joinAsOrganizer is false
      )
        .to.emit(escrowFactory, "EscrowCreated")
        .withArgs(0, owner.address, tokenAddress, dues);

      // 4. ASSERTION (State): Verify the data was stored correctly on-chain
      // We call our getter function to check the state variables of the new escrow.
      const details = await escrowFactory.getEscrowDetails(0);
      expect(details.organizer).to.equal(owner.address);
      expect(details.tokenContract).to.equal(tokenAddress);
      expect(details.dues).to.equal(dues);
      expect(details.startTime).to.equal(startTime);
      expect(details.endTime).to.equal(endTime);
      expect(details.totalAmount).to.equal(0); // No one has joined yet
      expect(details.finalized).to.be.false;
    });

    it("Should allow the organizer to join upon creation", async function () {
      // 1. SETUP
      const { escrowFactory, mockToken, owner } = await loadFixture(deployEscrowFactoryFixture);
      const tokenAddress = await mockToken.getAddress();
      const dues = ethers.parseUnits("50", 18); // 50 MTK
      const latestTime = await time.latest();
      const endTime = latestTime + 3600;

      // Before the transaction, the factory contract has 0 tokens.
      await expect(mockToken.balanceOf(escrowFactory.target)).to.eventually.equal(0);
      
      // The owner needs to first APPROVE the factory contract to spend their tokens.
      // This is a standard ERC20 two-step process.
      await mockToken.connect(owner).approve(escrowFactory.target, dues);

      // 2. ACTION: Create the escrow with joinAsOrganizer = true
      await escrowFactory.createEscrow(tokenAddress, dues, 0, endTime, true);

      // 3. ASSERTION: Check that the tokens were transferred correctly
      // The factory contract should now hold the 50 MTK dues.
      expect(await mockToken.balanceOf(escrowFactory.target)).to.equal(dues);
      
      // 4. ASSERTION: Check the escrow's state
      const details = await escrowFactory.getEscrowDetails(0);
      expect(details.totalAmount).to.equal(dues);
      
      // We can't directly check the mapping, but the totalAmount being correct is strong evidence.
      // We'll test the depositor mapping more directly when we test joinEscrow.
    });

  });

  // Test suite for the joinEscrow function
  describe("joinEscrow", function () {
    
    it("Should allow a user to join an existing escrow", async function () {
      // 1. SETUP: Create an escrow first
      const { escrowFactory, mockToken, owner, otherAccount } = await loadFixture(deployEscrowFactoryFixture);
      const tokenAddress = await mockToken.getAddress();
      const dues = ethers.parseUnits("100", 18);
      const latestTime = await time.latest();
      const endTime = latestTime + 3600;

      await escrowFactory.createEscrow(tokenAddress, dues, 0, endTime, false);

      // 2. SETUP (Participant): The joining user (otherAccount) must approve the contract
      await mockToken.connect(otherAccount).approve(escrowFactory.target, dues);
      
      // Mint some tokens to the participant so they can pay the dues
      await mockToken.connect(owner).transfer(otherAccount.address, dues);

      // 3. ACTION: The participant joins the escrow (ID 0)
      await escrowFactory.connect(otherAccount).joinEscrow(0, dues);

      // 4. ASSERTION: Check the new totalAmount in the escrow
      const details = await escrowFactory.getEscrowDetails(0);
      expect(details.totalAmount).to.equal(dues);
    });

    it("Should revert if the deposit amount does not match the fixed dues", async function () {
      // 1. SETUP: Create an escrow with fixed dues of 100
      const { escrowFactory, mockToken, otherAccount } = await loadFixture(deployEscrowFactoryFixture);
      const dues = ethers.parseUnits("100", 18);
      await escrowFactory.createEscrow(await mockToken.getAddress(), dues, 0, (await time.latest()) + 3600, false);

      // The user wants to join but will try to send the wrong amount (50)
      const wrongAmount = ethers.parseUnits("50", 18);
      await mockToken.connect(otherAccount).approve(escrowFactory.target, wrongAmount);
      await mockToken.transfer(otherAccount.address, wrongAmount);

      // 2. ACTION & ASSERTION: Expect the transaction to be reverted with the correct error message
      await expect(
        escrowFactory.connect(otherAccount).joinEscrow(0, wrongAmount)
      ).to.be.revertedWith("Deposit amount must equal the set dues");
    });

    it("Should revert if the entry period (startTime) has ended", async function () {
      // 1. SETUP: Create an escrow with a startTime 1 hour from now
      const { escrowFactory, mockToken, owner, otherAccount } = await loadFixture(deployEscrowFactoryFixture);
      const dues = ethers.parseUnits("100", 18);
      const latestTime = await time.latest();
      const startTime = latestTime + 3600; // 1 hour from now
      const endTime = startTime + 3600;   // 2 hours from now

      await escrowFactory.createEscrow(await mockToken.getAddress(), dues, startTime, endTime, false);

      // Setup the participant
      await mockToken.connect(owner).transfer(otherAccount.address, dues);
      await mockToken.connect(otherAccount).approve(escrowFactory.target, dues);

      // 2. ACTION: Fast-forward the blockchain's clock to a point AFTER the startTime
      await time.increaseTo(startTime + 1);

      // 3. ASSERTION: Expect the join attempt to fail with the correct error
      await expect(
        escrowFactory.connect(otherAccount).joinEscrow(0, dues)
      ).to.be.revertedWith("Escrow has already started");
    });

    it("Should revert if contest (endTime) has ended when no startTime is set", async function () {
      // 1. SETUP: Create an escrow with no startTime, ending in 1 hour
      const { escrowFactory, mockToken, owner, otherAccount } = await loadFixture(deployEscrowFactoryFixture);
      const dues = ethers.parseUnits("100", 18);
      const latestTime = await time.latest();
      const endTime = latestTime + 3600; // 1 hour from now

      // Note: startTime is 0
      await escrowFactory.createEscrow(await mockToken.getAddress(), dues, 0, endTime, false);

      // Setup the participant
      await mockToken.connect(owner).transfer(otherAccount.address, dues);
      await mockToken.connect(otherAccount).approve(escrowFactory.target, dues);

      // 2. ACTION: Fast-forward time to be AFTER the endTime
      await time.increaseTo(endTime + 1);
      
      // 3. ASSERTION: Expect the join attempt to fail with the correct error
      await expect(
        escrowFactory.connect(otherAccount).joinEscrow(0, dues)
      ).to.be.revertedWith("Contest has ended & closed to new entries");
    });

  });
});