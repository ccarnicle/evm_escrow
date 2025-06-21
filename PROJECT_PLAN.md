# Project Plan: Escrow Prize Pool (v0.1)

This project is a minimal, hackathon-ready escrow-based prize pool system.

## 🎯 High-Level Goal
To build a modular web3 app that can be quickly rebranded for different use cases (fantasy sports, esports, group funding). The v0.1 MVP focuses on creating and joining prize pools with ERC20 tokens.

## 🛠️ Core Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, ethers.js
- **Smart Contracts:** Solidity, Hardhat
- **Authentication:** Privy
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
        │   ├── pool/
        │   │   └── [id]/
        │   │       └── page.tsx      # Dynamic pool detail page
        │   ├── types/
        │   │   └── window.d.ts       # Global type definitions
        │   ├── globals.css           # Global styles
        │   ├── layout.tsx            # Root layout component
        │   ├── page.tsx              # Homepage
        │   └── favicon.ico           # Site favicon
        ├── components/          # Reusable UI components
        │   ├── CreatePoolForm.tsx    # Pool creation form
        │   ├── DistributeWinningsForm.tsx # Form for distributing winnings
        │   ├── JoinPoolForm.tsx      # Form for joining a pool
        │   ├── PoolCard.tsx          # Pool display card
        │   ├── Header.tsx            # Site header
        │   ├── Footer.tsx            # Site footer
        │   └── ui/
        │       └── FormInput.tsx     # Reusable form input component
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

## ✅ v0.1 Status: MVP COMPLETE

All core features for the initial version have been successfully implemented.

1.  **Smart Contracts Finalized:** The `EscrowFactory.sol` contract is complete with functions for `createEscrow`, `joinEscrow`, and `distributeWinnings`. It is fully tested and deployed.

2.  **Frontend Foundation Built:** The Next.js application has a complete layout, theme, and component structure with a global `Web3Context`.

3.  **"Create Pool" Feature Complete:** The `/create` page allows users to define and create new prize pools, correctly handling the `approve` and `createEscrow` transaction flow.

4.  **"View Pool" Feature Complete:** The homepage (`/`) fetches and displays all created pools. The dynamic detail page (`/pool/[id]`) successfully fetches and displays on-chain data for a specific pool.

5.  **"Join Pool" Feature Complete:** The pool detail page includes a form for users to join a pool, handling both fixed-dues and open-contribution scenarios with the necessary `approve` and `joinEscrow` logic.

6.  **"Distribute Winnings" Feature Complete:** The pool detail page conditionally displays a secure form for the organizer to close the pool and distribute the winnings after the end time has passed. This includes client-side validation for payout totals and duplicate addresses.

7.  **Privy Integration Complete:**
       **Goal:** Streamline user authentication and wallet management, making the app more accessible to non-web3 native users.
       **Implementation:** Replaced the original `Web3Context` and manual wallet connection logic with Privy's React SDK. The application now uses `PrivyProvider` at the root level and a refactored `Web3Context` that leverages the `usePrivy` and `useWallets` hooks. This provides a seamless login experience with both embedded wallets (for email/social logins) and external wallets like MetaMask.

## 🚀 v0.2 Potential Features & Improvements

This section captures ideas for the next iteration of the project, based on observations during v0.1 development.

1.  **Enforce One Entry Per Wallet (Contract Level):**
       **Goal:** For specific pool types (e.g., fantasy leagues), prevent a single wallet from joining more than once.
       **Implementation Idea:** Add a `bool limitToOneEntry` flag to the `Escrow` struct. In the `createEscrow` function, allow the organizer to set this flag. In the `joinEscrow` function, add a `require(escrow.depositors[msg.sender] == 0, "You have already joined this pool.")` check if the flag is true.

2.  **Enforce One Payout Per Winner (Contract Level):**
       **Goal:** Prevent an organizer from accidentally or maliciously sending funds to the same address multiple times in a single distribution.
       **Implementation Idea:** In the `distributeWinnings` function, use a `memory` mapping to track addresses that have already been assigned a payout within the current call. Example: `mapping(address => bool) memory hasBeenPaid;` and check against it in the loop.

4.  **Improve UX with EIP-2612 `permit`:**
       **Goal:** For supported ERC20 tokens (like USDC), eliminate the two-step `approve`/`transfer` flow and combine it into a single "Join Pool" transaction.
       **Implementation Idea:** Create a new function in the contract (e.g., `joinWithPermit`) that accepts a signature as an argument. The frontend will have the user sign an off-chain message (free), and then send that signature to the new function.

5.  **Display Participant List:**
       **Goal:** Make the pool detail page more dynamic and engaging by showing who has joined.
       **Implementation Idea:** The contract already emits `DepositMade` events. The frontend can query these events for a specific `escrowId` and display the list of depositors.