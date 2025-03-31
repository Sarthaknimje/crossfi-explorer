# CrossFi API Quickstart

A comprehensive blockchain explorer and DApp for CrossFi, built with Next.js, React, and the Alchemy API. This project demonstrates integration with the CrossFi blockchain and provides useful tools for developers and users.

![CrossFi API Quickstart](https://crossfi.org/img/logo-crossfi-primary.svg)

## Features

- 🔍 **Blockchain Explorer:** View blocks, transactions, and addresses on the CrossFi blockchain
- 💰 **Token Dashboard:** Explore CrossFi tokens, including XFI, MPX, and eMPX
- 💱 **Token Swap:** Swap tokens on the CrossFi blockchain
- 👛 **Wallet Integration:** Connect your MetaMask or other Ethereum wallets
- 🌗 **Dark Mode Support:** Toggle between light and dark themes

## Technologies

- 🔷 **Next.js:** React framework for server-rendered applications
- ⚛️ **React 18:** Modern React with hooks
- 🧰 **TypeScript:** For type safety and better developer experience
- 🔗 **Alchemy SDK:** For interacting with the CrossFi blockchain
- 📦 **Ethers.js:** Ethereum library for wallet integration
- 🎨 **TailwindCSS:** For responsive and beautiful UI
- 🔔 **React-Toastify:** For displaying notifications

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- An Alchemy API key for CrossFi

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/crossfi-api-quickstart.git
cd crossfi-api-quickstart
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Alchemy API key:

```
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
crossfi-api-quickstart/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Next.js pages
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Components

- **BlockCard:** Displays information about a block
- **TransactionCard:** Displays information about a transaction
- **TokenCard:** Displays information about a token
- **Layout:** Main layout with Navbar and Footer
- **Navbar:** Navigation bar with wallet connection

## Custom Hooks

- **useBlockchain:** Hook for interacting with the CrossFi blockchain
- **useWallet:** Hook for wallet connection and management

## Pages

- **Home (`/`):** Dashboard with overview of CrossFi blockchain
- **Explorer (`/explorer`):** Browse blocks and transactions
- **Tokens (`/tokens`):** List and filter tokens
- **Swap (`/swap`):** Swap tokens
- **Wallet (`/wallet`):** View wallet assets and transactions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgements

- [CrossFi](https://crossfi.org) - The CrossFi blockchain project
- [Alchemy](https://www.alchemy.com) - For providing the CrossFi API
- [Next.js](https://nextjs.org) - The React framework used 