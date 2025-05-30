# CrossFi Developer & Analytics Dashboard

A comprehensive blockchain explorer and DApp for CrossFi, built with Next.js, React, and the Alchemy API. This project has evolved from a simple explorer into a full CrossFi Developer & Analytics Dashboard, providing powerful tools for developers and users.

![CrossFi API Quickstart](https://crossfi.org/img/logo-crossfi-primary.svg)

## Features

- 🔍 **Advanced Blockchain Explorer:** View blocks, transactions, and addresses on the CrossFi blockchain with enhanced analytics
- 💰 **Token Analytics Dashboard:** Comprehensive metrics and usage statistics for CrossFi tokens
- 💱 **Token Swap:** Swap tokens on the CrossFi blockchain
- 👛 **Enhanced Wallet Support:** Advanced wallet features including balances, transactions, and token monitoring
- 🌗 **Dark Mode Support:** Toggle between light and dark themes
- 📊 **Real-time Analytics:** Live tracking of token and contract metrics
- 🛠️ **Developer APIs:** Easy integration of CrossFi data into your applications

## Technologies

- 🔷 **Next.js:** React framework for server-rendered applications
- ⚛️ **React 18:** Modern React with hooks
- 🧰 **TypeScript:** For type safety and better developer experience
- 🔗 **Alchemy SDK:** For interacting with the CrossFi blockchain
- 📦 **Ethers.js:** Ethereum library for wallet integration
- 🎨 **TailwindCSS:** For responsive and beautiful UI
- 🔔 **React-Toastify:** For displaying notifications
- 📈 **Analytics Tools:** For real-time data visualization and metrics

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
- **AnalyticsDashboard:** Real-time metrics and statistics
- **DeveloperAPIs:** Integration endpoints and documentation

## Custom Hooks

- **useBlockchain:** Hook for interacting with the CrossFi blockchain
- **useWallet:** Hook for wallet connection and management
- **useAnalytics:** Hook for accessing real-time analytics data
- **useDeveloperAPI:** Hook for integrating with CrossFi developer APIs

## Pages

- **Home (`/`):** Dashboard with overview of CrossFi blockchain
- **Explorer (`/explorer`):** Browse blocks and transactions
- **Tokens (`/tokens`):** List and filter tokens with advanced analytics
- **Swap (`/swap`):** Swap tokens
- **Wallet (`/wallet`):** View wallet assets and transactions
- **Analytics (`/analytics`):** Real-time metrics and statistics
- **Developer (`/developer`):** API documentation and integration tools

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgements

- [CrossFi](https://crossfi.org) - The CrossFi blockchain project
- [Alchemy](https://www.alchemy.com) - For providing the CrossFi API
- [Next.js](https://nextjs.org) - The React framework used 