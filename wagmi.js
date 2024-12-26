import { http, createConfig } from 'wagmi';
import { mantleSepoliaTestnet } from 'wagmi/chains';
import { uxuyWalletConnector } from './lib/uxuyWalletConnector';

export const config = createConfig({
  chains: [mantleSepoliaTestnet],
  connectors: [
    uxuyWalletConnector({
      chains: [mantleSepoliaTestnet],
      options: {
        projectId: "01649e8c79064059387c12a0d06de368",
        preferredNetwork: "MANTLE_TESTNET",
        shimDisconnect: true,
        webview: true,
      },
    }),
  ],
  transports: {
    [mantleSepoliaTestnet.id]: http(),
  },
});


