// packages/next-app/app/page.tsx
'use client'; // This is a Client Component

import { useState } from 'react';
import { ethers } from 'ethers';
import GreeterAbi from '@escrow-monorepo/hardhat/artifacts/contracts/Greeter.sol/Greeter.json';

// PASTE THE DEPLOYED CONTRACT ADDRESS HERE
const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [newGreeting, setNewGreeting] = useState('');

  async function getProviderAndSigner() {
    // We are using the browser's provider injected by MetaMask or other wallets
    // For local testing, your wallet must be connected to the "Localhost 8545" network
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  }

  async function fetchGreeting() {
    const { provider } = (await getProviderAndSigner()) || {};
    if (!provider) return;
    
    const contract = new ethers.Contract(GREETER_ADDRESS, GreeterAbi.abi, provider);
    try {
      const data = await contract.greet();
      setGreeting(data);
      console.log('Greeting from contract:', data);
    } catch (err) {
      console.error('Error fetching greeting:', err);
    }
  }

  async function handleSetGreeting() {
    if (!newGreeting) return;
    const { signer } = (await getProviderAndSigner()) || {};
    if (!signer) return;

    const contract = new ethers.Contract(GREETER_ADDRESS, GreeterAbi.abi, signer);
    try {
      const transaction = await contract.setGreeting(newGreeting);
      await transaction.wait(); // Wait for the transaction to be mined
      setNewGreeting('');
      await fetchGreeting(); // Fetch the new greeting to update the UI
    } catch (err) {
      console.error('Error setting greeting:', err);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="space-y-6 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">Greeter dApp</h1>
        <div className="p-4 border border-gray-600 rounded-lg">
          <h2 className="text-2xl">Current Greeting: <span className="font-mono text-yellow-400">{greeting}</span></h2>
          <button onClick={fetchGreeting} className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Fetch Greeting</button>
        </div>
        <div className="p-4 border border-gray-600 rounded-lg space-y-2">
          <input 
            onChange={(e) => setNewGreeting(e.target.value)} 
            value={newGreeting} 
            placeholder="Set a new greeting"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSetGreeting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Set Greeting</button>
        </div>
      </div>
    </main>
  );
}