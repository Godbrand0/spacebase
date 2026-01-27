# Contributing to Spacebase

Thank you for your interest in contributing to Spacebase! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Git
- Foundry (for smart contract development)
- Basic knowledge of React, TypeScript, and Solidity

### Setup

1. Fork the repository
2. Clone your fork locally
3. Install dependencies:
   ```bash
   pnpm install
   cd contract && forge install
   ```

### Project Structure

```
spacebase/
├── contract/                 # Smart contracts (Foundry)
│   ├── src/                  # Contract source files
│   ├── script/               # Deployment scripts
│   ├── test/                 # Contract tests
│   ├── lib/                  # Dependencies (OpenZeppelin, Forge Std)
│   └── foundry.toml          # Foundry configuration
├── frontend/                 # Web application (Next.js) - In Development
│   ├── app/                  # React components
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   └── public/               # Static assets
├── docs/                    # Documentation
│   ├── api/                 # API documentation
│   └── examples/            # Code examples
├── CONTRIBUTING.md          # This file
├── DEVELOPMENT_ISSUES.md    # Current development tasks
└── README.md               # Project overview
```

## Development Workflow

### 1. Choose an Issue

- Browse the [DEVELOPMENT_ISSUES.md](./DEVELOPMENT_ISSUES.md) file for available tasks
- Comment on the issue you want to work on
- Wait for assignment before starting

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

- Follow the existing code style
- Write tests for new functionality
- Update documentation as needed
- Add documentation updates as part of definition of done for new features

### 4. Test Your Changes

```bash
# Test contracts
cd contract && forge test

# Test frontend (when implemented)
cd frontend && pnpm test

# Format and lint contracts
cd contract && forge fmt
```

### 5. Submit a Pull Request

- Push your changes to your fork
- Create a pull request with a clear description
- Link the issue you're addressing
- Wait for code review

## Code Style Guidelines

### Frontend (React/TypeScript)

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling

### Smart Contracts (Solidity)

- Follow Solidity style guide
- Use NatSpec documentation
- Implement proper access controls
- Add comprehensive tests
- Consider gas optimization

## Testing

### Frontend Testing

- Unit tests with Jest and React Testing Library
- Integration tests for contract interactions
- E2E tests for critical user flows

### Contract Testing

- Unit tests for all contract functions
- Integration tests for contract interactions
- Gas usage analysis
- Security testing

## Security Considerations

- Never commit private keys or sensitive data
- Follow security best practices for smart contracts
- Report security vulnerabilities privately
- Use the security audit checklist before deployment

## Getting Help

- Check the [documentation](../docs/README.md) for detailed guides
- Join our Discord community
- Ask questions in GitHub discussions
- Check existing issues and documentation
- Reach out to maintainers

## License

By contributing to Spacebase, you agree that your contributions will be licensed under the MIT License.
