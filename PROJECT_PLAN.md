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

## ✅ Current Project Status (End of Day 1)

**Week 1 Goal: Foundations & Core Logic**

The initial project setup and integration testing are **COMPLETE**.

1.  **Monorepo Setup:** The `packages/hardhat` and `packages/next-app` workspaces are configured and linked.
2.  **Integration Test:** A simple `Greeter.sol` contract has been created, deployed to a local Hardhat node, and successfully connected to the Next.js frontend. Both read (`greet()`) and write (`setGreeting()`) operations have been verified.
3.  **Local Dev Environment:** The local development environment is fully functional, including a custom "Hardhat Local" network in MetaMask on `chainId: 1337`.

## 🚀 Immediate Next Steps
1.  Begin implementation of the primary smart contract: **`EscrowFactory.sol`**.
2.  Start scaffolding the static UI components in the Next.js app.