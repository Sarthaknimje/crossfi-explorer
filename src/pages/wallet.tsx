import { useState, useEffect } from 'react';
import { FaWallet, FaCopy, FaExchangeAlt, FaHistory, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useWallet } from '@/hooks/useWallet';
import { useBlockchain } from '@/hooks/useBlockchain';
import TransactionCard from '@/components/TransactionCard';
import TokenCard from '@/components/TokenCard';
import { toast } from 'react-toastify';

export default function Wallet() {
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, switchToCrossFiChain } = useWallet();
  const { popularTokens, getAddressBalance } = useBlockchain();
  const [balance, setBalance] = useState<string>('0');
  const [activeTab, setActiveTab] = useState<'assets' | 'transactions'>('assets');
  
  // Fetch balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && address) {
        const bal = await getAddressBalance(address);
        setBalance(bal);
      } else {
        setBalance('0');
      }
    };
    
    fetchBalance();
  }, [isConnected, address, getAddressBalance]);
  
  const copyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };
  
  // Mock token balances
  const tokenBalances = [
    {
      ...popularTokens[0],
      balance: '145.75',
      value: '182.19',
    },
    {
      ...popularTokens[1],
      balance: '500.0',
      value: '375.00',
    },
  ];
  
  // Mock transaction history
  const transactionHistory = [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: address || '0x0000000000000000000000000000000000000000',
      to: '0x1234567890123456789012345678901234567890',
      value: '1000000000000000000', // 1 XFI
      timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      status: 'success' as const,
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      from: '0x2345678901234567890123456789012345678901',
      to: address || '0x0000000000000000000000000000000000000000',
      value: '5000000000000000000', // 5 XFI
      timestamp: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      status: 'success' as const,
    },
  ];
  
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-crossfi-primary to-primary-700 text-white p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">CrossFi Wallet</h1>
          <p className="text-lg mb-4">
            Connect your wallet to view your assets and transactions on the CrossFi blockchain
          </p>
        </div>
      </section>
      
      {!isConnected ? (
        <div className="card text-center py-12">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-6 mb-6">
              <FaWallet className="text-crossfi-primary" size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            Connect your wallet to view your assets, send transactions, and interact with the CrossFi blockchain.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-primary px-8 py-3 text-lg"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-4 mr-4">
                  <FaWallet className="text-crossfi-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Connected Wallet</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </span>
                    <button
                      onClick={copyAddressToClipboard}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <FaCopy size={14} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Balance</div>
                <div className="text-2xl font-semibold">{parseFloat(balance).toFixed(4)} XFI</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ≈ ${(parseFloat(balance) * 0.75).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button className="card bg-gray-50 dark:bg-secondary-800 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors p-4 flex items-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-3">
                  <FaExchangeAlt className="text-blue-500" size={18} />
                </div>
                <span>Send Assets</span>
              </button>
              
              <button className="card bg-gray-50 dark:bg-secondary-800 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors p-4 flex items-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-3">
                  <FaExchangeAlt className="text-green-500" size={18} />
                </div>
                <span>Receive Assets</span>
              </button>
              
              <button 
                onClick={disconnectWallet}
                className="card bg-gray-50 dark:bg-secondary-800 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors p-4 flex items-center"
              >
                <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mr-3">
                  <FaSignOutAlt className="text-red-500" size={18} />
                </div>
                <span>Disconnect</span>
              </button>
            </div>
          </div>
          
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <button
              className={`pb-4 px-6 font-medium text-lg flex items-center ${
                activeTab === 'assets'
                  ? 'border-b-2 border-crossfi-primary text-crossfi-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('assets')}
            >
              <FaWallet className="mr-2" /> Assets
            </button>
            <button
              className={`pb-4 px-6 font-medium text-lg flex items-center ${
                activeTab === 'transactions'
                  ? 'border-b-2 border-crossfi-primary text-crossfi-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('transactions')}
            >
              <FaHistory className="mr-2" /> Transactions
            </button>
          </div>
          
          {activeTab === 'assets' && (
            <div className="space-y-4">
              <div className="card bg-primary-50 dark:bg-primary-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="rounded-full bg-crossfi-primary p-3 mr-3">
                      <FaWallet className="text-white" size={18} />
                    </div>
                    <div>
                      <div className="font-medium">XFI</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">CrossFi Coin</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{parseFloat(balance).toFixed(4)} XFI</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ≈ ${(parseFloat(balance) * 0.75).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              {tokenBalances.map((token) => (
                <div key={token.address} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-3 mr-3">
                        <FaWallet className="text-crossfi-primary" size={18} />
                      </div>
                      <div>
                        <div className="font-medium">{token.symbol}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{token.balance} {token.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ≈ ${token.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Other Assets on CrossFi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {popularTokens.slice(2).map((token) => (
                    <TokenCard
                      key={token.address}
                      name={token.name}
                      symbol={token.symbol}
                      address={token.address}
                      price={token.price}
                      priceChange={token.priceChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {transactionHistory.length > 0 ? (
                transactionHistory.map((tx) => (
                  <TransactionCard
                    key={tx.hash}
                    hash={tx.hash}
                    from={tx.from}
                    to={tx.to}
                    value={tx.value}
                    timestamp={tx.timestamp}
                    status={tx.status}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <FaExclamationTriangle className="mx-auto mb-4 text-yellow-500" size={48} />
                  <p className="text-lg mb-2">No transactions found</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't made any transactions on the CrossFi blockchain yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 