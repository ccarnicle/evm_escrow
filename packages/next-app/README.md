# Frontend (`next-app` package)

This package contains the Next.js frontend for the Escrow Prize Pool project.

## 🛠️ Tech Stack
- **Next.js 14+:** React framework (using App Router)
- **Tailwind CSS v3:** For styling
- **ethers.js v6:** For smart contract interaction
- **React Context:** For global state management (wallet connection)

## 🧩 Core Features
- **Landing Page (`/`):** Displays a list of all active prize pools by reading live data from the `EscrowFactory` smart contract.
- **Create Pool Page (`/create`):** A page with a form that allows users to create new prize pools.
- **Wallet Connection:** A `Web3Context` provides global state for the user's wallet. The header includes a "Connect Wallet" button that uses this context to connect via MetaMask and display the user's address.
- **Core Components:** `Header`, `Footer`, `PoolCard`, `CreatePoolForm`.
- **Theming:** A configurable, modern dark theme is implemented via `tailwind.config.ts` and CSS variables.

## ⚙️ Workflow Commands
Run these commands from this directory (`packages/next-app`).

- `npm run dev`: Starts the Next.js development server on `http://localhost:3000`.

## ✅ Current Status
- **Live Data:** The application successfully fetches and displays the list of all created prize pools by connecting to a local Hardhat node and querying `EscrowCreated` events from the deployed `EscrowFactory` contract.
- **Wallet Integration:** The wallet connection flow is fully functional. Users can connect their MetaMask wallet, and the application state updates to reflect the connected account.
- **"Create Pool" Feature Complete:** The UI and transaction logic for creating a new pool are fully implemented. This includes the critical two-step `approve` and `createEscrow` flow, providing a robust example of a core dApp user interaction.

## 🚀 Next Steps
1.  **Build Pool Detail Page (`/pool/[id]`):** Create the dynamic page to display detailed information for a single pool using the `getEscrowDetails` contract function.
2.  **Implement "Join Pool" Feature:** On the detail page, build the UI and transaction logic (`approve` & `joinEscrow`) for users to deposit funds and join a pool.
3.  **Implement "Distribute Winnings" Feature:** Build the UI for the pool organizer to close the pool after its end time and distribute the total funds to the winners by calling the `distributeWinnings` function.
4.  **Display Participant Data:** Enhance the detail page by showing a list of depositors to make the application more interactive.
