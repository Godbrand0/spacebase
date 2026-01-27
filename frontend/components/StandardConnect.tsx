'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function StandardConnect() {
  return (
    <div className="standard-connect">
      <ConnectButton 
        label="CONNECT WALLET"
        accountStatus="address"
        chainStatus="icon"
        showBalance={false}
      />
      
      <style jsx global>{`
        .standard-connect button {
          font-family: 'Courier New', monospace !important;
          border-radius: 4px !important;
          border: 2px solid var(--neon-green) !important;
          background: rgba(0, 255, 136, 0.1) !important;
          color: var(--neon-green) !important;
          transition: all 0.3s ease !important;
          text-transform: uppercase !important;
          font-weight: bold !important;
          letter-spacing: 1px !important;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5) !important;
        }
        
        .standard-connect button:hover {
          background: rgba(0, 255, 136, 0.2) !important;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.8) !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
    </div>
  )
}
