/**
 * Contract configuration for SpaceInvadersGame Base contract
 */
export const CONTRACT_CONFIG = {
  address:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0xEa0f94BD92DbcE3D340E660311aA1cF9Aacbe11a",
  network: process.env.NEXT_PUBLIC_NETWORK || "base",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org",
};

/**
 * Contract ABI
 */
export const CONTRACT_ABI = [
  {
    name: "GameAbandoned",
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "levelsCompleted",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "partialRewards",
        type: "uint256",
      },
    ],
  },
  {
    name: "GameCompleted",
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalRewards",
        type: "uint256",
      },
    ],
  },
  {
    name: "GameStarted",
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
    ],
  },
  {
    name: "LevelCompleted",
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "levelHash",
        type: "bytes32",
      },
    ],
  },
  {
    name: "OwnerWithdraw",
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
  },
  {
    name: "RewardsClaimed",
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
  },
  {
    name: "ContractFunded",
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "funder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "aliensDestroyed",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes",
      },
    ],
    name: "completeLevel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "abandonGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startGame",
    outputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fundContract",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    name: "getAlienCountForLevel",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "getSessionInfo",
    outputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "currentLevel",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "levelsCompleted",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalRewardsEarned",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isCompleted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sessionId",
        type: "uint256",
      },
    ],
    name: "getLevelTimeRemaining",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerSessions",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerTotalRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "gameSessions",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "sessionId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "currentLevel",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "levelsCompleted",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalRewardsEarned",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "levelStartTime",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isCompleted",
            type: "bool",
          },
          {
            internalType: "uint256[]",
            name: "levelHashes",
            type: "uint256[]",
          },
        ],
        internalType: "struct SpaceInvadersGame.GameSession",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "playerSessions",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "playerTotalRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "levelHashUsed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REWARD_PER_LEVEL",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_LEVELS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LEVEL_DURATION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ALIENS_PER_ROW",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
    payable: true,
  },
];

/**
 * Contract function names
 */
export const CONTRACT_FUNCTIONS = {
  // Entry functions
  START_GAME: "startGame",
  COMPLETE_LEVEL: "completeLevel",
  ABANDON_GAME: "abandonGame",
  CLAIM_REWARDS: "claimRewards",
  FUND_CONTRACT: "fundContract",

  // View functions
  GET_SESSION_INFO: "getSessionInfo",
  GET_CONTRACT_BALANCE: "getContractBalance",
  GET_ALIEN_COUNT_FOR_LEVEL: "getAlienCountForLevel",
  GET_PLAYER_SESSIONS: "getPlayerSessions",
  GET_PLAYER_TOTAL_REWARDS: "getPlayerTotalRewards",
  GET_LEVEL_TIME_REMAINING: "getLevelTimeRemaining",

  // Constants
  ALIENS_PER_ROW: "ALIENS_PER_ROW",
  LEVEL_DURATION: "LEVEL_DURATION",
  MAX_LEVELS: "MAX_LEVELS",
  REWARD_PER_LEVEL: "REWARD_PER_LEVEL",
};

/**
 * Game session info interface
 */
export interface GameSessionInfo {
  player: string;
  currentLevel: number;
  levelsCompleted: number;
  totalRewardsEarned: number;
  startTime: number;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * Parse session info from contract response
 */
export function parseSessionInfo(data: any): GameSessionInfo | null {
  if (!data || data.length < 7) return null;

  return {
    player: data[0],
    currentLevel: Number(data[1]),
    levelsCompleted: Number(data[2]),
    totalRewardsEarned: Number(data[3]),
    startTime: Number(data[4]),
    isActive: Boolean(data[5]),
    isCompleted: Boolean(data[6]),
  };
}

/**
 * Format ETH amount (from wei to ETH)
 */
export function formatETH(amount: number | bigint): string {
  const ethAmount = Number(amount) / 1e18;
  return ethAmount.toFixed(6);
}

/**
 * Convert ETH to wei
 */
export function ethToWei(ethAmount: number): bigint {
  return BigInt(Math.floor(ethAmount * 1e18));
}

/**
 * Get alien count for level (from contract logic)
 */
export function getAlienCountForLevel(level: number): number {
  return 11 * level;
}

/**
 * Calculate level duration in seconds (default 5 minutes)
 */
export const LEVEL_DURATION_SECONDS = 300; // 5 minutes

/**
 * Game constants from contract
 */
export const MAX_LEVELS = 5; // Default value, should be fetched from contract
export const REWARD_PER_LEVEL = 1; // 1 ETH per level, should be fetched from contract

/**
 * Calculate time remaining for a level
 */
export function calculateTimeRemaining(levelStartTime: number): number {
  const elapsed = Math.floor(Date.now() / 1000) - levelStartTime;
  return Math.max(0, LEVEL_DURATION_SECONDS - elapsed);
}
