'use client'

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_CONFIG, CONTRACT_ABI, CONTRACT_FUNCTIONS } from '@/lib/contractAbi'
import { parseEther, formatEther } from 'viem'

export function useStartGame() {
  const { writeContractAsync, isPending, data: hash, error } = useWriteContract()

  const startGame = async () => {
    console.log('🔗 Contract address:', CONTRACT_CONFIG.address)
    console.log('📋 Contract function:', CONTRACT_FUNCTIONS.START_GAME)
    
    try {
      console.log('📤 Sending transaction to contract...')
      const txHash = await writeContractAsync({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.START_GAME,
      })
      console.log('✅ Transaction sent successfully')
      return txHash
    } catch (err) {
      console.error('❌ Error starting game:', err)
      throw err
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    startGame,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    receipt,
    error,
  }
}

export function useCompleteLevel() {
  const { writeContractAsync, isPending, data: hash, error } = useWriteContract()

  const completeLevel = async (
    sessionId: bigint,
    level: number,
    score: number,
    aliensDestroyed: number,
    proof: `0x${string}`
  ) => {
    try {
      console.log('🔗 Contract address:', CONTRACT_CONFIG.address)
      console.log('📋 Contract function:', CONTRACT_FUNCTIONS.COMPLETE_LEVEL)
      console.log('🆔 SessionId:', sessionId.toString())
      console.log('📊 Level:', level)
      console.log('🎯 Score:', score)
      console.log('👾 Aliens destroyed:', aliensDestroyed)
      
      return await writeContractAsync({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.COMPLETE_LEVEL,
        args: [sessionId, BigInt(level), BigInt(score), BigInt(aliensDestroyed), proof],
      })
    } catch (err) {
      console.error('❌ Error completing level:', err)
      // Log more details about the error
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }
      throw err
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    completeLevel,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }
}

export function useAbandonGame() {
  const { writeContractAsync, isPending, data: hash, error } = useWriteContract()

  const abandonGame = async (sessionId: bigint) => {
    try {
      return await writeContractAsync({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.ABANDON_GAME,
        args: [sessionId],
      })
    } catch (err) {
      console.error('Error abandoning game:', err)
      throw err
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    abandonGame,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }
}

export function useClaimRewards() {
  const { writeContractAsync, isPending, data: hash, error } = useWriteContract()

  const claimRewards = async (sessionId: bigint) => {
    try {
      console.log('🔗 Contract address:', CONTRACT_CONFIG.address)
      console.log('📋 Contract function:', CONTRACT_FUNCTIONS.CLAIM_REWARDS)
      console.log('🆔 SessionId:', sessionId.toString())
      
      return await writeContractAsync({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.CLAIM_REWARDS,
        args: [sessionId],
      })
    } catch (err) {
      console.error('❌ Error claiming rewards:', err)
      // Log more details about the error
      if (err instanceof Error) {
        console.error('Error message:', err.message)
        console.error('Error stack:', err.stack)
      }
      throw err
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    claimRewards,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }
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
  })

  return {
    sessionInfo: data,
    error,
    isLoading,
    refetch,
  }
}

export function useContractBalance() {
  const { data, error, isLoading, refetch } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.GET_CONTRACT_BALANCE,
  })

  return {
    balance: data ? formatEther(data as bigint) : '0',
    balanceWei: data,
    error,
    isLoading,
    refetch,
  }
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
  })

  return {
    totalRewards: data ? formatEther(data as bigint) : '0',
    totalRewardsWei: data,
    error,
    isLoading,
    refetch,
  }
}

export function useAlienCountForLevel(level: number) {
  const { data, error, isLoading } = useReadContract({
    address: CONTRACT_CONFIG.address as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: CONTRACT_FUNCTIONS.GET_ALIEN_COUNT_FOR_LEVEL,
    args: [BigInt(level)],
  })

  return {
    alienCount: data ? Number(data) : 0,
    error,
    isLoading,
  }
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
  })

  return {
    timeRemaining: data ? Number(data) : 0,
    error,
    isLoading,
    refetch,
  }
}