'use client'

import { useState } from 'react'
import { useConnectorClient, usePublicClient, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi'

import { getConnectorClient } from 'wagmi/actions'

import { config } from '@/lib/wagmi'
import { CONTRACT_CONFIG, CONTRACT_ABI, CONTRACT_FUNCTIONS } from '@/lib/contractAbi'
import { formatEther } from 'viem'
import { writeContract } from 'viem/actions'
import { base, mantleSepoliaTestnet } from 'wagmi/chains'
import { decodeEventLog } from 'viem'

export function parseSessionIdFromReceipt(receipt: any): bigint | null {
  if (!receipt || !receipt.logs) return null
  
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: CONTRACT_ABI,
        data: log.data,
        topics: log.topics,
      })
      
      if (decoded.eventName === 'GameStarted' && decoded.args) {
        const args = decoded.args as any
        if (args.sessionId) {
          return BigInt(args.sessionId)
        }
      }
    } catch (e) {
      // Skip logs that don't match our ABI
      continue
    }
  }
  
  return null
}

export function useStartGame() {
  const { address, isConnected, connector } = useAccount()
  const { data: walletClient, isLoading: isWalletLoading, error: clientError } = useConnectorClient()
  const publicClient = usePublicClient()
  const [isPending, setIsPending] = useState(false)
  const [hash, setHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<Error | null>(null)

  const startGame = async () => {
    console.log('🚀 startGame called', { 
      isConnected, 
      address, 
      connector: connector?.name,
      connectorId: connector?.id,
      hasWalletClient: !!walletClient, 
      isWalletLoading,
      clientError: clientError?.message
    })
    
    let client = walletClient
    
    // Fallback: Try to get the client manually if the hook hasn't provided it yet
    if (!client && isConnected && connector) {
      try {
        console.log('🔄 Attempting to get wallet client manually...')
        client = await getConnectorClient(config, { connector })
        console.log('✅ Manually retrieved wallet client')
      } catch (e) {
        console.error('❌ Failed to get wallet client manually:', e)
      }
    }

    // Check if we are on the correct chain (Base)
    const currentChainId = await publicClient.getChainId()
    if (currentChainId !== base.id) {
      const err = new Error(`Wrong network. Please switch to Base (Chain ID: ${base.id}). Current Chain ID: ${currentChainId}`)
      setError(err)
      throw err
    }
    
    if (!client || !publicClient) {
      let errorMessage = 'Initializing wallet connection... please try again in a moment.'
      if (!isConnected) {
        errorMessage = 'Wallet not connected. Please connect your wallet first.'
      } else if (clientError) {
        errorMessage = `Wallet connection error: ${clientError.message}`
      } else if (!client) {
        errorMessage = `Wallet client not ready for ${connector?.name || 'unknown connector'}. Please refresh or try again.`
      }
      
      const err = new Error(errorMessage)
      setError(err)
      throw err
    }

    setIsPending(true)
    setError(null)
    
    try {
      console.log('🔗 Contract address:', CONTRACT_CONFIG.address)
      console.log('📋 Contract function:', CONTRACT_FUNCTIONS.START_GAME)
      console.log('📤 Sending transaction to contract...')

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.START_GAME,
        account: client.account,
      })

      const txHash = await writeContract(client, request)
      setHash(txHash)
      console.log('✅ Transaction sent successfully')
      return txHash
    } catch (err) {
      console.error('❌ Error starting game:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setIsPending(false)
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
  const { isConnected, connector } = useAccount()
  const { data: walletClient } = useConnectorClient()
  const publicClient = usePublicClient()
  const [isPending, setIsPending] = useState(false)
  const [hash, setHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<Error | null>(null)

  const completeLevel = async (
    sessionId: bigint,
    level: number,
    score: number,
    aliensDestroyed: number,
    proof: `0x${string}`
  ) => {
    let client = walletClient
    
    if (!client && isConnected && connector) {
      try {
        client = await getConnectorClient(config, { connector })
      } catch (e) {}
    }

    if (!client || !publicClient) {
      const err = new Error(!isConnected ? 'Wallet not connected' : `Wallet client not ready for ${connector?.name || 'unknown'}`)
      setError(err)
      throw err
    }

    setIsPending(true)
    setError(null)

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.COMPLETE_LEVEL,
        args: [sessionId, BigInt(level), BigInt(score), BigInt(aliensDestroyed), proof],
        account: client.account,
      })

      const txHash = await writeContract(client, request)
      setHash(txHash)
      return txHash
    } catch (err) {
      console.error('❌ Error completing level:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setIsPending(false)
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
  const { isConnected, connector } = useAccount()
  const { data: walletClient } = useConnectorClient()
  const publicClient = usePublicClient()
  const [isPending, setIsPending] = useState(false)
  const [hash, setHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<Error | null>(null)

  const abandonGame = async (sessionId: bigint) => {
    let client = walletClient
    
    if (!client && isConnected && connector) {
      try {
        client = await getConnectorClient(config, { connector })
      } catch (e) {}
    }

    if (!client || !publicClient) {
      const err = new Error(!isConnected ? 'Wallet not connected' : `Wallet client not ready for ${connector?.name || 'unknown'}`)
      setError(err)
      throw err
    }

    setIsPending(true)
    setError(null)

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.ABANDON_GAME,
        args: [sessionId],
        account: client.account,
      })

      const txHash = await writeContract(client, request)
      setHash(txHash)
      return txHash
    } catch (err) {
      console.error('Error abandoning game:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setIsPending(false)
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
  const { isConnected, connector } = useAccount()
  const { data: walletClient } = useConnectorClient()
  const publicClient = usePublicClient()
  const [isPending, setIsPending] = useState(false)
  const [hash, setHash] = useState<`0x${string}` | undefined>()
  const [error, setError] = useState<Error | null>(null)

  const claimRewards = async (sessionId: bigint) => {
    let client = walletClient
    
    if (!client && isConnected && connector) {
      try {
        client = await getConnectorClient(config, { connector })
      } catch (e) {}
    }

    if (!client || !publicClient) {
      const err = new Error(!isConnected ? 'Wallet not connected' : `Wallet client not ready for ${connector?.name || 'unknown'}`)
      setError(err)
      throw err
    }

    setIsPending(true)
    setError(null)

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_CONFIG.address as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: CONTRACT_FUNCTIONS.CLAIM_REWARDS,
        args: [sessionId],
        account: client.account,
      })

      const txHash = await writeContract(client, request)
      setHash(txHash)
      return txHash
    } catch (err) {
      console.error('❌ Error claiming rewards:', err)
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      throw error
    } finally {
      setIsPending(false)
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
