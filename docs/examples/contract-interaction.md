# Contract Interaction Examples

This document provides practical examples for interacting with the SpaceInvadersGame smart contract using various tools and libraries.

## 📋 Prerequisites

- Contract deployed at: `0xEa0f94BD92DbcE3D340E660311aA1cF9Aacbe11a`
- Network: Base Mainnet
- RPC URL: `https://mainnet.base.org`

## 🛠️ Using Foundry (Cast)

Foundry's `cast` tool provides a command-line interface for contract interaction.

### Setup

```bash
# Set environment variables
export CONTRACT_ADDRESS=0xEa0f94BD92DbcE3D340E660311aA1cF9Aacbe11a
export RPC_URL=https://mainnet.base.org
export PRIVATE_KEY=your_private_key_here
```

### Start a New Game

```bash
# Start a game session
cast send $CONTRACT_ADDRESS \
  "startGame()" \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY

# Output: transaction hash
# Extract sessionId from transaction events or logs
```

### Check Contract Balance

```bash
# Get contract's Base balance
cast call $CONTRACT_ADDRESS \
  "getContractBalance()" \
  --rpc-url $RPC_URL

# Output: 1000000000000000000 (1 ETH in wei)
```

### Get Player Sessions

```bash
# Get all sessions for a player
cast call $CONTRACT_ADDRESS \
  "getPlayerSessions(address)" \
  0x742d35Cc6634C0532925a3b844Bc454e4438f44e \
  --rpc-url $RPC_URL

# Output: [1,2,3] (array of session IDs)
```

### Complete a Level

```bash
# Complete level 1 with 11 aliens destroyed
cast send $CONTRACT_ADDRESS \
  "completeLevel(uint256,uint256,uint256,uint256,bytes)" \
  1 1 1000 11 0x \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

### Check Session Info

```bash
# Get detailed session information
cast call $CONTRACT_ADDRESS \
  "getSessionInfo(uint256)" \
  1 \
  --rpc-url $RPC_URL

# Output: (player_address, current_level, levels_completed, rewards_earned, start_time, is_active, is_completed)
```

### Claim Rewards

```bash
# Claim rewards for completed game
cast send $CONTRACT_ADDRESS \
  "claimRewards(uint256)" \
  1 \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY
```

## 💻 Using Ethers.js

For JavaScript/TypeScript applications.

### Setup

```javascript
import { ethers } from "ethers";

// Contract details
const CONTRACT_ADDRESS = "0xEa0f94BD92DbcE3D340E660311aA1cF9Aacbe11a";
const RPC_URL = "https://mainnet.base.org";

// Contract ABI (simplified)
const CONTRACT_ABI = [
  "function startGame() external returns (uint256)",
  "function completeLevel(uint256,uint256,uint256,uint256,bytes) external",
  "function claimRewards(uint256) external",
  "function getSessionInfo(uint256) external view returns (address,uint256,uint256,uint256,uint256,bool,bool)",
  "function getPlayerSessions(address) external view returns (uint256[])",
  "function getContractBalance() external view returns (uint256)",
  "event GameStarted(uint256 indexed,address indexed,uint256)",
  "event LevelCompleted(uint256 indexed,address indexed,uint256,bytes32)",
];
```

### Initialize Contract

```javascript
// Connect to Base network
const provider = new ethers.JsonRpcProvider(RPC_URL);

// For read-only operations
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// For transactions (requires signer)
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contractWithSigner = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  signer,
);
```

### Start Game Example

```javascript
async function startGame() {
  try {
    const tx = await contractWithSigner.startGame();
    const receipt = await tx.wait();

    // Extract sessionId from events
    const gameStartedEvent = receipt.logs.find(
      (log) => log.eventName === "GameStarted",
    );

    if (gameStartedEvent) {
      const sessionId = gameStartedEvent.args.sessionId;
      console.log("Game started with session ID:", sessionId);
      return sessionId;
    }
  } catch (error) {
    console.error("Error starting game:", error);
  }
}
```

### Complete Level Example

```javascript
async function completeLevel(sessionId, level, score, aliensDestroyed) {
  try {
    // Verify alien count for level
    const expectedAliens = await contract.getAlienCountForLevel(level);
    if (aliensDestroyed !== expectedAliens) {
      throw new Error(
        `Invalid alien count. Expected: ${expectedAliens}, Got: ${aliensDestroyed}`,
      );
    }

    const tx = await contractWithSigner.completeLevel(
      sessionId,
      level,
      score,
      aliensDestroyed,
      "0x", // Empty proof for now
    );

    const receipt = await tx.wait();
    console.log("Level completed:", receipt.hash);

    return receipt;
  } catch (error) {
    console.error("Error completing level:", error);
  }
}
```

### Monitor Game Events

```javascript
function setupEventListeners() {
  // Listen for level completions
  contract.on("LevelCompleted", (sessionId, player, level, levelHash) => {
    console.log(
      `Player ${player} completed level ${level} in session ${sessionId}`,
    );
    updateGameUI(sessionId, level);
  });

  // Listen for game starts
  contract.on("GameStarted", (sessionId, player, startTime) => {
    console.log(`New game started by ${player}, session: ${sessionId}`);
  });

  // Listen for reward claims
  contract.on("RewardsClaimed", (sessionId, player, amount) => {
    console.log(`Player ${player} claimed ${ethers.formatEther(amount)} ETH`);
  });
}
```

### Get Game State

```javascript
async function getGameState(sessionId) {
  try {
    const [
      player,
      currentLevel,
      levelsCompleted,
      totalRewards,
      startTime,
      isActive,
      isCompleted,
    ] = await contract.getSessionInfo(sessionId);

    const timeRemaining = await contract.getLevelTimeRemaining(sessionId);

    return {
      sessionId,
      player,
      currentLevel: Number(currentLevel),
      levelsCompleted: Number(levelsCompleted),
      totalRewards: ethers.formatEther(totalRewards),
      startTime: new Date(Number(startTime) * 1000),
      isActive,
      isCompleted,
      timeRemaining: Number(timeRemaining),
    };
  } catch (error) {
    console.error("Error getting game state:", error);
  }
}
```

### Claim Rewards Example

```javascript
async function claimRewards(sessionId) {
  try {
    // Check if game is completed
    const sessionInfo = await contract.getSessionInfo(sessionId);
    const isActive = sessionInfo[5];

    if (isActive) {
      throw new Error("Cannot claim rewards for active game");
    }

    const tx = await contractWithSigner.claimRewards(sessionId);
    const receipt = await tx.wait();

    console.log("Rewards claimed successfully");
    return receipt;
  } catch (error) {
    console.error("Error claiming rewards:", error);
  }
}
```

## 🐍 Using Web3.py

For Python applications.

### Setup

```python
from web3 import Web3
import os

# Contract details
CONTRACT_ADDRESS = '0xEa0f94BD92DbcE3D340E660311aA1cF9Aacbe11a'
RPC_URL = 'https://mainnet.base.org'
PRIVATE_KEY = os.getenv('PRIVATE_KEY')

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Contract ABI (simplified)
CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "startGame",
        "outputs": [{"type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"type": "uint256"}],
        "name": "getSessionInfo",
        "outputs": [
            {"type": "address"}, {"type": "uint256"}, {"type": "uint256"},
            {"type": "uint256"}, {"type": "uint256"}, {"type": "bool"}, {"type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
```

### Start Game with Web3.py

```python
def start_game():
    account = w3.eth.account.from_key(PRIVATE_KEY)

    # Build transaction
    tx = contract.functions.startGame().build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 200000,
        'gasPrice': w3.eth.gas_price
    })

    # Sign and send
    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    # Wait for receipt
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    # Parse events to get sessionId
    game_started_event = contract.events.GameStarted().process_receipt(receipt)
    if game_started_event:
        session_id = game_started_event[0]['args']['sessionId']
        print(f"Game started with session ID: {session_id}")
        return session_id
```

### Get Session Info with Web3.py

```python
def get_session_info(session_id):
    try:
        result = contract.functions.getSessionInfo(session_id).call()
        return {
            'player': result[0],
            'current_level': result[1],
            'levels_completed': result[2],
            'total_rewards': w3.from_wei(result[3], 'ether'),
            'start_time': result[4],
            'is_active': result[5],
            'is_completed': result[6]
        }
    except Exception as e:
        print(f"Error getting session info: {e}")
        return None
```

## 🔄 Batch Operations

### Complete Multiple Levels

```javascript
async function completeMultipleLevels(sessionId, levelResults) {
  for (const result of levelResults) {
    try {
      await completeLevel(sessionId, result.level, result.score, result.aliens);
      console.log(`Completed level ${result.level}`);

      // Wait a bit between transactions
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to complete level ${result.level}:`, error);
      break;
    }
  }
}

// Usage
const results = [
  { level: 1, score: 1000, aliens: 11 },
  { level: 2, score: 2000, aliens: 22 },
  { level: 3, score: 3000, aliens: 33 },
];

await completeMultipleLevels(sessionId, results);
```

## ⚠️ Error Handling

### Common Error Patterns

```javascript
async function safeCompleteLevel(sessionId, level, score, aliensDestroyed) {
  try {
    // Check time remaining first
    const timeLeft = await contract.getLevelTimeRemaining(sessionId);
    if (timeLeft === 0) {
      throw new Error("Level time expired");
    }

    // Check session is still active
    const sessionInfo = await contract.getSessionInfo(sessionId);
    if (!sessionInfo.isActive) {
      throw new Error("Session is not active");
    }

    // Verify alien count
    const expectedAliens = await contract.getAlienCountForLevel(level);
    if (aliensDestroyed !== expectedAliens) {
      throw new Error(`Wrong alien count. Expected: ${expectedAliens}`);
    }

    // Attempt completion
    const tx = await contractWithSigner.completeLevel(
      sessionId,
      level,
      score,
      aliensDestroyed,
      "0x",
    );

    return await tx.wait();
  } catch (error) {
    if (error.message.includes("LevelTimeExpired")) {
      console.error("Level time expired - game over");
    } else if (error.message.includes("InvalidLevel")) {
      console.error("Invalid level progression");
    } else if (error.message.includes("LevelHashAlreadyUsed")) {
      console.error("Replay attack detected");
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}
```

## 📊 Monitoring Contract State

### Track Player Progress

```javascript
async function monitorPlayerProgress(playerAddress) {
  const sessions = await contract.getPlayerSessions(playerAddress);
  const totalRewards = await contract.getPlayerTotalRewards(playerAddress);

  console.log(`Player ${playerAddress}:`);
  console.log(`- Total sessions: ${sessions.length}`);
  console.log(
    `- Total rewards earned: ${ethers.formatEther(totalRewards)} ETH`,
  );

  for (const sessionId of sessions) {
    const info = await getGameState(sessionId);
    console.log(
      `Session ${sessionId}: Level ${info.currentLevel}, ${info.levelsCompleted} completed`,
    );
  }
}
```

### Check Contract Health

```javascript
async function checkContractHealth() {
  const balance = await contract.getContractBalance();
  const isPaused = await contract.paused(); // If pause functionality exists

  console.log("Contract Health Check:");
  console.log(`- Balance: ${ethers.formatEther(balance)} ETH`);
  console.log(`- Paused: ${isPaused}`);
  console.log(
    `- Sufficient funds: ${balance >= ethers.parseEther("0.0033335")}`,
  ); // Min for 1 game

  return {
    balance: ethers.formatEther(balance),
    isPaused,
    canFundGame: balance >= ethers.parseEther("0.0033335"),
  };
}
```

These examples provide a comprehensive starting point for integrating with the SpaceInvadersGame contract. Remember to handle errors appropriately and test thoroughly on testnets before mainnet deployment.
