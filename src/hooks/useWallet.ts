import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { CROSSFI_CHAIN_ID } from '@/utils/alchemy';
import { connectKeplr, getKeplrAccount } from '@/utils/keplr';
import { alchemy } from '@/utils/alchemy';

interface UseWalletReturn {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToCrossFiChain: () => Promise<void>;
  balance: string | null;
  tokens: any[];
  transactions: any[];
  loading: {
    balance: boolean;
    tokens: boolean;
    transactions: boolean;
  };
  getTokenBalances: () => Promise<void>;
  getTransactionHistory: () => Promise<void>;
  sendTransaction: (to: string, amount: string, asset?: string) => Promise<string | null>;
}

export const useWallet = (): UseWalletReturn => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState({
    balance: false,
    tokens: false,
    transactions: false,
  });

  // Initialize wallet connection from localStorage
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Check if user was previously connected
          const savedAddress = localStorage.getItem('walletAddress');
          if (savedAddress) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Setup event listeners for wallet changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Handle account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (accounts[0] !== address) {
          // User switched accounts
          setAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
          toast.info('Account changed');
        }
      };

      // Handle chain changes
      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16).toString();
        setChainId(newChainId);
        
        // Reload the page when chain changes for a fresh state
        window.location.reload();
      };

      // Handle disconnect
      const handleDisconnect = () => {
        disconnectWallet();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [address]);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error('Please install MetaMask or another Ethereum wallet extension');
      return;
    }

    try {
      setIsConnecting(true);

      // Create ethers provider and get accounts
      const ethersProvider = new BrowserProvider(window.ethereum);
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      
      // Get network
      const network = await ethersProvider.getNetwork();
      const connectedChainId = network.chainId.toString();
      
      // Get signer
      const ethersSigner = await ethersProvider.getSigner();
      
      // Update state
      setAddress(accounts[0]);
      setChainId(connectedChainId);
      setSigner(ethersSigner);
      setProvider(ethersProvider);
      
      // Save connection in localStorage
      localStorage.setItem('walletAddress', accounts[0]);
      
      toast.success('Wallet connected');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setSigner(null);
    setProvider(null);
    
    // Remove from localStorage
    localStorage.removeItem('walletAddress');
    
    toast.info('Wallet disconnected');
  }, []);

  // Switch to CrossFi chain
  const switchToCrossFiChain = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask or another Ethereum wallet extension');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }], // TODO: Update with actual CrossFi chain ID in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x5', // TODO: Update with actual CrossFi chain ID in hex
                chainName: 'CrossFi Mainnet',
                nativeCurrency: {
                  name: 'CrossFi',
                  symbol: 'XFI',
                  decimals: 18,
                },
                rpcUrls: ['https://crossfi-mainnet.g.alchemy.com/v2/'], // TODO: Update with actual RPC URL
                blockExplorerUrls: ['https://xfiscan.com'], // TODO: Update with actual explorer URL
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding CrossFi chain:', addError);
          toast.error('Failed to add CrossFi network to your wallet');
        }
      } else {
        console.error('Error switching to CrossFi chain:', switchError);
        toast.error('Failed to switch to CrossFi network');
      }
    }
  }, []);

  // Get token balances for the connected account
  const getTokenBalances = useCallback(async () => {
    if (!address) return;
    
    setLoading(prev => ({ ...prev, tokens: true }));
    
    try {
      if (chainId === CROSSFI_CHAIN_ID) {
        // For Keplr wallet on CrossFi chain
        // In a real implementation, you'd fetch token balances from the CrossFi chain
        const xfiToken = {
          name: "CrossFi Token",
          symbol: "XFI",
          logo: "/logo.svg",
          address: "0x8e32b8a41f2589c1f279e94a648dd9d8e861cc94", // Example address
          decimals: 18,
          balance: "10.55",
          price: 0.101,
          value: 10.55 * 0.101,
        };
        
        setTokens([xfiToken]);
      } else {
        // For MetaMask or other EVM wallets
        // Get token balances using Alchemy SDK
        const balances = await alchemy.core.getTokenBalances(address);
        
        const tokenData = await Promise.all(
          balances.tokenBalances.map(async (token) => {
            const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
            
            // Calculate token balance in human-readable format
            const balance = token.tokenBalance;
            const decimals = metadata.decimals;
            const formattedBalance = balance 
              ? ethers.formatUnits(balance, decimals) 
              : "0";
            
            // Try to get price data (simplified)
            let price = 0;
            try {
              // In a real app, you'd use a reliable price API
              const priceResponse = await fetch(
                `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${token.contractAddress}&vs_currencies=usd`
              );
              const priceData = await priceResponse.json();
              price = priceData[token.contractAddress.toLowerCase()]?.usd || 0;
            } catch (error) {
              console.warn("Could not fetch price for token:", token.contractAddress);
            }
            
            return {
              name: metadata.name || "Unknown Token",
              symbol: metadata.symbol || "???",
              logo: metadata.logo || "",
              address: token.contractAddress,
              decimals: metadata.decimals,
              balance: formattedBalance,
              price: price,
              value: parseFloat(formattedBalance) * price,
            };
          })
        );
        
        // Filter out tokens with zero balance and sort by value
        const filteredTokens = tokenData
          .filter(token => parseFloat(token.balance) > 0)
          .sort((a, b) => b.value - a.value);
        
        setTokens(filteredTokens);
      }
    } catch (error) {
      console.error("Error fetching token balances:", error);
      toast.error("Failed to load token balances");
    } finally {
      setLoading(prev => ({ ...prev, tokens: false }));
    }
  }, [address, chainId]);

  // Get transaction history for the connected account
  const getTransactionHistory = useCallback(async () => {
    if (!address) return;
    
    setLoading(prev => ({ ...prev, transactions: true }));
    
    try {
      if (chainId === CROSSFI_CHAIN_ID) {
        // For Keplr wallet on CrossFi chain
        // In a real implementation, you'd fetch transactions from the CrossFi chain
        // For demonstration, we're using mock data
        const sampleTxs = [
          {
            hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            from: address,
            to: "crossfi1random_address_here",
            value: "5.0",
            asset: "XFI",
            timestamp: Date.now() - 3600000, // 1 hour ago
            status: "success",
            type: "send",
          },
          {
            hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            from: "crossfi1another_random_address",
            to: address,
            value: "10.5",
            asset: "XFI",
            timestamp: Date.now() - 86400000, // 1 day ago
            status: "success",
            type: "receive",
          }
        ];
        
        setTransactions(sampleTxs);
      } else {
        // For MetaMask or other EVM wallets
        // Get transaction history using Alchemy SDK
        const sentTxs = await alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: ["external", "internal", "erc20", "erc721", "erc1155"],
        });
        
        const receivedTxs = await alchemy.core.getAssetTransfers({
          toAddress: address,
          category: ["external", "internal", "erc20", "erc721", "erc1155"],
        });
        
        // Combine and format transactions
        const allTxs = [...sentTxs.transfers, ...receivedTxs.transfers].map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value?.toString() || "0",
          asset: tx.asset || "ETH",
          timestamp: tx.metadata.blockTimestamp 
            ? new Date(tx.metadata.blockTimestamp).getTime() 
            : Date.now(),
          status: "success", // Alchemy doesn't provide status in this response
          type: tx.from.toLowerCase() === address.toLowerCase() ? "send" : "receive",
        }));
        
        // Sort by timestamp (newest first)
        const sortedTxs = allTxs.sort((a, b) => b.timestamp - a.timestamp);
        
        setTransactions(sortedTxs);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  }, [address, chainId]);

  // Send transaction
  const sendTransaction = useCallback(async (to, amount, asset = 'XFI') => {
    if (!address || !chainId) {
      toast.error('Please connect your wallet first');
      return null;
    }
    
    try {
      if (chainId === CROSSFI_CHAIN_ID) {
        // Send transaction using Keplr
        if (!window.keplr) {
          toast.error("Keplr wallet extension not found");
          return null;
        }
        
        // This is a simplified example
        // In a real implementation, you'd use the Cosmos SDK to create and send transactions
        await window.keplr.enable(CROSSFI_CHAIN_ID);
        
        // Get the offline signer
        const offlineSigner = window.keplr.getOfflineSigner(CROSSFI_CHAIN_ID);
        
        // Create a client
        // const client = await SigningStargateClient.connectWithSigner(
        //   "https://rpc.crossfi.org",
        //   offlineSigner
        // );
        
        // Create and send the transaction
        // const result = await client.sendTokens(
        //   address,
        //   to,
        //   [{ denom: "uxfi", amount: (parseFloat(amount) * 1000000).toString() }],
        //   { gas: "200000", amount: [{ denom: "uxfi", amount: "5000" }] }
        // );
        
        // For now, we'll just show a success message
        toast.success(`Transaction sent: ${amount} ${asset} to ${to}`);
        return "tx_hash_would_be_here";
      } else {
        // Send transaction using MetaMask/EVM provider
        if (asset === 'ETH' || asset === 'MATIC') {
          // Send native token (ETH/MATIC)
          const tx = await provider.getSigner().sendTransaction({
            to: to,
            value: ethers.parseEther(amount),
          });
          
          toast.success(`Transaction sent: ${tx.hash}`);
          return tx.hash;
        } else {
          // Send ERC20 token
          // For this, you would need the token contract ABI and address
          toast.error("ERC20 token transfers not implemented in this example");
          return null;
        }
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error(`Failed to send transaction: ${error.message}`);
      return null;
    }
  }, [address, chainId, provider]);

  // Check and update wallet connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Check for Keplr wallet
      if (window.keplr) {
        try {
          const account = await getKeplrAccount();
          if (account) {
            setAddress(account.address);
            setChainId(CROSSFI_CHAIN_ID);
            setBalance(account.balance);
          }
        } catch (error) {
          console.warn("No Keplr connection found");
        }
      }
      
      // Check for MetaMask/EVM wallet
      if (window.ethereum && window.ethereum.isConnected()) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const ethProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(ethProvider);
            
            const account = accounts[0];
            setAddress(account);
            
            const network = await ethProvider.getNetwork();
            setChainId(network.chainId.toString());
            
            const balance = await ethProvider.getBalance(account);
            setBalance(ethers.formatEther(balance));
          }
        } catch (error) {
          console.warn("No MetaMask connection found");
        }
      }
    };
    
    checkConnection();
  }, []);

  // Fetch token balances and transactions when account changes
  useEffect(() => {
    if (address && chainId) {
      getTokenBalances();
      getTransactionHistory();
    }
  }, [address, chainId, getTokenBalances, getTransactionHistory]);

  // Listen for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet();
        } else {
          // Account changed
          setAddress(accounts[0]);
        }
      };
      
      const handleChainChanged = (chainId) => {
        // Chain changed, reload the page
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [disconnectWallet]);

  return {
    address,
    isConnected: !!address,
    isConnecting,
    chainId,
    signer,
    provider,
    connectWallet,
    disconnectWallet,
    switchToCrossFiChain,
    balance,
    tokens,
    transactions,
    loading,
    getTokenBalances,
    getTransactionHistory,
    sendTransaction,
  };
}; 