"use client";

import React, { useState, useEffect } from "react";
import { CoinbaseWalletLogo } from "./CoinbaseWalletLogo";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import toast from "react-hot-toast";

const buttonStyles = {
  background: "#4c1d95",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  fontSize: "16px",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.3s",
};

const connectedContainerStyles = {
  display: "flex",
  alignItems: "center",
  fontFamily: "Arial, sans-serif",
  padding: "10px",
  backgroundColor: "#F0F4FF",
  borderRadius: "8px",
  color: "#333",
  fontSize: "16px",
  marginTop: "10px",
  gap: "10px",
};

const copyButtonStyles = {
  marginLeft: "10px",
  backgroundColor: "#4c1d95",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

export default function CoinbaseButton() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect({
    onSuccess(data) {
      toast.success("Wallet connected successfully!");
      router.push('/details'); // Redirect to details page after successful connection
    },
  });
  const { disconnect } = useDisconnect();
  const [copySuccess, setCopySuccess] = useState("");

  // Log available connectors
  useEffect(() => {
    console.log('Available connectors:', connectors);
  }, [connectors]);

  // Log connection error
  useEffect(() => {
    if (error) {
      console.error('Connection error:', error);
      toast.error(error.message);
    }
  }, [error]);

  async function onConnectClick() {
    try {
      console.log('Starting connection...');
      const connector = connectors[0]; // Uxuy Wallet connector
      if (!connector) {
        throw new Error('No connector found');
      }
      console.log('Using connector:', connector.name);
      
      await connect({ connector });
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error(error.message || "Failed to connect wallet");
    }
  }

  async function onDisconnectClick() {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
      router.push("/");
    } catch (error) {
      console.error('Disconnect failed:', error);
      toast.error("Failed to disconnect wallet");
    }
  }

  function copyToClipboard() {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess("Copied!");
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  }

  if (isConnected && address) {
    return (
      <div style={connectedContainerStyles}>
        <p>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        <button style={copyButtonStyles} onClick={copyToClipboard}>
          {copySuccess ? copySuccess : "Copy Address"}
        </button>
        <button style={buttonStyles} onClick={onDisconnectClick}>
          <CoinbaseWalletLogo />
          <span style={{ marginLeft: "10px" }}>Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button 
      style={{
        ...buttonStyles,
        opacity: isPending ? 0.7 : 1,
        cursor: isPending ? 'wait' : 'pointer'
      }} 
      onClick={onConnectClick}
      disabled={isPending}
    >
      <CoinbaseWalletLogo />
      <span style={{ marginLeft: "10px" }}>
        {isPending ? "Connecting..." : "Connect Wallet"}
      </span>
    </button>
  );
}
