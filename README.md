# CrowdX 🚀

A decentralized crowdfunding platform built on Ethereum blockchain, empowering creators to launch campaigns with transparency, security, and global accessibility.

![Live on Ethereum Sepolia](https://img.shields.io/badge/Network-Ethereum%20Sepolia-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-lightgrey)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.11.1-blue)

## 🌟 Features

- **🔐 Trustless Security**: Funds locked in smart contracts, released only when goals are met
- **🌍 Global Access**: Anyone with a wallet can contribute from anywhere
- **⚡ Instant Verification**: Real-time funding progress with transparent transaction history
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **🎨 Modern UI**: Dark theme with smooth animations and glassmorphism effects
- **🔄 Wallet Management**: MetaMask integration with wallet switching functionality
- **📊 Dashboard**: Track your created campaigns and contributions
- **👥 Campaign Explorer**: Browse and discover active funding campaigns

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Web3**: Ethers.js v6

### Backend (Smart Contracts)
- **Language**: Solidity ^0.8.20
- **Development**: Hardhat
- **Network**: Ethereum Sepolia Testnet
- **Factory Contract**: `0xd9145CCE52D386f254917e481eB44e9943F39138`

## 📁 Project Structure

```
CrowdX/
├── frontend/              # Next.js application
│   ├── app/              # App router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── campaigns/    # Campaign listing & detail pages
│   │   ├── create/       # Campaign creation page
│   │   ├── dashboard/    # User dashboard
│   │   └── about/        # About page
│   ├── components/       # Reusable components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   └── ui/           # UI components (Button, Card, etc.)
│   └── lib/              # Utilities and Web3 integration
│
├── backend/              # Smart contracts
│   ├── contracts/        # Solidity contracts
│   │   ├── CrowdXFactory.sol
│   │   └── CrowdX.sol
│   ├── scripts/          # Deployment scripts
│   └── hardhat.config.ts # Hardhat configuration
│
└── vercel.json           # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Sepolia testnet ETH (for testing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Koushikmondal06/CrowdX.git
cd CrowdX
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend
npm install
```

4. **Configure environment**
   - Set up MetaMask with Sepolia testnet
   - Get Sepolia ETH from a faucet

### Running the Application

**Frontend (Development)**
```bash
cd frontend
npm run dev
```
Visit `http://localhost:3000`

**Backend (Deploy contracts)**
```bash
cd backend
npx hardhat run scripts/deploy.ts --network sepolia
```

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Create Campaign**: Navigate to "Create" page and fill in campaign details
3. **Browse Campaigns**: Explore active campaigns on the "Explorer" page
4. **Contribute**: Select a campaign and contribute ETH
5. **Track Progress**: View your campaigns and contributions on the "Dashboard"

## 🎨 Design Features

- **Modern Dark Theme**: Eye-friendly dark theme with deep blue accents and vibrant gradients
- **Glassmorphism**: Subtle glass-like effects with backdrop blur
- **Animated Background**: Futuristic grid with glowing particles and network connections
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Smooth Transitions**: Framer Motion animations for enhanced UX

## 📄 Smart Contracts

### CrowdXFactory
- Creates new campaign contracts
- Maintains list of all campaigns
- Emits creation events

### CrowdX
- Manages individual campaign lifecycle
- Handles contributions and fund distribution
- Owner-specific functions (finalize, withdraw)
- Automatic refunds if goal not met

## �‍💻 Developer

Built by **[Koushik Mondal](https://github.com/Koushikmondal06)**

## 📦 APK Download

Mobile app available for Android devices. Click "App Download" in the navbar to get the APK.

## 🔗 Links

- **Live Website**: [https://crowdx.002014.xyz/](https://crowdx.002014.xyz/)
- **GitHub Repository**: [Koushikmondal06/CrowdX](https://github.com/Koushikmondal06/CrowdX)
- **Factory Contract**: [0xd9145CCE52D386f254917e481eB44e9943F39138](https://sepolia.etherscan.io/address/0xd9145CCE52D386f254917e481eB44e9943F39138)

## 📜 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

Built with ❤️ by [Koushik Mondal](https://github.com/Koushikmondal06)