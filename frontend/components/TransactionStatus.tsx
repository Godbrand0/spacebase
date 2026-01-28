"use client";

import { useEffect, useState } from "react";

interface TransactionStatusProps {
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: Error | null;
  hash: string | null;
  pendingMessage?: string;
}

export function TransactionStatus({
  isPending,
  isConfirming,
  isConfirmed,
  error,
  hash,
  pendingMessage,
}: TransactionStatusProps) {
  const [showStatus, setShowStatus] = useState(false);
  
  const status = {
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    message: pendingMessage || "",
  };

  // This component would typically receive transaction status from a global state or context
  // For now, it's a placeholder that can be enhanced with proper state management

  useEffect(() => {
    if (
      status.isPending ||
      status.isConfirming ||
      status.error ||
      status.isConfirmed
    ) {
      setShowStatus(true);
    }
  }, [status.isPending, status.isConfirming, status.error, status.isConfirmed]);

  useEffect(() => {
    if (status.isConfirmed && !status.error) {
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status.isConfirmed, status.error]);

  if (!showStatus) return null;

  const getStatusColor = () => {
    if (status.error) return "var(--neon-red)";
    if (status.isConfirmed) return "var(--neon-green)";
    return "var(--neon-cyan)";
  };

  const statusColor = getStatusColor();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className="arcade-font pulse-glow"
        style={{
          padding: "16px",
          background:
            "linear-gradient(180deg, rgba(26, 11, 46, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
          border: `3px solid ${statusColor}`,
          borderRadius: "8px",
          boxShadow: `0 0 20px ${statusColor}, inset 0 0 20px rgba(0, 0, 0, 0.5)`,
          fontSize: "10px",
        }}
      >
        {status.error && (
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <p
                className="neon-text"
                style={{ color: "var(--neon-red)", marginBottom: "4px" }}
              >
                TRANSACTION FAILED
              </p>
              <p style={{ color: "var(--arcade-pink)", fontSize: "8px" }}>
                {status.error.message}
              </p>
            </div>
          </div>
        )}

        {status.isConfirming && (
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-spin">⏳</div>
            <div>
              <p
                className="neon-text"
                style={{ color: "var(--neon-cyan)", marginBottom: "4px" }}
              >
                CONFIRMING
              </p>
              <p style={{ color: "var(--arcade-cyan)", fontSize: "8px" }}>
                {status.message || "Transaction in progress..."}
              </p>
            </div>
          </div>
        )}

        {status.isPending && !status.isConfirming && (
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-pulse">🔄</div>
            <div>
              <p
                className="neon-text"
                style={{ color: "var(--neon-cyan)", marginBottom: "4px" }}
              >
                PROCESSING
              </p>
              <p style={{ color: "var(--arcade-cyan)", fontSize: "8px" }}>
                {status.message || "Transaction in progress..."}
              </p>
            </div>
          </div>
        )}

        {status.isConfirmed && !status.error && (
          <div className="flex items-center gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <p
                className="neon-text"
                style={{ color: "var(--neon-green)", marginBottom: "4px" }}
              >
                SUCCESS!
              </p>
              <p style={{ color: "var(--arcade-green)", fontSize: "8px" }}>
                {status.message || "Transaction completed successfully!"}
              </p>
              {status.hash && (
                <p
                  style={{
                    color: "var(--arcade-cyan)",
                    fontSize: "7px",
                    marginTop: "4px",
                  }}
                >
                  TX: {status.hash.slice(0, 10)}...{status.hash.slice(-8)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
