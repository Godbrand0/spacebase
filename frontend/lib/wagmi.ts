import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default-project-id";
const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    // Farcaster MiniApp connector (priority for MiniApp environment)
    miniAppConnector(),
    injected(),
    metaMask(),
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
      retryDelay: 2000, // 2 second delay between retries (increased from 1s)
      timeout: 30000, // 30 seconds timeout
    }),
    [baseSepolia.id]: http(customRpcUrl, {
      retryCount: 5,
      retryDelay: 2000, // 2 second delay between retries (increased from 1s)
      timeout: 30000, // 30 seconds timeout
    }),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
