'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ethers, BrowserProvider, Signer } from 'ethers';
import { ESCROW_FACTORY_ADDRESS, ESCROW_FACTORY_ABI } from '@/lib/contracts';

// Define the shape of the context data
interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: Signer | null;
  contract: ethers.Contract | null;
  account: string | null;
  connectWallet: () => Promise<void>;
}

// Create the context with a default null value
const Web3Context = createContext<Web3ContextType | null>(null);

// Create the provider component
export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const currentSigner = await browserProvider.getSigner();
      const factoryContract = new ethers.Contract(ESCROW_FACTORY_ADDRESS, ESCROW_FACTORY_ABI, currentSigner);

      setProvider(browserProvider);
      setSigner(currentSigner);
      setContract(factoryContract);
      setAccount(accounts[0]);

    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const value = { provider, signer, contract, account, connectWallet };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

// Create a custom hook for easy consumption of the context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}