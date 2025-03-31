import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaChartLine, FaCube, FaExchangeAlt, FaCoins, FaCheck } from 'react-icons/fa';
import BlockCard from '@/components/BlockCard';
import TransactionCard from '@/components/TransactionCard';
import TokenCard from '@/components/TokenCard';
import { useBlockchain } from '@/hooks/useBlockchain';

export default function Home() {
  const { 
    latestBlocks, 
    latestTransactions, 
    popularTokens, 
    isLoading, 
    error 
  } = useBlockchain();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Determine what kind of search it is
    if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
      // Looks like a transaction hash
      window.location.href = `/tx/${searchQuery}`;
    } else if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
      // Looks like an address
      window.location.href = `/address/${searchQuery}`;
    } else if (!isNaN(Number(searchQuery))) {
      // Looks like a block number
      window.location.href = `/block/${searchQuery}`;
    } else {
      // Try searching for a token
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-crossfi-accent rounded-xl p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">CrossFi Explorer</h1>
          <p className="text-lg mb-8">
            Explore the CrossFi blockchain with comprehensive data and tools powered by Alchemy API
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by address, transaction hash, block, or token..."
                className="input bg-white text-gray-800 pr-12 w-full"
              />
              <button 
                type="submit" 
                className="absolute right-3 text-gray-500 hover:text-gray-800"
                disabled={!searchQuery}
              >
                <FaSearch size={18} />
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/blocks" className="bg-white/20 hover:bg-white/30 transition-colors duration-300 px-4 py-2 rounded-md flex items-center">
              <FaCube className="mr-2" />
              Browse Blocks
            </Link>
            <Link href="/transactions" className="bg-white/20 hover:bg-white/30 transition-colors duration-300 px-4 py-2 rounded-md flex items-center">
              <FaExchangeAlt className="mr-2" />
              View Transactions
            </Link>
            <Link href="/tokens" className="bg-white/20 hover:bg-white/30 transition-colors duration-300 px-4 py-2 rounded-md flex items-center">
              <FaCoins className="mr-2" />
              Explore Tokens
            </Link>
          </div>
        </div>
      </section>
      
      {/* Network Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <div className="text-sm text-gray-500 dark:text-gray-400">Latest Block</div>
          <div className="text-2xl font-semibold mt-1">
            {isLoading ? 'Loading...' : latestBlocks.length > 0 ? `#${latestBlocks[0].number}` : 'N/A'}
          </div>
        </div>
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg Block Time</div>
          <div className="text-2xl font-semibold mt-1">3.2s</div>
        </div>
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <div className="text-sm text-gray-500 dark:text-gray-400">Transactions (24h)</div>
          <div className="text-2xl font-semibold mt-1">34,125</div>
        </div>
        <div className="card bg-primary-50 dark:bg-primary-900/20">
          <div className="text-sm text-gray-500 dark:text-gray-400">XFI Price</div>
          <div className="text-2xl font-semibold mt-1 flex items-center">
            $0.75
            <span className="text-red-500 text-sm ml-2 flex items-center">-1.2% <FaChartLine className="ml-1" size={12} /></span>
          </div>
        </div>
      </section>
      
      {/* Latest Blocks & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Latest Blocks</h2>
            <Link href="/blocks" className="text-crossfi-primary hover:underline text-sm">View All</Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {latestBlocks.slice(0, 3).map((block) => (
                <BlockCard 
                  key={block.hash}
                  blockNumber={block.number}
                  timestamp={block.timestamp}
                  transactions={block.transactions.length}
                  hash={block.hash}
                  miner={block.miner}
                />
              ))}
            </div>
          )}
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Latest Transactions</h2>
            <Link href="/transactions" className="text-crossfi-primary hover:underline text-sm">View All</Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              {latestTransactions.slice(0, 3).map((tx) => (
                <TransactionCard 
                  key={tx.hash}
                  hash={tx.hash}
                  from={tx.from}
                  to={tx.to}
                  value={tx.value}
                  blockNumber={tx.blockNumber}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      
      {/* Popular Tokens */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Popular CrossFi Tokens</h2>
          <Link href="/tokens" className="text-crossfi-primary hover:underline text-sm">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularTokens.map((token) => (
            <TokenCard
              key={token.address}
              name={token.name}
              symbol={token.symbol}
              address={token.address}
              price={token.price}
              priceChange={token.priceChange}
              totalSupply={token.totalSupply}
              marketCap={token.marketCap}
            />
          ))}
        </div>
      </section>
      
      {/* Features */}
      <section className="bg-gray-100 dark:bg-secondary-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-white">
          Explore the CrossFi Ecosystem
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-4 w-16 h-16 mb-4 flex items-center justify-center">
              <FaCube className="text-crossfi-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Fast Transactions</h3>
            <p className="text-gray-600 dark:text-gray-400">
              CrossFi blockchain provides ultra-fast transaction confirmations with low fees.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FaCheck className="text-green-500 mr-2" size={12} />
                <span>Up to 1 million operations per second</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FaCheck className="text-green-500 mr-2" size={12} />
                <span>Sub-second finality</span>
              </li>
            </ul>
          </div>
          
          <div className="card">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-4 w-16 h-16 mb-4 flex items-center justify-center">
              <FaExchangeAlt className="text-crossfi-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">EVM Compatibility</h3>
            <p className="text-gray-600 dark:text-gray-400">
              CrossFi's EVM compatibility ensures seamless integration with existing Ethereum tools and dApps.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FaCheck className="text-green-500 mr-2" size={12} />
                <span>Works with MetaMask and other wallets</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FaCheck className="text-green-500 mr-2" size={12} />
                <span>Deploy Ethereum smart contracts without changes</span>
              </li>
            </ul>
          </div>
          
          <div className="card">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-4 w-16 h-16 mb-4 flex items-center justify-center">
              <FaCoins className="text-crossfi-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Dual Token Economy</h3>
            <p className="text-gray-600 dark:text-gray-400">
              CrossFi operates with a dual token system: MPX for governance and XFI for utility.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FaCheck className="text-green-500 mr-2" size={12} />
                <span>MPX for staking and governance</span>
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FaCheck className="text-green-500 mr-2" size={12} />
                <span>XFI for utility and transactions</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
} 