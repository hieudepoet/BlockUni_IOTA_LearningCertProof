# 📚 Proof of Learning Ledger

A Web3 learning platform built on IOTA blockchain that allows users to complete courses and earn verifiable NFT certificates. Built with Move smart contracts and React.

![IOTA](https://img.shields.io/badge/IOTA-Testnet-blue)
![Move](https://img.shields.io/badge/Move-Smart%20Contracts-purple)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)

## 🌟 Features

- **Course Explorer**: Browse available blockchain courses in a modern grid layout
- **Module Learning**: Complete 4 modules per course with progress tracking
- **NFT Certificates**: Mint proof-of-learning NFT badges upon course completion
- **Wallet Integration**: Connect IOTA-compatible wallets using dApp Kit
- **On-chain Records**: All certificates are permanently stored on IOTA testnet

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- IOTA CLI (for smart contract deployment)
- An IOTA-compatible wallet (e.g., IOTA Wallet)

### Installation

```bash
# Clone the repository
cd BlockUni_IOTA

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
BlockUni_IOTA/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.tsx   # Navigation and wallet connect
│   │   └── CourseCard.tsx
│   ├── pages/           # Page components
│   │   ├── CourseExplorer.tsx
│   │   ├── CourseLearning.tsx
│   │   └── MyCertificates.tsx
│   ├── context/         # React context providers
│   │   └── LearningContext.tsx
│   ├── data/            # Mock data and course info
│   │   └── courses.ts
│   ├── App.tsx          # Main app with providers
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── move/
│   └── proof_of_learning/
│       ├── Move.toml    # Move package config
│       └── sources/
│           └── certificate.move  # NFT certificate smart contract
└── package.json
```

## 🔗 Smart Contract

The Move smart contract (`move/proof_of_learning/sources/certificate.move`) implements:

### Structs
- **CourseCertificate**: NFT representing course completion
- **LearningProgress**: Tracks module completion for a learner

### Functions
- `start_learning`: Initialize course progress tracker
- `complete_module`: Mark a module as completed (1-4)
- `mint_certificate`: Mint NFT after completing all modules
- `is_course_completed`: Check if all modules are done

### Deploy to IOTA Testnet

```bash
# Install IOTA CLI
brew install iotaledger/tap/iota

# Connect to testnet
iota client new-env --alias testnet --rpc https://api.testnet.iota.cafe

# Get testnet tokens
iota client faucet

# Build and deploy
cd move/proof_of_learning
iota move build
iota client publish --gas-budget 100000000
```

### ✅ Deployed Contract (Testnet)

| Item | Value |
|------|-------|
| **Package ID** | `0x48c65c6023dc037a8433617843c62645a9f52b40d63fe0e6afca65e4ffa5dda9` |
| **Transaction** | `EsW9mK7cjw2YMijxSiNfvFZujkn4FFGgn1tKtA3TKakS` |
| **Network** | IOTA Testnet |
| **Explorer** | [View on Explorer](https://explorer.rebased.iota.org/object/0x48c65c6023dc037a8433617843c62645a9f52b40d63fe0e6afca65e4ffa5dda9?network=testnet) |

## 🎨 User Flow

1. **Connect Wallet**: Click "Connect Wallet" to connect your IOTA wallet
2. **Browse Courses**: View available courses on the Course Explorer page
3. **Start Learning**: Click on a course to begin
4. **Complete Modules**: Click "Complete Module 1", then 2, 3, 4 sequentially
5. **Mint Certificate**: After all modules, mint your NFT certificate
6. **View Certificates**: Navigate to "My Certificates" to see earned badges

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, React Router
- **Styling**: Vanilla CSS with CSS Variables (glassmorphism design)
- **Blockchain**: IOTA (Testnet)
- **Smart Contracts**: Move language
- **SDK**: @iota/dapp-kit, @iota/iota-sdk
- **State Management**: React Context + TanStack Query
- **Build Tool**: Vite 7

## 📝 Environment

The app connects to IOTA Testnet by default. To change network:

```typescript
// In src/App.tsx
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  // mainnet: { url: getFullnodeUrl('mainnet') }, // for production
});
```

## 🔐 Demo Mode

Currently, the app runs in demo mode with mock data:
- Courses are pre-defined in `src/data/courses.ts`
- Certificate minting simulates blockchain transactions
- To enable real blockchain integration, deploy the Move contract and update the mint function

## 📜 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ on IOTA Blockchain
