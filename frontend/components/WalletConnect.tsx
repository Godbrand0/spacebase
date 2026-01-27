'use client'

import { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useConnect, useAccount, useSwitchChain, useDisconnect } from 'wagmi'
import { base } from 'wagmi/chains'
import { isInMiniApp } from '@/lib/farcaster'

export function WalletConnect() {
  const [isFarcaster, setIsFarcaster] = useState(false)
  const [isAutoConnecting, setIsAutoConnecting] = useState(false)
  const { connect, connectors } = useConnect()
  const { isConnected, connector: activeConnector } = useAccount()
  const { switchChain } = useSwitchChain()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    // Check if Farcaster is available
    if (isInMiniApp()) {
      console.log('🔍 Farcaster detected! Active connector:', activeConnector?.name)
      setIsFarcaster(true)
      
      // If connected to a non-Farcaster connector, disconnect first to ensure clean state
      // We check name and id for robustness
      if (isConnected && activeConnector) {
        const name = activeConnector.name.toLowerCase()
        const id = activeConnector.id.toLowerCase()
        if (!name.includes('farcaster') && !id.includes('farcaster')) {
          console.log(`⚠️ Connected to ${activeConnector.name} (${activeConnector.id}), but Farcaster is preferred. Disconnecting...`)
          disconnect()
          // Clear local storage to be extra sure
          try {
            localStorage.removeItem('wagmi.store')
            localStorage.removeItem('wagmi.connected')
            console.log('🧹 Cleared wagmi storage for clean state')
          } catch (e) {}
          return
        }
      }

      if (!isConnected && !isAutoConnecting) {
        setIsAutoConnecting(true)

        // Find the Farcaster connector
        const farcasterConnector = connectors.find(c => 
          c.id.toLowerCase().includes('farcaster') || 
          c.name.toLowerCase().includes('farcaster')
        )

        if (!farcasterConnector) {
          console.error('❌ Farcaster connector not found in:', connectors.map(c => `${c.name} (${c.id})`))
          setIsAutoConnecting(false)
          return
        }

        // Auto-connect to Farcaster
        try {
          console.log(`🔗 Connecting with ${farcasterConnector.name} connector...`)
          connect(
            { connector: farcasterConnector },
            {
              onSuccess: () => {
                console.log('✅ Farcaster connected successfully')
                setIsAutoConnecting(false)
              },
              onError: (error) => {
                console.error('❌ Failed to auto-connect Farcaster:', error)
                setIsAutoConnecting(false)
              }
            }
          )
        } catch (error) {
          console.error('❌ Failed to auto-connect Farcaster:', error)
          setIsAutoConnecting(false)
        }
      }
    }
  }, [connect, connectors, isConnected, activeConnector, disconnect, isAutoConnecting])

  // Stop showing "CONNECTING..." if connection succeeds
  useEffect(() => {
    if (isConnected && isAutoConnecting) {
      setIsAutoConnecting(false)
    }
  }, [isConnected, isAutoConnecting])

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (isAutoConnecting) {
                return (
                  <div className="arcade-font" style={{
                    color: 'var(--neon-green)',
                    fontSize: '8px',
                    padding: '8px 16px'
                  }}>
                    CONNECTING...
                  </div>
                )
              }

              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="arcade-button pulse-glow"
                    style={{
                      color: 'var(--neon-green)',
                      fontSize: '12px',
                    }}
                  >
                    CONNECT WALLET
                  </button>
                )
              }

              if (chain.unsupported || chain.id !== base.id) {
                return (
                  <button
                    onClick={() => switchChain({ chainId: base.id })}
                    type="button"
                    className="arcade-button"
                    style={{
                      color: 'var(--neon-red)',
                      fontSize: '10px',
                    }}
                  >
                    SWITCH TO BASE
                  </button>
                )
              }

              return (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="arcade-button"
                    style={{
                      color: 'var(--neon-cyan)',
                      fontSize: '8px',
                      padding: '8px 16px',
                    }}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                          display: 'inline-block',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="arcade-button"
                    style={{
                      color: 'var(--neon-pink)',
                      fontSize: '8px',
                      padding: '8px 16px',
                    }}
                  >
                    {isFarcaster ? '🟣 ' : ''}{account.displayName}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
