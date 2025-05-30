import { useState, useEffect, useCallback } from 'react';
import { alchemy, provider } from '@/utils/alchemy';
import { formatEther } from 'ethers';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';

// Define types for blockchain data
export interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
  miner: string;
  gasUsed: string;
  gasLimit: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp?: number;
  status?: 'success' | 'failed' | 'pending';
  gasUsed?: string;
  gasPrice?: string;
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  logoUrl?: string;
  price?: string;
  priceChange?: number;
  totalSupply?: string;
  marketCap?: string;
}

interface TokenMetrics {
  timestamp: number;
  price: number;
  volume: number;
  transactions: number;
}

// Define hook interface
interface UseBlockchainReturn {
  latestBlocks: Block[];
  latestTransactions: Transaction[];
  popularTokens: Token[];
  isLoading: boolean;
  error: string | null;
  getBlock: (blockHashOrNumber: string | number) => Promise<Block | null>;
  getTransaction: (txHash: string) => Promise<Transaction | null>;
  getToken: (tokenAddress: string) => Promise<Token | null>;
  getAddressBalance: (address: string) => Promise<string>;
  getAddressTransactions: (address: string) => Promise<Transaction[]>;
  getTokenMetrics: () => Promise<TokenMetrics[]>;
  getApiKey: () => Promise<string>;
  getTransactionHistory: (address: string, page?: number, limit?: number) => Promise<Transaction[]>;
  getTokenHolders: (tokenAddress: string, minBalance?: number) => Promise<{ address: string; balance: number }[]>;
}

export const useBlockchain = (): UseBlockchainReturn => {
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [popularTokens, setPopularTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [provider] = useState(() => {
    const alchemy = new Alchemy({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    });
    return alchemy;
  });

  // Initialize with default popular tokens
  useEffect(() => {
    // Mock popular tokens on CrossFi network
    const tokens: Token[] = [
      {
        name: 'Mint Power',
        symbol: 'MPX',
        address: '0x1234567890123456789012345678901234567890',
        price: '1.25',
        priceChange: 2.5,
        totalSupply: '4000000000',
        marketCap: '5000000000',
      },
      {
        name: 'CrossFi',
        symbol: 'XFI',
        address: '0x0987654321098765432109876543210987654321',
        price: '0.75',
        priceChange: -1.2,
        totalSupply: '378400000',
        marketCap: '283800000',
      },
      {
        name: 'eMPX',
        symbol: 'eMPX',
        address: '0x2468135790246813579024681357902468135790',
        price: '1.20',
        priceChange: 0.8,
        totalSupply: '500000000',
        marketCap: '600000000',
      },
    ];

    setPopularTokens(tokens);
  }, []);

  // Function to fetch latest blocks and transactions
  const fetchLatestData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get current block number
      const blockNumber = await provider.getBlockNumber();
      
      // Fetch the latest 5 blocks
      const blocks: Block[] = [];
      const transactions: Transaction[] = [];
      
      for (let i = 0; i < 5; i++) {
        if (blockNumber - i < 0) break;
        
        const block = await provider.getBlock(blockNumber - i);
        if (block) {
          blocks.push({
            number: Number(block.number),
            hash: block.hash,
            timestamp: Number(block.timestamp),
            transactions: block.transactions,
            miner: block.miner || '0x0000000000000000000000000000000000000000',
            gasUsed: block.gasUsed.toString(),
            gasLimit: block.gasLimit.toString(),
          });
          
          // Get a few transactions from each block
          const txHashes = block.transactions.slice(0, 3);
          for (const txHash of txHashes) {
            const tx = await provider.getTransaction(txHash);
            if (tx) {
              transactions.push({
                hash: tx.hash,
                from: tx.from,
                to: tx.to || '0x0000000000000000000000000000000000000000',
                value: tx.value.toString(),
                blockNumber: Number(tx.blockNumber),
                gasPrice: tx.gasPrice ? formatEther(tx.gasPrice) : undefined,
              });
            }
          }
        }
      }
      
      setLatestBlocks(blocks);
      setLatestTransactions(transactions);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching blockchain data:', err);
      setError('Failed to fetch blockchain data');
      setIsLoading(false);
      toast.error('Error fetching blockchain data. Please try again later.');
    }
  }, [provider]);

  // Initialize data on component mount
  useEffect(() => {
    fetchLatestData();
    
    // Set up polling for new data every 15 seconds
    const interval = setInterval(fetchLatestData, 15000);
    
    return () => clearInterval(interval);
  }, [fetchLatestData]);

  // Function to get a specific block
  const getBlock = async (blockHashOrNumber: string | number): Promise<Block | null> => {
    try {
      const block = await provider.getBlock(blockHashOrNumber);
      if (!block) return null;
      
      return {
        number: Number(block.number),
        hash: block.hash,
        timestamp: Number(block.timestamp),
        transactions: block.transactions,
        miner: block.miner || '0x0000000000000000000000000000000000000000',
        gasUsed: block.gasUsed.toString(),
        gasLimit: block.gasLimit.toString(),
      };
    } catch (err) {
      console.error('Error fetching block:', err);
      toast.error('Error fetching block. Please try again later.');
      return null;
    }
  };

  // Function to get a specific transaction
  const getTransaction = async (txHash: string): Promise<Transaction | null> => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (!tx) return null;
      
      // Get transaction receipt for status and gas used
      const receipt = await provider.getTransactionReceipt(txHash);
      
      // Get block to get the timestamp
      const block = tx.blockNumber ? await provider.getBlock(tx.blockNumber) : null;
      
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || '0x0000000000000000000000000000000000000000',
        value: tx.value.toString(),
        blockNumber: tx.blockNumber ? Number(tx.blockNumber) : 0,
        timestamp: block ? Number(block.timestamp) : undefined,
        status: receipt ? (receipt.status ? 'success' : 'failed') : 'pending',
        gasUsed: receipt ? receipt.gasUsed.toString() : undefined,
        gasPrice: tx.gasPrice ? formatEther(tx.gasPrice) : undefined,
      };
    } catch (err) {
      console.error('Error fetching transaction:', err);
      toast.error('Error fetching transaction. Please try again later.');
      return null;
    }
  };

  // Function to get token details
  const getToken = async (tokenAddress: string): Promise<Token | null> => {
    try {
      // For now, we're just returning mock data
      // In a real application, you would fetch this from the blockchain
      const mockToken: Token = {
        name: 'Mock Token',
        symbol: 'MOCK',
        address: tokenAddress,
        price: '0.5',
        priceChange: 1.5,
        totalSupply: '1000000000',
        marketCap: '500000000',
      };
      
      return mockToken;
    } catch (err) {
      console.error('Error fetching token:', err);
      toast.error('Error fetching token. Please try again later.');
      return null;
    }
  };

  // Function to get address balance
  const getAddressBalance = async (address: string): Promise<string> => {
    try {
      const balance = await provider.getBalance(address);
      return formatEther(balance);
    } catch (err) {
      console.error('Error fetching address balance:', err);
      toast.error('Error fetching address balance. Please try again later.');
      return '0';
    }
  };

  // Function to get address transactions
  const getAddressTransactions = async (address: string): Promise<Transaction[]> => {
    try {
      
      return [];
    } catch (err) {
      console.error('Error fetching address transactions:', err);
      toast.error('Error fetching address transactions. Please try again later.');
      return [];
    }
  };

  const getTokenMetrics = useCallback(async (): Promise<TokenMetrics[]> => {
    try {
      // In a real implementation, this would fetch from your backend API
      // For now, we'll return mock data
      const now = Date.now();
      const metrics: TokenMetrics[] = [];
      
      for (let i = 24; i >= 0; i--) {
        metrics.push({
          timestamp: now - i * 3600000, // Last 24 hours in hourly intervals
          price: 100 + Math.random() * 20,
          volume: 1000000 + Math.random() * 500000,
          transactions: 100 + Math.floor(Math.random() * 50)
        });
      }
      
      return metrics;
    } catch (error) {
      console.error('Error fetching token metrics:', error);
      throw error;
    }
  }, []);

  const getApiKey = useCallback(async (): Promise<string> => {
    try {
      // In a real implementation, this would be generated or retrieved from your backend
      // For now, we'll return a mock API key
      return 'xfi_' + Math.random().toString(36).substring(2, 15);
    } catch (error) {
      console.error('Error getting API key:', error);
      throw error;
    }
  }, []);

  const getTransactionHistory = useCallback(async (address: string, page: number = 1, limit: number = 10) => {
    try {
      const response = await provider.core.getAssetTransfers({
        fromBlock: '0x0',
        toBlock: 'latest',
        fromAddress: address,
        category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
        withMetadata: true,
        excludeZeroValue: true,
        maxCount: limit,
        pageKey: page > 1 ? (page - 1).toString() : undefined
      });

      return response.transfers;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }, [provider]);

  const getTokenHolders = useCallback(async (tokenAddress: string, minBalance: number = 0) => {
    try {
      // In a real implementation, this would fetch from your backend API
      // For now, we'll return mock data
      const holders = [];
      for (let i = 0; i < 10; i++) {
        const balance = Math.random() * 1000000;
        if (balance >= minBalance) {
          holders.push({
            address: ethers.Wallet.createRandom().address,
            balance: balance
          });
        }
      }
      return holders;
    } catch (error) {
      console.error('Error fetching token holders:', error);
      throw error;
    }
  }, []);

  return {
    latestBlocks,
    latestTransactions,
    popularTokens,
    isLoading,
    error,
    getBlock,
    getTransaction,
    getToken,
    getAddressBalance,
    getAddressTransactions,
    getTokenMetrics,
    getApiKey,
    getTransactionHistory,
    getTokenHolders
  };
}; 