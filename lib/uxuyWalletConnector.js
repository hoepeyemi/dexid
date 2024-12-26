import { createConnector } from 'wagmi';

export function uxuyWalletConnector(config) {
  let sdk = null;
  let WalletTgSdk = null;

  return createConnector((actions) => ({
    id: 'uxuyWallet',
    name: 'Uxuy Wallet',
    type: 'uxuyWallet',
    
    async setup() {
      try {
        // Dynamically import the SDK only on the client side
        if (typeof window !== 'undefined') {
          const module = await import('@uxuycom/web3-tg-sdk');
          WalletTgSdk = module.WalletTgSdk;
        }
      } catch (error) {
        console.error('Failed to load WalletTgSdk:', error);
      }
      return;
    },
    
    connect: async ({ chainId } = {}) => {
      console.log('Initializing UxuyWallet connection...');
      try {
        if (!WalletTgSdk) {
          throw new Error('WalletTgSdk not loaded');
        }

        if (!sdk) {
          console.log('Creating new WalletTgSdk instance...');
          sdk = new WalletTgSdk({
            projectId: "01649e8c79064059387c12a0d06de368",
            preferredNetwork: "MANTLE_TESTNET",
            debug: true,
            injected: false,
            webview: true,
          });
        }

        // Initialize Telegram WebApp
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
        }

        console.log('Requesting ethereum provider...');
        const { ethereum } = sdk;
        
        if (!ethereum) {
          throw new Error('No ethereum provider available from SDK');
        }
        console.log('Provider found:', ethereum);

        console.log('Requesting accounts...');
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log('Accounts received:', accounts);

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts received from wallet');
        }

        console.log('Requesting chain ID...');
        const chainId_ = await ethereum.request({
          method: 'eth_chainId',
        });
        console.log('Chain ID received:', chainId_);

        // Set up event listeners
        ethereum.on('accountsChanged', (newAccounts) => {
          if (newAccounts.length === 0) {
            actions.resetState();
          } else {
            actions.update({ account: newAccounts[0] });
          }
        });

        ethereum.on('chainChanged', (newChainId) => {
          actions.update({ chainId: Number(newChainId) });
        });

        ethereum.on('disconnect', () => {
          actions.resetState();
        });

        return { 
          account: accounts[0], 
          chain: { 
            id: Number(chainId_),
            unsupported: false 
          } 
        };
      } catch (error) {
        console.error('UxuyWallet connection error:', error);
        throw error;
      }
    },

    disconnect: async () => {
      try {
        if (sdk) {
          const { ethereum } = sdk;
          if (ethereum) {
            ethereum.removeAllListeners('accountsChanged');
            ethereum.removeAllListeners('chainChanged');
            ethereum.removeAllListeners('disconnect');
          }
        }
        actions.resetState();
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    },

    getAccount: async () => {
      try {
        if (!sdk) return null;
        const { ethereum } = sdk;
        if (!ethereum) return null;
        
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        });
        return accounts[0];
      } catch (error) {
        console.error('Error getting account:', error);
        return null;
      }
    },

    getChainId: async () => {
      try {
        if (!sdk) throw new Error('SDK not initialized');
        const { ethereum } = sdk;
        if (!ethereum) throw new Error('Provider not found');

        const chainId = await ethereum.request({
          method: 'eth_chainId',
        });
        return Number(chainId);
      } catch (error) {
        console.error('Error getting chainId:', error);
        throw error;
      }
    },

    getProvider: async () => {
      if (!sdk) throw new Error('SDK not initialized');
      const { ethereum } = sdk;
      if (!ethereum) {
        throw new Error('Provider not found');
      }
      return ethereum;
    },

    isAuthorized: async () => {
      try {
        if (!sdk) return false;
        const { ethereum } = sdk;
        if (!ethereum) return false;

        const accounts = await ethereum.request({
          method: 'eth_accounts',
        });
        return !!accounts[0];
      } catch {
        return false;
      }
    },

    switchChain: async ({ chainId }) => {
      try {
        if (!sdk) throw new Error('SDK not initialized');
        const { ethereum } = sdk;
        if (!ethereum) throw new Error('Provider not found');

        const id = `0x${chainId.toString(16)}`;
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: id }],
        });
        return { id: chainId, unsupported: false };
      } catch (error) {
        console.error('Error switching chain:', error);
        throw error;
      }
    },
  }));
} 