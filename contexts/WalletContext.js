"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const WalletContext = createContext(undefined);

// Dynamically import WalletTgSdk with no SSR
const WalletTgSdk = dynamic(
  () => import('@uxuycom/web3-tg-sdk').then(mod => mod.WalletTgSdk),
  { ssr: false }
);

export function WalletProvider({ children }) {
  const [ethereumState, setEthereum] = useState(null);
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [sdk, setSdk] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initializeSDK = async () => {
      try {
        const WalletSDK = await WalletTgSdk;
        const walletSdk = new WalletSDK({
          injected: false,
          debug: true,
          projectId: "01649e8c79064059387c12a0d06de368",
          preferredNetwork: "MANTLE_TESTNET",
          onConnect: () => {
            console.log("Wallet SDK Connected");
          },
          onDisconnect: () => {
            console.log("Wallet SDK Disconnected");
            setConnected(false);
            setAddress(null);
          },
          onAccountsChanged: (accounts) => {
            console.log("Accounts changed:", accounts);
            if (accounts.length > 0) {
              setAddress(accounts[0]);
            } else {
              setAddress(null);
              setConnected(false);
            }
          },
        });
        
        console.log("Wallet SDK initialized");
        setSdk(walletSdk);

        // Check if we're in Telegram
        if (typeof window !== 'undefined' && window.Telegram) {
          console.log("Running in Telegram WebApp");
        }
      } catch (error) {
        console.error("Failed to initialize WalletTgSdk:", error);
      }
    };

    initializeSDK();
  }, [isClient]);

  async function handleConnect() {
    if (!sdk || !isClient) {
      console.error("Wallet SDK not initialized or not on client side");
      alert("Wallet SDK not initialized. Please try again.");
      return;
    }

    try {
      console.log("Attempting to connect wallet...");
      
      // Connect using the SDK's connect method
      await sdk.connect();
      
      // Get the provider from window.ethereum after connection
      const provider = window.ethereum;
      console.log("Provider obtained:", provider);
      
      if (!provider) {
        throw new Error("No provider available after connection");
      }

      setEthereum(provider);

      // Request accounts
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      console.log("Accounts received:", accounts);

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet");
      }

      console.log("Connected account:", accounts[0]);
      setAddress(accounts[0]);
      setConnected(true);

      // Set up event listeners
      provider.on('accountsChanged', (newAccounts) => {
        console.log("Accounts changed event:", newAccounts);
        if (newAccounts.length === 0) {
          setAddress(null);
          setConnected(false);
        } else {
          setAddress(newAccounts[0]);
        }
      });

      return accounts[0];
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert(`Failed to connect wallet: ${error.message}`);
      setConnected(false);
      setAddress(null);
    }
  }

  async function handleDisconnect() {
    if (!isClient) return;
    
    try {
      if (sdk) {
        await sdk.disconnect();
      }
      setConnected(false);
      setAddress(null);
      if (ethereumState) {
        ethereumState.removeAllListeners('accountsChanged');
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  const value = {
    ethereumState,
    address,
    connected,
    handleConnect,
    handleDisconnect,
    isClient
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
} 