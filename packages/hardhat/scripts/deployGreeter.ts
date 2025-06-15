// packages/hardhat/scripts/deployGreeter.ts
import { ethers } from "hardhat";

async function main() {
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!"); // Initial greeting

  await greeter.waitForDeployment();
  const contractAddress = await greeter.getAddress();
  console.log(`Greeter deployed to: ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});