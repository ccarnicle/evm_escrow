# Project Plan: Escrow Prize Pool (v0.1)

This project is a minimal, hackathon-ready escrow-based prize pool system.

## 🎯 High-Level Goal
To build a modular web3 app that can be quickly rebranded for different use cases (fantasy sports, esports, group funding). The v0.1 MVP focuses on creating and joining prize pools with ERC20 tokens.

## 🛠️ Core Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, ethers.js
- **Smart Contracts:** Solidity, Hardhat
- **Authentication:** Privy (to be integrated)
- **Structure:** npm workspaces monorepo

## 📂 Monorepo Structure
This repository uses npm workspaces to manage two primary packages:

- **`packages/hardhat`**: Contains all Solidity smart contracts, tests, and deployment scripts. See the `README.md` in that directory for specifics.
- **`packages/next-app`**: Contains the Next.js frontend application. See the `README.md` in that directory for specifics.

## 📁 Project File Structure

```
escrow-monorepo/
├── package.json                 # Root workspace configuration
├── package-lock.json           # Lock file for dependencies
├── PROJECT_PLAN.md             # This project planning document
├── .gitignore                  # Git ignore rules
├── .vscode/                    # VS Code workspace settings
└── packages/
    ├── hardhat/                # Smart contract package
    │   ├── contracts/
    │   │   ├── EscrowFactory.sol    # Main escrow factory contract
    │   │   └── MockToken.sol         # ERC20 token for testing
    │   ├── scripts/
    │   │   └── deploy.ts             # Contract deployment script
    │   ├── test/
    │   │   └── EscrowFactory.ts      # Contract test suite
    │   ├── hardhat.config.ts         # Hardhat configuration
    │   ├── tsconfig.json             # TypeScript config
    │   ├── package.json              # Hardhat package dependencies
    │   ├── README.md                 # Hardhat package documentation
    │   ├── artifacts/                # Compiled contract artifacts
    │   ├── cache/                    # Hardhat cache
    │   ├── typechain-types/          # Generated TypeScript types
    │   └── .gitignore                # Hardhat-specific ignore rules
    │
    └── next-app/                # Frontend application package
        ├── app/                 # Next.js App Router
        │   ├── create/
        │   │   └── page.tsx          # Create pool page
        │   ├── types/
        │   │   └── window.d.ts       # Global type definitions
        │   ├── globals.css           # Global styles
        │   ├── layout.tsx            # Root layout component
        │   ├── page.tsx              # Homepage
        │   └── favicon.ico           # Site favicon
        ├── components/          # Reusable UI components
        │   ├── CreatePoolForm.tsx    # Pool creation form
        │   ├── Footer.tsx            # Site footer
        │   ├── Header.tsx            # Site header
        │   └── PoolCard.tsx          # Pool display card
        ├── lib/                 # Utility libraries
        │   ├── contexts/
        │   │   └── Web3Context.tsx   # Web3 context provider
        │   └── contracts.ts          # Contract interaction utilities
        ├── public/              # Static assets
        │   ├── file.svg
        │   ├── globe.svg
        │   ├── next.svg
        │   ├── vercel.svg
        │   └── window.svg
        ├── next.config.ts            # Next.js configuration
        ├── tailwind.config.ts        # Tailwind CSS configuration
        ├── tsconfig.json             # TypeScript configuration
        ├── package.json              # Next.js package dependencies
        ├── README.md                 # Next.js package documentation
        ├── postcss.config.mjs        # PostCSS configuration
        ├── eslint.config.mjs         # ESLint configuration
        ├── next-env.d.ts             # Next.js type definitions
        ├── .next/                    # Next.js build output
        ├── node_modules/             # Frontend dependencies
        └── .gitignore                # Next.js-specific ignore rules
```

## ✅ Current Project Status (End of "Create Pool" Feature)

**Week 1 & 2 Goals: Foundations & Core Feature Implementation - COMPLETE**

1.  **Smart Contracts Finalized:** The `EscrowFactory.sol` and `MockToken.sol` contracts are feature-complete and fully tested. The deployment system has been migrated from Hardhat Ignition to a more robust, classic Hardhat script (`scripts/deploy.ts`).

2.  **Frontend Foundation Built:** The Next.js application has a complete layout, theme, and component structure. A `Web3Context` has been implemented to manage wallet state globally.

3.  **Live Data Integration:**
    - The homepage (`/`) successfully connects to the local blockchain, fetches the list of all created pools by querying past events, and displays them as `PoolCard` components.
    - Wallet connection is fully functional, allowing users to connect via MetaMask.

4.  **"Create Pool" Feature Complete:**
    - The `/create` page contains a fully functional form for creating new prize pools.
    - The crucial two-step transaction flow (`approve` then `createEscrow`) has been successfully implemented, providing a clear and working user experience for contract interaction that requires token spending.

## 🚀 Immediate Next Steps
1.  **Build Pool Detail Page (`/pool/[id]`):**
    - Create the dynamic page structure to display detailed information for a single pool.
    - Use the `getEscrowDetails` function from the smart contract to fetch and display data like total pot, end time, organizer, etc.

2.  **Implement "Join Pool" Feature:**
    - On the pool detail page, add a form or modal for users to join the pool.
    - Implement the `approve` and `joinEscrow` transaction logic, mirroring the flow from the "Create Pool" feature.
    - Handle different scenarios, such as pools with fixed dues vs. open-contribution pools.

3.  **Implement "Distribute Winnings" (Close Pool) Feature:**
    - On the pool detail page, create a new UI section that is visible only to the pool's organizer.
    - This UI should only be enabled after the pool's `endTime` has passed.
    - Build a dynamic form allowing the organizer to specify recipient addresses and payout amounts.
    - Add client-side validation to ensure the total payout matches the pool's total amount before sending the transaction.
    - Implement the logic to call the `distributeWinnings` function.

4.  **Integrate Privy:**
    - Begin planning the integration of Privy for a smoother user authentication flow. 

5.  **Enhance UI with More Data:**
    - Display a list of participants/depositors on the pool detail page to create a more dynamic and engaging experience.

6.  **Prepare for v0.2:**
    - Research implementing a one-click transaction solution for supported tokens (like USDC) using EIP-2612 `permit`.