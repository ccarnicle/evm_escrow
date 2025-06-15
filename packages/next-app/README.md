# Frontend (`next-app` package)

This package contains the Next.js frontend for the Escrow Prize Pool project.

## 🛠️ Tech Stack
- **Next.js 14+:** React framework (using App Router)
- **Tailwind CSS:** For styling
- **ethers.js:** For smart contract interaction
- **Privy:** For user authentication (to be integrated)

## 🧩 Core Features
- **Current Feature:**
  - `app/page.tsx`: A **temporary test component** that interacts with the `Greeter.sol` contract to verify the monorepo connection. It can successfully read and write data to the local blockchain.

- **Planned v0.1 Features:**
  - A rebrandable landing page to list active pools (`/`).
  - A form for organizers to create new pools (`/create`).
  - A detailed view for a specific pool where users can deposit funds (`/pool/[id]`).
  - Integration with Privy for simple email/social login and wallet management.

## ⚙️ Workflow Commands
Run this command from this directory (`packages/next-app`).

- `npm run dev`: Starts the Next.js development server on `http://localhost:3000`.

## ✅ Current Status
The initial integration with the `@escrow-monorepo/hardhat` package is **COMPLETE and verified**. The application can successfully import contract ABIs and interact with a deployed contract on the local Hardhat node.

## 🚀 Next Steps
1.  Replace the temporary `Greeter` test page with the real application layout (`Header`, `Footer`, etc.).
2.  Build the static UI for the `CreatePoolForm` and `PoolCard` components.
3.  Begin integrating the Privy SDK for user authentication.