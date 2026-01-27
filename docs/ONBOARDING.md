# Developer Onboarding Guide

Welcome to SpaceBase! This guide will help you get started as a contributor to the project. Follow these steps to set up your development environment and make your first contribution.

## 🎯 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** package manager - [Installation](https://pnpm.io/installation)
- **Git** - [Download](https://git-scm.com/)
- **Foundry** (for smart contract development) - [Installation](https://book.getfoundry.sh/getting-started/installation)

### Recommended Tools

- **VS Code** with Solidity extension
- **MetaMask** or another Web3 wallet
- **GitHub Desktop** (optional, for easier Git management)

### Knowledge Requirements

- Basic understanding of JavaScript/TypeScript
- Familiarity with React (for frontend)
- Basic knowledge of Solidity and Ethereum
- Understanding of Web3 concepts

## 🚀 Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Godbrand0/spacebase.git
cd spacebase

# Install all dependencies
pnpm install

# Install Foundry dependencies
cd contract && forge install
```

### 2. Verify Installation

```bash
# Check Node.js and pnpm
node --version  # Should be v18+
pnpm --version  # Should be installed

# Check Foundry
forge --version  # Should be installed
```

### 3. Run Tests

```bash
# Test the smart contract
cd contract && forge test

# Should see: "All tests passed!" (or similar success message)
```

## 📁 Project Structure Deep Dive

```
spacebase/
├── contract/                 # Smart contract codebase
│   ├── src/
│   │   └── SpaceInvadersGame.sol  # Main game contract
│   ├── test/                 # Contract tests
│   ├── script/               # Deployment scripts
│   ├── foundry.toml          # Foundry configuration
│   └── lib/                  # Dependencies (OpenZeppelin, etc.)
├── frontend/                 # Web application (Next.js)
│   ├── app/                  # Next.js app directory
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── package.json          # Frontend dependencies
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # System design
│   ├── ONBOARDING.md        # This guide
│   └── api/                 # API documentation
├── CONTRIBUTING.md          # Contribution guidelines
├── DEVELOPMENT_ISSUES.md    # Current tasks
└── README.md               # Project overview
```

## 🎮 Understanding the Game

### Game Mechanics

SpaceBase is a play-to-earn Space Invaders game where:

1. **Players start without staking** any tokens
2. **Complete 5 levels** of increasing difficulty
3. **Earn $2 worth of Base** (~0.0006667 ETH) per level
4. **Claim rewards** immediately after completion

### Smart Contract Flow

```mermaid
graph TD
    A[Player connects wallet] --> B[startGame()]
    B --> C[Session created]
    C --> D[Play Level 1]
    D --> E[completeLevel()]
    E --> F{Level < 5?}
    F -->|Yes| G[Next Level]
    G --> D
    F -->|No| H[Game Completed]
    H --> I[claimRewards()]
    I --> J[Receive Base tokens]
```

## 🛠️ Development Workflow

### 1. Choose a Task

Check the [DEVELOPMENT_ISSUES.md](../DEVELOPMENT_ISSUES.md) file for available tasks. Look for issues marked as "High" priority or "Good first issue".

### 2. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

#### For Smart Contract Changes:

```bash
cd contract

# Run tests frequently
forge test

# Format code
forge fmt

# Check gas usage
forge snapshot
```

#### For Frontend Changes:

```bash
cd frontend

# Start development server
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

### 4. Test Your Changes

```bash
# Smart contract tests
cd contract && forge test

# Frontend tests (when implemented)
cd frontend && pnpm test

# Manual testing - deploy to local network
cd contract && anvil
# In another terminal:
forge script script/DeploySpaceInvadersGame.s.sol --rpc-url http://localhost:8545 --private-key $PRIVATE_KEY --broadcast
```

### 5. Commit and Push

```bash
# Check what files changed
git status

# Add your changes
git add .

# Commit with a clear message
git commit -m "feat: add level completion validation"

# Push to your fork
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to the GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Link to the issue you're solving
6. Request review

## 🧪 Testing the Contract

### Local Testing

```bash
cd contract

# Run all tests
forge test

# Run specific test
forge test --match-test testStartGame

# Run with gas reporting
forge test --gas-report

# Debug a failing test
forge test --match-test testFailingTest -v
```

### Manual Testing with Anvil

```bash
# Start local Ethereum node
anvil

# In another terminal, deploy contract
forge script script/DeploySpaceInvadersGame.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Interact with deployed contract
cast call $CONTRACT_ADDRESS "getContractBalance()" --rpc-url http://localhost:8545
```

## 🌐 Frontend Development

### Current State

The frontend is in early development. The current setup includes:

- Next.js 16 with TypeScript
- Tailwind CSS for styling
- RainbowKit for wallet connection
- Basic project structure

### Getting Started with Frontend

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Key Files to Understand

- `app/page.tsx` - Main page component
- `contract.json` - Contract ABI and address
- `lib/` - Utility functions for contract interaction

## 🔧 Common Development Tasks

### Adding a New Contract Function

1. **Add to Solidity contract** in `contract/src/SpaceInvadersGame.sol`
2. **Add NatSpec documentation**
3. **Write tests** in `contract/test/`
4. **Update ABI** by recompiling
5. **Update frontend integration** if needed

### Modifying Game Logic

1. **Understand current logic** in the contract
2. **Plan changes** considering security implications
3. **Update tests first** (TDD approach)
4. **Implement changes**
5. **Verify all tests pass**

### Frontend Component Development

1. **Create component** in appropriate directory
2. **Add TypeScript types**
3. **Style with Tailwind**
4. **Add to main page**
5. **Test functionality**

## 🐛 Debugging Tips

### Smart Contract Debugging

```bash
# Get detailed test output
forge test -vv

# Debug specific transaction
forge test --debug testFunctionName

# Check contract state
cast call $CONTRACT_ADDRESS "getSessionInfo(uint256)" 1 --rpc-url $RPC_URL
```

### Frontend Debugging

- Use browser DevTools
- Check console for Web3 errors
- Verify contract addresses and ABIs
- Test with MetaMask on local network

### Common Issues

1. **"Contract not found"** - Check deployment address
2. **"Insufficient funds"** - Fund your test account
3. **"Transaction reverted"** - Check contract errors and gas limits
4. **"Type errors"** - Update TypeScript types after ABI changes

## 📚 Learning Resources

### Solidity & Smart Contracts

- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Foundry Book](https://book.getfoundry.sh/)

### Web3 Development

- [Ethers.js Documentation](https://docs.ethers.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Base Network Docs](https://docs.base.org/)

### React & Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 First Contribution Ideas

### Beginner Friendly Tasks

1. **Add contract documentation** - Improve NatSpec comments
2. **Write additional tests** - Increase test coverage
3. **Update documentation** - Fix typos or add examples
4. **Frontend styling** - Improve UI components

### Intermediate Tasks

1. **Add new contract features** - New game mechanics
2. **Frontend components** - Game UI elements
3. **Error handling** - Better user feedback
4. **Performance optimization** - Gas optimization

## 💬 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Discord**: For community chat (when available)

### Asking for Help

When asking questions:

1. **Be specific** - Include error messages, code snippets
2. **Show what you've tried** - Demonstrate debugging efforts
3. **Provide context** - Explain what you're trying to achieve
4. **Use proper formatting** - Code blocks for code, clear structure

### Example Help Request

```
❌ Bad: "My test is failing"
✅ Good: "I'm getting 'revert InvalidLevel()' in testCompleteLevel when calling completeLevel(1, 1, 100, 11, '0x'). I've checked that the session exists and the level is correct. Here's my test code: [code snippet]"
```

## 🏆 Success Criteria

By the end of this onboarding, you should be able to:

- ✅ Set up the development environment
- ✅ Run tests and verify everything works
- ✅ Make a small change (like updating documentation)
- ✅ Create a pull request
- ✅ Understand the basic game flow

## 🚀 Next Steps

1. **Explore the codebase** - Read through the contract and understand the game logic
2. **Check current issues** - Look at DEVELOPMENT_ISSUES.md for tasks
3. **Start small** - Make a documentation or test improvement
4. **Ask questions** - Don't hesitate to ask for clarification
5. **Contribute regularly** - Build momentum with consistent contributions

Welcome to the SpaceBase team! We're excited to have you contribute to our play-to-earn gaming platform. 🚀
