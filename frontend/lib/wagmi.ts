import { http, createConfig } from "wagmi";
import { base, baseSepolia, mantleSepoliaTestnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default-project-id";
const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export const config = createConfig({
  chains: [base, baseSepolia, mantleSepoliaTestnet],
  connectors: [
    // Farcaster MiniApp connector
    miniAppConnector(),
    // Injected handles MetaMask, Coinbase Wallet, etc.
    injected(),
    // WalletConnect for mobile wallets
    walletConnect({
      projectId,
      metadata: {
        name: "Alien Invaders GameFi",
        description: "Play Space Invaders and earn ETH rewards",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: ["https://spaceinvaders.game/icon.png"],
      },
    }),
  ],
  transports: {
    [base.id]: http(customRpcUrl, {
      retryCount: 5,
      retryDelay: 2000,
      timeout: 30000,
    }),
    [baseSepolia.id]: http(customRpcUrl, {
      retryCount: 5,
      retryDelay: 2000,
      timeout: 30000,
    }),
    [mantleSepoliaTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
