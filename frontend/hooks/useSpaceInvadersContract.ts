"use client";

import { useState } from "react";
import {
  useWalletClient,
  usePublicClient,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import {
  CONTRACT_CONFIG,
  CONTRACT_ABI,
  CONTRACT_FUNCTIONS,
} from "@/lib/contractAbi";
import { formatEther } from "viem";
import { writeContract } from "viem/actions";

export function useStartGame() {
  const { address, isConnected } = useAccount();
  const { data: walletClient, isLoading: isWalletLoading } = useWalletClient();
  const publicClient = usePublicClient();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const startGame = async () => {
    console.log("🚀 startGame called", {
      isConnected,
      address,
      hasWalletClient: !!walletClient,
      isWalletLoading,
    });

    if (!walletClient || !publicClient) {
      const err = new Error(
        !isConnected
          ? "Wallet not connected"
          : "Initializing wallet connection... please try again in a moment.",
      );
      setError(err);
      throw err;
    }

    setIsPending(true);
    setError(null);

    try {
      console.log("🔗 Contract address:", CONTRACT_CONFIG.address);
      console.log("📋 Contract function:", CONTRACT_FUNCTIONS.START_GAME);
      console.log("📤 Sending transaction to contract...");

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.START_GAME,
        account: walletClient.account,
      });

      const txHash = await writeContract(walletClient, request);
      setHash(txHash);
      console.log("✅ Transaction sent successfully");
      return txHash;
    } catch (err) {
      console.error("❌ Error starting game:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    startGame,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    receipt,
    error,
  };
}

export function useCompleteLevel() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const completeLevel = async (
    sessionId: bigint,
    level: number,
    score: number,
    aliensDestroyed: number,
    proof: `0x${string}`,
  ) => {
    if (!walletClient || !publicClient) {
      const err = new Error(
        !isConnected ? "Wallet not connected" : "Wallet client not ready",
      );
      setError(err);
      throw err;
    }

    setIsPending(true);
    setError(null);

    try {
      console.log("🔗 Contract address:", CONTRACT_CONFIG.address);
      console.log("📋 Contract function:", CONTRACT_FUNCTIONS.COMPLETE_LEVEL);
      console.log("🆔 SessionId:", sessionId.toString());
      console.log("📊 Level:", level);
      console.log("🎯 Score:", score);
      console.log("👾 Aliens destroyed:", aliensDestroyed);

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.COMPLETE_LEVEL,
        args: [
          sessionId,
          BigInt(level),
          BigInt(score),
          BigInt(aliensDestroyed),
          proof,
        ],
        account: walletClient.account,
      });

      const txHash = await writeContract(walletClient, request);
      setHash(txHash);
      return txHash;
    } catch (err) {
      console.error("❌ Error completing level:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    completeLevel,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}

export function useAbandonGame() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const abandonGame = async (sessionId: bigint) => {
    if (!walletClient || !publicClient) {
      const err = new Error(
        !isConnected ? "Wallet not connected" : "Wallet client not ready",
      );
      setError(err);
      throw err;
    }

    setIsPending(true);
    setError(null);

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.ABANDON_GAME,
        args: [sessionId],
        account: walletClient.account,
      });

      const txHash = await writeContract(walletClient, request);
      setHash(txHash);
      return txHash;
    } catch (err) {
      console.error("Error abandoning game:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    abandonGame,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}

export function useClaimRewards() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const claimRewards = async (sessionId: bigint) => {
    if (!walletClient || !publicClient) {
      const err = new Error(
        !isConnected ? "Wallet not connected" : "Wallet client not ready",
      );
      setError(err);
      throw err;
    }

    setIsPending(true);
    setError(null);

    try {
      console.log("🔗 Contract address:", CONTRACT_CONFIG.address);
      console.log("📋 Contract function:", CONTRACT_FUNCTIONS.CLAIM_REWARDS);
      console.log("🆔 SessionId:", sessionId.toString());

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.CLAIM_REWARDS,
        args: [sessionId],
        account: walletClient.account,
      });

      const txHash = await writeContract(walletClient, request);
      setHash(txHash);
      return txHash;
    } catch (err) {
      console.error("❌ Error claiming rewards:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return {
    claimRewards,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  };
}

export function useSessionInfo(sessionId: bigint | null) {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.GET_SESSION_INFO,
    args: sessionId ? [sessionId] : undefined,
    query: {
      enabled: !!sessionId,
    },
  });

  return {
    sessionInfo: data,
    error,
    isLoading,
    refetch,
  };
}

export function useContractBalance() {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.GET_CONTRACT_BALANCE,
  });

  return {
    balance: data ? formatEther(data as bigint) : "0",
    balanceWei: data,
    error,
    isLoading,
    refetch,
  };
}

export function usePlayerTotalRewards(playerAddress: `0x${string}` | null) {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.GET_PLAYER_TOTAL_REWARDS,
    args: playerAddress ? [playerAddress] : undefined,
    query: {
      enabled: !!playerAddress,
    },
  });

  return {
    totalRewards: data ? formatEther(data as bigint) : "0",
    totalRewardsWei: data,
    error,
    isLoading,
    refetch,
  };
}

export function useAlienCountForLevel(level: number) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.GET_ALIEN_COUNT_FOR_LEVEL,
    args: [BigInt(level)],
  });

  return {
    alienCount: data ? Number(data) : 0,
    error,
    isLoading,
  };
}

export function useLevelTimeRemaining(sessionId: bigint | null) {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.GET_LEVEL_TIME_REMAINING,
    args: sessionId ? [sessionId] : undefined,
    query: {
      enabled: false, // Disabled - we'll use client-side timer instead
    },
  });

  return {
    timeRemaining: data ? Number(data) : 0,
    error,
    isLoading,
    refetch,
  };
}
