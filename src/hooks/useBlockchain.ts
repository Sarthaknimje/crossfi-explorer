import { useState, useEffect, useCallback } from 'react';
import { alchemy, provider } from '@/utils/alchemy';
import { formatEther } from 'ethers';
import { toast } from 'react-toastify';

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
}

export const useBlockchain = (): UseBlockchainReturn => {
  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [popularTokens, setPopularTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

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
  };
}; 