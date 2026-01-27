'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnect } from '@/components/WalletConnect'
import { StandardConnect } from '@/components/StandardConnect'
import { useGameState } from '@/hooks/useGameState'
import { useStartGame, useCompleteLevel, useAbandonGame, useClaimRewards } from '@/hooks/useSpaceInvadersContract'
import { TransactionStatus } from '@/components/TransactionStatus'
import { isInMiniApp } from '@/lib/farcaster'

export default function Home() {
  const { address, isConnected } = useAccount()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  
  const gameState = useGameState(canvasRef.current)
  const { startGame, isPending: isStartPending, isConfirming, isConfirmed, hash, receipt, error } = useStartGame()
  const { completeLevel, isPending: isCompletePending } = useCompleteLevel()
  const { abandonGame, isPending: isAbandonPending } = useAbandonGame()
  const { claimRewards, isPending: isClaimPending } = useClaimRewards()

  const handleStartGame = async () => {
    if (!isConnected) return
    
    try {
      const hash = await startGame()
      if (hash) {
        // Game will be initialized after transaction confirms via useEffect
        setShowInstructions(false)
        setGameStarted(true)
      }
    } catch (error) {
      console.error('Failed to start game:', error)
    }
  }

  const handleLevelComplete = async () => {
    if (!gameState.sessionId || !gameState.currentLevel) return
    
    try {
      // Generate a simple proof (in a real implementation, this would be more sophisticated)
      const proof = '0x' + '0'.repeat(64) // Placeholder proof
      
      await completeLevel(
        gameState.sessionId,
        gameState.currentLevel,
        100, // score
        11 * gameState.currentLevel, // aliens destroyed (11 per level)
        proof as `0x${string}`
      )
    } catch (error) {
      console.error('Failed to complete level:', error)
    }
  }

  const handleAbandonGame = async () => {
    if (!gameState.sessionId) {
      setGameStarted(false)
      setShowInstructions(true)
      return
    }
    
    try {
      await abandonGame(gameState.sessionId)
    } catch (error) {
      console.error('Failed to abandon game on contract:', error)
    } finally {
      // Always reset UI state even if contract call fails
      gameState.resetGame()
      setGameStarted(false)
      setShowInstructions(true)
    }
  }

  const handleClaimRewards = async () => {
    if (!gameState.sessionId) return
    
    try {
      gameState.setClaimingStatus()
      await claimRewards(gameState.sessionId)
      gameState.resetGame()
      setGameStarted(false)
      setShowInstructions(true)
    } catch (error) {
      console.error('Failed to claim rewards:', error)
    }
  }

  const handleNextLevel = () => {
    gameState.nextLevel()
  }

  // Initialize game when transaction confirms
  useEffect(() => {
    if (gameStarted && !gameState.game && canvasRef.current && isConfirmed && receipt) {
      const { parseSessionIdFromReceipt } = require('@/hooks/useSpaceInvadersContract')
      const sessionId = parseSessionIdFromReceipt(receipt)
      
      if (sessionId) {
        console.log('✅ Extracted real sessionId from receipt:', sessionId.toString())
        gameState.initializeGame(sessionId)
      } else {
        console.error('❌ Failed to extract sessionId from receipt')
        // Fallback or error handling
        setGameStarted(false)
        setShowInstructions(true)
      }
    }
  }, [gameStarted, gameState.game, gameState.initializeGame, isConfirmed, receipt])

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-green-400">SPACE INVADERS</h1>
          <p className="text-lg">Play and Earn ETH on Base Network</p>
          <div className="mt-4 flex flex-col gap-2 items-center">
            <WalletConnect />
            <StandardConnect />
          </div>
        </header>

        {!isConnected ? (
          <div className="text-center py-16">
            <p className="text-xl mb-4">Connect your wallet to start playing</p>
            <p className="text-sm opacity-75">Make sure you're on the Base network</p>
          </div>
        ) : showInstructions ? (
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <span className="text-green-400 mr-2">▸</span>
                <p>Use arrow keys to move your spaceship left and right</p>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">▸</span>
                <p>Press spacebar to shoot at the aliens</p>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">▸</span>
                <p>Destroy all aliens to complete each level</p>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">▸</span>
                <p>Complete 5 levels to earn maximum rewards</p>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">▸</span>
                <p>Each level completed earns you $2 worth of Base</p>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={handleStartGame}
                disabled={isStartPending}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                {isStartPending ? 'Starting Game...' : 'Start Game'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <div className="flex justify-between items-center max-w-md mx-auto mb-2">
                <span>Level: {gameState.currentLevel}/5</span>
                <span>Time: {gameState.timeRemaining}s</span>
                <span>Rewards: {gameState.totalRewardsEarned * 2} ETH</span>
              </div>
            </div>

            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border-2 border-green-400 rounded-lg"
              />
              
              {gameState.gameStatus === 'levelComplete' && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Level Complete!</h2>
                    <p className="mb-4">You earned $2 worth of Base</p>
                    <div className="space-x-4">
                      <button
                        onClick={handleNextLevel}
                        disabled={isCompletePending}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded"
                      >
                        Next Level
                      </button>
                      <button
                        onClick={handleAbandonGame}
                        disabled={isAbandonPending}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded"
                      >
                        Quit Game
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {gameState.gameStatus === 'gameOver' && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Game Over</h2>
                    <p className="mb-4">You completed {gameState.levelsCompleted} levels</p>
                    <p className="mb-4">Total rewards: {gameState.levelsCompleted * 2} ETH</p>
                    <button
                      onClick={handleClaimRewards}
                      disabled={isClaimPending}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded"
                    >
                      {isClaimPending ? 'Claiming...' : 'Claim Rewards'}
                    </button>
                  </div>
                </div>
              )}
              
              {gameState.gameStatus === 'victory' && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Victory!</h2>
                    <p className="mb-4">You completed all 5 levels!</p>
                    <p className="mb-4">Total rewards: 10 ETH</p>
                    <button
                      onClick={handleClaimRewards}
                      disabled={isClaimPending}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded"
                    >
                      {isClaimPending ? 'Claiming...' : 'Claim Rewards'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={handleAbandonGame}
                disabled={isAbandonPending}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded"
              >
                {isAbandonPending ? 'Abandoning...' : 'Abandon Game'}
              </button>
            </div>
          </div>
        )}

        <TransactionStatus />
      </div>
    </div>
  )
}
