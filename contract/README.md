# SpaceInvadersGame on Base

A play-to-earn Space Invaders game smart contract deployed on Base network where players earn $2 worth of Base per level completed.

## Overview

The SpaceInvadersGame contract allows players to:

- Start a game session without staking
- Complete up to 5 levels, each with increasing difficulty
- Earn $2 worth of Base for each level completed
- Claim rewards immediately after completing levels or abandoning the game

## Game Mechanics

- **Levels**: 5 levels total, each lasting 60 seconds
- **Rewards**: $2 worth of Base per level (0.0006667 ETH assuming 1 ETH ≈ $3000)
- **Aliens**: Level 1 has 11 aliens, increasing by 11 per level
- **No Staking Required**: Players can start playing immediately

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Setup

1. Clone the repository
2. Navigate to the contract directory
3. Copy `.env.example` to `.env` and fill in your private key
4. Install dependencies with `forge install`

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil (Local Node)

```shell
$ anvil
```

### Deploy to Base

```shell
# Deploy to Base mainnet
$ forge script script/DeploySpaceInvadersGame.s.sol --rpc-url base --private-key $PRIVATE_KEY --broadcast

# Deploy to Base Sepolia testnet
$ forge script script/DeploySpaceInvadersGame.s.sol --rpc-url base_sepolia --private-key $PRIVATE_KEY --broadcast
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## Contract Functions

### Player Functions

- `startGame()`: Start a new game session
- `completeLevel(sessionId, level, score, aliensDestroyed, proof)`: Complete a level and earn rewards
- `abandonGame(sessionId)`: Abandon the current game and claim partial rewards
- `claimRewards(sessionId)`: Claim earned rewards after game completion

### View Functions

- `getSessionInfo(sessionId)`: Get information about a game session
- `getPlayerSessions(player)`: Get all session IDs for a player
- `getLevelTimeRemaining(sessionId)`: Get remaining time for current level
- `getContractBalance()`: Get the contract's Base balance
- `getPlayerTotalRewards(player)`: Get total rewards earned by a player

### Owner Functions

- `pause()`/`unpause()`: Pause/unpause the contract
- `withdraw(amount)`: Withdraw Base from the contract
- `fundContract()`: Fund the contract with Base for rewards

## Security Features

- Reentrancy protection on all state-changing functions
- Pausable contract for emergency situations
- Access control for owner-only functions
- Level completion verification to prevent cheating
- Replay attack prevention using level hashes

## License

MIT
