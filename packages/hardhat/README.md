# Smart Contracts (`hardhat` package)

This package contains all Solidity smart contracts, tests, and deployment scripts for the Escrow Prize Pool project.

## 🛠️ Tech Stack
- **Solidity:** Smart contract language
- **Hardhat:** Development and testing framework
- **Ethers.js:** Blockchain interaction library
- **OpenZeppelin Contracts:** For standard interfaces like `IERC20`

## 📝 Contracts
- **`contracts/Greeter.sol`**
  - **Purpose:** A simple contract used to verify the initial monorepo integration with the frontend.
  - **Status:** COMPLETE.

- **`contracts/EscrowFactory.sol`**
  - **Purpose:** The main contract for v0.1. It will manage the creation and funding of all prize pools.
  - **Status:** NOT STARTED.
  - **Planned Functions:**
    - `createEscrow(address _tokenContract)`: Creates a new prize pool.
    - `deposit(uint256 _escrowId, uint256 _amount)`: Allows users to deposit ERC20 tokens.
    - `getEscrowDetails(uint256 _escrowId)`: A view function to read pool data.

## ⚙️ Workflow Commands
Run these commands from this directory (`packages/hardhat`).

- `npm run compile`: Compiles all contracts.
- `npm run test`: Runs unit tests.
- `npm run node`: Starts the local Hardhat node on `chainId: 1337`.
- `npm run deploy:localhost`: Deploys the test contract (`deployGreeter.ts`). This will need to be updated for the `EscrowFactory`.

## 🚀 Next Steps
1.  Implement the `EscrowFactory.sol` contract with its struct and core functions.
2.  Write comprehensive unit tests for `EscrowFactory.sol`.
3.  Create a new deployment script, `deployEscrow.ts`.