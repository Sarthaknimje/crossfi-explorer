import { useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaCube, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import BlockCard from '@/components/BlockCard';
import TransactionCard from '@/components/TransactionCard';
import { useBlockchain } from '@/hooks/useBlockchain';

export default function Explorer() {
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>('blocks');
  const [searchQuery, setSearchQuery] = useState('');
  const { latestBlocks, latestTransactions, isLoading, error } = useBlockchain();
  
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
      <section className="bg-primary-600 dark:bg-secondary-800 text-white p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">CrossFi Explorer</h1>
          <p className="text-lg mb-6">
            Browse blocks, transactions, addresses, and more on the CrossFi blockchain
          </p>
          
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by address, transaction hash, block..."
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
        </div>
      </section>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`pb-4 px-6 font-medium text-lg flex items-center ${
            activeTab === 'blocks'
              ? 'border-b-2 border-crossfi-primary text-crossfi-primary'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('blocks')}
        >
          <FaCube className="mr-2" /> Blocks
        </button>
        <button
          className={`pb-4 px-6 font-medium text-lg flex items-center ${
            activeTab === 'transactions'
              ? 'border-b-2 border-crossfi-primary text-crossfi-primary'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          <FaExchangeAlt className="mr-2" /> Transactions
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-b-2 border-crossfi-primary rounded-full mx-auto mb-4"></div>
          <p>Loading data from CrossFi blockchain...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <FaInfoCircle size={48} className="mx-auto mb-4" />
          <p className="text-lg">Error loading data: {error}</p>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      ) : (
        <>
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              {latestBlocks.map((block) => (
                <BlockCard 
                  key={block.hash}
                  blockNumber={block.number}
                  timestamp={block.timestamp}
                  transactions={block.transactions.length}
                  hash={block.hash}
                  miner={block.miner}
                  gasUsed={block.gasUsed}
                  gasLimit={block.gasLimit}
                />
              ))}
              
              <div className="flex justify-center mt-8">
                <Link 
                  href="/blocks"
                  className="bg-crossfi-primary hover:bg-primary-600 text-white py-2 px-6 rounded-md transition-colors duration-300"
                >
                  View More Blocks
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {latestTransactions.map((tx) => (
                <TransactionCard 
                  key={tx.hash}
                  hash={tx.hash}
                  from={tx.from}
                  to={tx.to}
                  value={tx.value}
                  blockNumber={tx.blockNumber}
                  gasPrice={tx.gasPrice}
                  status="success"
                />
              ))}
              
              <div className="flex justify-center mt-8">
                <Link 
                  href="/transactions"
                  className="bg-crossfi-primary hover:bg-primary-600 text-white py-2 px-6 rounded-md transition-colors duration-300"
                >
                  View More Transactions
                </Link>
              </div>
            </div>
          )}
        </>
      )}
      
      <section className="bg-gray-100 dark:bg-secondary-800 p-6 rounded-lg">
        <div className="flex items-start">
          <div className="text-primary-600 dark:text-primary-400 mr-4">
            <FaInfoCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">About CrossFi Explorer</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The CrossFi Explorer is built using the Alchemy API to provide comprehensive insights into the CrossFi blockchain.
              You can explore blocks, transactions, accounts, and tokens with real-time data directly from the blockchain.
            </p>
            <div className="mt-4">
              <Link
                href="https://www.alchemy.com/crossfi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-crossfi-primary hover:underline"
              >
                Learn more about Alchemy's CrossFi support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 