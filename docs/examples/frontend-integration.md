# Frontend Integration Examples

This document provides examples for integrating the SpaceInvadersGame contract with a React frontend using modern Web3 libraries.

## 📋 Prerequisites

- Next.js application
- RainbowKit for wallet connection
- Ethers.js or Wagmi for contract interaction
- Contract deployed on Base network

## 🏗️ Project Setup

### Package Dependencies

```json
{
  "dependencies": {
    "next": "16.1.4",
    "react": "19.0.0",
    "ethers": "^6.8.0",
    "@rainbow-me/rainbowkit": "^2.0.0",
    "wagmi": "^2.5.0",
    "viem": "^2.7.0",
    "@tanstack/react-query": "^5.14.0"
  }
}
```

### Contract Configuration

```javascript
// lib/contracts.js
export const CONTRACT_ADDRESS = "0xEa0f94BD92DbcE3D340E660311aA1cF9Aacbe11a";

export const CONTRACT_ABI = [
  // ... ABI from contract compilation
];

export const BASE_CHAIN = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
    public: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://basescan.org" },
  },
};
```

## 🌐 Wagmi + RainbowKit Setup

### Configure Wagmi

```javascript
// lib/wagmi.js
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: "your-project-id" }),
  ],
  transports: {
    [base.id]: http(),
  },
});
```

### App Provider Setup

```javascript
// app/providers.jsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Layout Integration

```javascript
// app/layout.js
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 🎮 Game Hook Implementation

### useGame Hook

```javascript
// hooks/useGame.js
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contracts";

export function useGame() {
  const { address } = useAccount();
  const [currentSession, setCurrentSession] = useState(null);
  const [gameState, setGameState] = useState(null);

  // Contract interactions
  const { writeContract, isPending: isLoading } = useWriteContract();

  // Read session info
  const { data: sessionInfo, refetch: refetchSession } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getSessionInfo",
    args: currentSession ? [currentSession] : undefined,
    enabled: !!currentSession,
  });

  // Read player sessions
  const { data: playerSessions } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPlayerSessions",
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Watch for game events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: "LevelCompleted",
    onLogs(logs) {
      logs.forEach((log) => {
        const { sessionId, level } = log.args;
        if (sessionId === currentSession) {
          refetchSession();
          console.log(`Level ${level} completed!`);
        }
      });
    },
  });

  // Start new game
  const startGame = async () => {
    try {
      const result = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "startGame",
      });

      // Wait for transaction and extract sessionId from events
      const receipt = await result.wait();
      const gameStartedEvent = receipt.logs.find(
        (log) => log.eventName === "GameStarted",
      );

      if (gameStartedEvent) {
        const sessionId = gameStartedEvent.args.sessionId;
        setCurrentSession(sessionId);
        return sessionId;
      }
    } catch (error) {
      console.error("Error starting game:", error);
      throw error;
    }
  };

  // Complete level
  const completeLevel = async (level, score, aliensDestroyed) => {
    if (!currentSession) throw new Error("No active session");

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "completeLevel",
        args: [currentSession, level, score, aliensDestroyed, "0x"],
      });
    } catch (error) {
      console.error("Error completing level:", error);
      throw error;
    }
  };

  // Claim rewards
  const claimRewards = async () => {
    if (!currentSession) throw new Error("No active session");

    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "claimRewards",
        args: [currentSession],
      });
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    }
  };

  // Update game state when session info changes
  useEffect(() => {
    if (sessionInfo) {
      setGameState({
        player: sessionInfo[0],
        currentLevel: Number(sessionInfo[1]),
        levelsCompleted: Number(sessionInfo[2]),
        totalRewards: sessionInfo[3],
        startTime: new Date(Number(sessionInfo[4]) * 1000),
        isActive: sessionInfo[5],
        isCompleted: sessionInfo[6],
      });
    }
  }, [sessionInfo]);

  return {
    currentSession,
    gameState,
    playerSessions,
    startGame,
    completeLevel,
    claimRewards,
    isLoading,
  };
}
```

## 🎨 Game UI Components

### Wallet Connection Component

```javascript
// components/WalletConnect.jsx
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnect() {
  return (
    <div className="flex justify-center p-4">
      <ConnectButton />
    </div>
  );
}
```

### Game Status Component

```javascript
// components/GameStatus.jsx
"use client";

import { useGame } from "@/hooks/useGame";
import { formatEther } from "viem";

export function GameStatus() {
  const { gameState, currentSession } = useGame();

  if (!currentSession || !gameState) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No active game</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Game Status</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Current Level</p>
          <p className="text-2xl font-bold">{gameState.currentLevel}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Levels Completed</p>
          <p className="text-2xl font-bold">{gameState.levelsCompleted}/5</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Rewards Earned</p>
          <p className="text-2xl font-bold">
            {formatEther(gameState.totalRewards)} ETH
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p
            className={`text-lg font-bold ${
              gameState.isCompleted
                ? "text-green-600"
                : gameState.isActive
                  ? "text-blue-600"
                  : "text-red-600"
            }`}
          >
            {gameState.isCompleted
              ? "Completed"
              : gameState.isActive
                ? "Active"
                : "Abandoned"}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Game Controls Component

```javascript
// components/GameControls.jsx
"use client";

import { useState } from "react";
import { useGame } from "@/hooks/useGame";

export function GameControls() {
  const { startGame, completeLevel, claimRewards, gameState, isLoading } =
    useGame();
  const [levelData, setLevelData] = useState({
    level: 1,
    score: 0,
    aliensDestroyed: 11,
  });

  const handleStartGame = async () => {
    try {
      await startGame();
    } catch (error) {
      alert("Error starting game: " + error.message);
    }
  };

  const handleCompleteLevel = async () => {
    try {
      await completeLevel(
        levelData.level,
        levelData.score,
        levelData.aliensDestroyed,
      );
      // Reset for next level
      setLevelData((prev) => ({
        ...prev,
        level: prev.level + 1,
        aliensDestroyed: (prev.level + 1) * 11,
      }));
    } catch (error) {
      alert("Error completing level: " + error.message);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
      alert("Rewards claimed successfully!");
    } catch (error) {
      alert("Error claiming rewards: " + error.message);
    }
  };

  if (!gameState) {
    return (
      <div className="text-center p-4">
        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Starting..." : "Start New Game"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {gameState.isActive && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Complete Level {levelData.level}</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <input
              type="number"
              placeholder="Score"
              value={levelData.score}
              onChange={(e) =>
                setLevelData((prev) => ({
                  ...prev,
                  score: Number(e.target.value),
                }))
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Aliens"
              value={levelData.aliensDestroyed}
              onChange={(e) =>
                setLevelData((prev) => ({
                  ...prev,
                  aliensDestroyed: Number(e.target.value),
                }))
              }
              className="p-2 border rounded"
            />
            <span className="p-2 text-sm text-gray-600">
              Expected: {levelData.level * 11}
            </span>
          </div>
          <button
            onClick={handleCompleteLevel}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Completing..." : "Complete Level"}
          </button>
        </div>
      )}

      {!gameState.isActive && gameState.levelsCompleted > 0 && (
        <button
          onClick={handleClaimRewards}
          disabled={isLoading}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
        >
          {isLoading ? "Claiming..." : "Claim Rewards"}
        </button>
      )}
    </div>
  );
}
```

## 📊 Game History Component

### Player Sessions Display

```javascript
// components/GameHistory.jsx
"use client";

import { useGame } from "@/hooks/useGame";
import { formatEther } from "viem";
import { formatDistance } from "date-fns";

export function GameHistory() {
  const { playerSessions } = useGame();
  const { data: sessions } = useReadContracts({
    contracts:
      playerSessions?.map((sessionId) => ({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getSessionInfo",
        args: [sessionId],
      })) || [],
  });

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">No game history</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Game History</h2>

      <div className="space-y-4">
        {sessions.map((session, index) => {
          if (!session.result) return null;

          const [
            player,
            currentLevel,
            levelsCompleted,
            totalRewards,
            startTime,
            isActive,
            isCompleted,
          ] = session.result;

          return (
            <div key={playerSessions[index]} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Session #{playerSessions[index]}</p>
                  <p className="text-sm text-gray-600">
                    Started{" "}
                    {formatDistance(
                      new Date(Number(startTime) * 1000),
                      new Date(),
                      { addSuffix: true },
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold ${
                      isCompleted
                        ? "text-green-600"
                        : isActive
                          ? "text-blue-600"
                          : "text-red-600"
                    }`}
                  >
                    {isCompleted
                      ? "Completed"
                      : isActive
                        ? "Active"
                        : "Abandoned"}
                  </p>
                  <p className="text-sm">
                    Level {Number(currentLevel)} • {Number(levelsCompleted)}/5
                    completed
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Rewards: {formatEther(totalRewards)} ETH
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## 🎯 Main Game Page

### Complete Game Interface

```javascript
// app/game/page.jsx
"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { GameStatus } from "@/components/GameStatus";
import { GameControls } from "@/components/GameControls";
import { GameHistory } from "@/components/GameHistory";
import { useAccount } from "wagmi";

export default function GamePage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">SpaceBase Game</h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to start playing and earning rewards!
          </p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold">SpaceBase - Space Invaders</h1>
          <p className="text-gray-600 mt-2">
            Play-to-earn gaming on Base network
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GameStatus />
            <GameControls />
          </div>

          <div>
            <GameHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
```

## ⚠️ Error Handling

### Error Boundary Component

```javascript
// components/ErrorBoundary.jsx
"use client";

import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Game error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Transaction Error Handling

```javascript
// hooks/useGame.js (enhanced error handling)
const startGame = async () => {
  try {
    const result = await writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "startGame",
    });

    // Wait for confirmation
    await result.wait();

    // Refresh data
    refetchSession();
  } catch (error) {
    // Handle specific contract errors
    if (error.message.includes("NoActiveSession")) {
      throw new Error("You already have an active game session");
    }

    if (error.message.includes("user rejected")) {
      throw new Error("Transaction was cancelled");
    }

    // Handle network errors
    if (error.code === "NETWORK_ERROR") {
      throw new Error("Network error - please check your connection");
    }

    // Handle insufficient funds
    if (error.message.includes("insufficient funds")) {
      throw new Error("Insufficient funds for transaction");
    }

    throw new Error(`Transaction failed: ${error.message}`);
  }
};
```

## 🔄 Real-time Updates

### Level Timer Component

```javascript
// components/LevelTimer.jsx
"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/hooks/useGame";

export function LevelTimer() {
  const { gameState } = useGame();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!gameState?.isActive) {
      setTimeLeft(60);
      return;
    }

    const interval = setInterval(async () => {
      // In a real implementation, you'd call getLevelTimeRemaining
      // For demo purposes, we'll simulate countdown
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.isActive]);

  if (!gameState?.isActive) return null;

  return (
    <div className="text-center p-4">
      <div
        className={`text-4xl font-bold ${timeLeft < 10 ? "text-red-600" : "text-green-600"}`}
      >
        {timeLeft}s
      </div>
      <p className="text-sm text-gray-600">
        Time remaining for level {gameState.currentLevel}
      </p>
    </div>
  );
}
```

This frontend integration provides a complete example of how to build a Web3 game interface using modern React patterns and Web3 libraries. The components are modular and can be easily extended for additional features.
