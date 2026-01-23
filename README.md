# SpaceBase - Space Invaders Game on Base Network

A play-to-earn Space Invaders game built on Base network where players earn $2 worth of Base for each level completed.

## 🎮 Game Overview

SpaceBase is a blockchain-powered Space Invaders game that rewards players with real cryptocurrency. Players can start a game session without any staking requirements and earn Base tokens by completing increasingly challenging levels.

### Key Features

- **No Staking Required**: Start playing immediately
- **5 Progressive Levels**: Each level increases in difficulty
- **Real Rewards**: Earn $2 worth of Base per level completed
- **Instant Payouts**: Claim rewards immediately after completing levels
- **Secure & Audited**: Built with industry-standard security practices

## 🚀 Live Deployment

The contract is **deployed and verified** on Base mainnet:

- **Contract Address**: `0xEa0f94BD92DbcE3D340E660311aA1cF9Aacbe11a`
- **Network**: Base Mainnet (Chain ID: 8453)
- **Explorer**: [BaseScan](https://basescan.org/address/0xea0f94bd92dbce3d340e660311aa1cf9aacbe11a)
- **Status**: ✅ Verified & Active

## 📁 Project Structure

```
spacebase/
├── contract/                 # Smart contracts (Foundry)
│   ├── src/
│   │   └── SpaceInvadersGame.sol    # Main game contract
│   ├── script/
│   │   └── DeploySpaceInvadersGame.s.sol  # Deployment script
│   ├── test/                  # Contract tests
│   ├── lib/                   # Dependencies
│   ├── deployments.json         # Contract ABI & address
│   └── foundry.toml           # Foundry configuration
├── frontend/                 # Web application (Next.js)
│   ├── app/                   # React components
│   ├── public/                 # Static assets
│   ├── contract.json           # Contract info for frontend
│   └── package.json            # Frontend dependencies
└── README.md                 # This file
```

## 🎯 Game Mechanics

### Gameplay

1. **Start Session**: Players initiate a game session without any upfront cost
2. **Complete Levels**: 5 levels total, each lasting 60 seconds
3. **Earn Rewards**: $2 worth of Base (0.0006667 ETH) per level
4. **Claim Payouts**: Withdraw earnings immediately or after game completion

### Level Progression

- **Level 1**: 11 aliens, 60 seconds
- **Level 2**: 22 aliens, 60 seconds
- **Level 3**: 33 aliens, 60 seconds
- **Level 4**: 44 aliens, 60 seconds
- **Level 5**: 55 aliens, 60 seconds

### Reward Structure

- **Per Level**: $2 worth of Base (0.0006667 ETH)
- **Maximum per Game**: $10 worth of Base (5 levels × $2)
- **Partial Rewards**: Keep earnings for completed levels even if you quit/lose

## 🛠 Technical Stack

### Smart Contracts

- **Language**: Solidity ^0.8.19
- **Framework**: Foundry
- **Security**: OpenZeppelin libraries (ReentrancyGuard, Pausable, Ownable)
- **Verification**: Contract verified on BaseScan

### Frontend

- **Framework**: Next.js 16.1.4
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4

### Infrastructure

- **Network**: Base (Ethereum L2)
- **RPC**: https://mainnet.base.org
- **Gas**: Optimized for low-cost transactions

## 🔧 Getting Started

### For Players

1. Connect your Web3 wallet (MetaMask, Rainbow, etc.)
2. Switch to Base network in your wallet
3. Visit the game interface (when frontend is deployed)
4. Start playing and earning rewards immediately!

### For Developers

```bash
# Clone the repository
git clone https://github.com/Godbrand0/spacebase.git

# Install dependencies
cd spacebase
pnpm install

# Setup environment
cp contract/.env.example contract/.env
# Add your private key to .env

# Run tests
cd contract && forge test

# Deploy (if needed)
cd contract && forge script script/DeploySpaceInvadersGame.s.sol --rpc-url base --broadcast --verify
```

## 🌟 Project Possibilities

### Immediate Opportunities

1. **Gaming Platform**: Expand to multiple game types
2. **Tournament Mode**: Competitive leaderboards and prizes
3. **NFT Integration**: Unique in-game assets as NFTs
4. **Staking Rewards**: Bonus rewards for long-term holders
5. **Guild System**: Team-based gameplay and rewards

### Future Enhancements

1. **Mobile App**: iOS/Android native applications
2. **AI Opponents**: Dynamic difficulty based on player skill
3. **Cross-Chain**: Multi-chain support for wider accessibility
4. **Social Features**: Friend lists, achievements, sharing
5. **Analytics Dashboard**: Player statistics and game insights

### Business Models

1. **Transaction Fees**: Small percentage on reward claims
2. **Premium Features**: Special abilities or cosmetics
3. **Sponsorships**: Branded in-game content
4. **Data Insights**: Anonymized gameplay data for research
5. **API Access**: Third-party game development

## 🔐 Security Features

- **Reentrancy Protection**: Prevents recursive calls
- **Access Control**: Owner-only functions for admin operations
- **Pausable**: Emergency pause mechanism
- **Replay Prevention**: Level completion hashes prevent cheating
- **Input Validation**: All game actions verified on-chain

## 📊 Contract Functions

### Player Functions

- `startGame()`: Begin a new game session
- `completeLevel()`: Submit level completion and earn rewards
- `abandonGame()`: Quit current game and claim partial rewards
- `claimRewards()`: Withdraw earned Base tokens

### View Functions

- `getSessionInfo()`: Get current game status
- `getPlayerSessions()`: View all player game history
- `getLevelTimeRemaining()`: Check time left in current level
- `getContractBalance()`: View total rewards available in contract

### Admin Functions

- `pause()`/`unpause()`: Emergency contract controls
- `withdraw()`: Owner fund management
- `fundContract()`: Add rewards to the contract

## 🤝 Contributing

We welcome contributions! Areas needing help:

1. **Game Development**: New levels, features, mechanics
2. **Frontend**: UI/UX improvements, animations
3. **Security**: Audits, testing, vulnerability reports
4. **Documentation**: Guides, examples, translations
5. **Community**: Moderation, support, events

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- **Contract**: [BaseScan](https://basescan.org/address/0xea0f94bd92dbce3d340e660311aa1cf9aacbe11a)
- **Repository**: [GitHub](https://github.com/Godbrand0/spacebase)
- **Network**: [Base](https://base.org/)
- **Documentation**: [Base Docs](https://docs.base.org/)

---

**Built with ❤️ for the Base ecosystem**
