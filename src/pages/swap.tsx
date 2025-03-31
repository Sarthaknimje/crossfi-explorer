import { useState, useEffect } from 'react';
import { FaExchangeAlt, FaArrowDown, FaCog, FaWallet, FaInfoCircle } from 'react-icons/fa';
import { useWallet } from '@/hooks/useWallet';
import { useBlockchain } from '@/hooks/useBlockchain';
import { toast } from 'react-toastify';

export default function Swap() {
  const { isConnected, connectWallet, address } = useWallet();
  const { popularTokens } = useBlockchain();
  
  const [fromToken, setFromToken] = useState(popularTokens[0]);
  const [toToken, setToToken] = useState(popularTokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate exchange rate when tokens change
  useEffect(() => {
    // Simple mock exchange rate calculation
    if (fromToken && toToken && fromToken.price && toToken.price) {
      const rate = parseFloat(fromToken.price) / parseFloat(toToken.price);
      setExchangeRate(rate);
    }
  }, [fromToken, toToken]);

  // Calculate to amount when from amount changes
  useEffect(() => {
    if (fromAmount && exchangeRate) {
      const calculatedToAmount = parseFloat(fromAmount) * exchangeRate;
      setToAmount(calculatedToAmount.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);

  // Swap tokens
  const swapTokensPosition = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setToAmount('');
  };

  // Handle swap
  const handleSwap = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    toast.success(`Swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`);
  };

  // Format currency with 6 decimal places max
  const formatCurrency = (value: string | number) => {
    if (!value) return '';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <section className="bg-gradient-to-r from-crossfi-primary to-crossfi-accent text-white p-8 rounded-xl text-center">
        <h1 className="text-3xl font-bold mb-4">CrossFi Swap</h1>
        <p className="text-lg">
          Swap tokens easily on the CrossFi blockchain
        </p>
      </section>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Swap Tokens</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-md bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700 transition-colors"
          >
            <FaCog />
          </button>
        </div>

        {showSettings && (
          <div className="bg-gray-50 dark:bg-secondary-800 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium mb-3">Transaction Settings</h3>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Slippage Tolerance
              </label>
              <div className="flex space-x-2">
                {[0.1, 0.5, 1.0].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      slippage === value
                        ? 'bg-crossfi-primary text-white'
                        : 'bg-gray-200 dark:bg-secondary-700 text-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {value}%
                  </button>
                ))}
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    className="input py-1 text-sm w-full pr-8"
                    step="0.1"
                    min="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* From Token */}
        <div className="bg-gray-50 dark:bg-secondary-800 rounded-lg p-4 mb-2">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">From</label>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Balance: {formatCurrency(10.5)} {fromToken.symbol}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                className="input text-2xl pr-20"
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-crossfi-primary text-white px-2 py-1 rounded"
                onClick={() => setFromAmount('10.5')} // Mock max amount
              >
                MAX
              </button>
            </div>

            <div className="relative w-1/3">
              <select
                value={fromToken.symbol}
                onChange={(e) => {
                  const selected = popularTokens.find(t => t.symbol === e.target.value);
                  if (selected) setFromToken(selected);
                }}
                className="input appearance-none pr-10 py-3 w-full"
              >
                {popularTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaArrowDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={swapTokensPosition}
            className="bg-white dark:bg-secondary-900 border border-gray-200 dark:border-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-secondary-800 transition-colors"
          >
            <FaExchangeAlt className="text-crossfi-primary" />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-gray-50 dark:bg-secondary-800 rounded-lg p-4 mt-2 mb-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">To</label>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Balance: {formatCurrency(25)} {toToken.symbol}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0.0"
                className="input text-2xl"
                readOnly
              />
            </div>

            <div className="relative w-1/3">
              <select
                value={toToken.symbol}
                onChange={(e) => {
                  const selected = popularTokens.find(t => t.symbol === e.target.value);
                  if (selected) setToToken(selected);
                }}
                className="input appearance-none pr-10 py-3 w-full"
              >
                {popularTokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaArrowDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Rate and Slippage */}
        {fromAmount && toAmount && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex justify-between mb-1">
              <span>Rate</span>
              <span>1 {fromToken.symbol} = {formatCurrency(exchangeRate)} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span>Minimum Received</span>
              <span>
                {formatCurrency(parseFloat(toAmount) * (1 - slippage / 100))} {toToken.symbol}
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        {isConnected ? (
          <button
            onClick={handleSwap}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!fromAmount || parseFloat(fromAmount) <= 0 ? 'Enter an amount' : 'Swap'}
          </button>
        ) : (
          <button
            onClick={connectWallet}
            className="btn-primary w-full py-4 text-lg"
          >
            <FaWallet className="inline-block mr-2" /> Connect Wallet
          </button>
        )}

        {/* Disclaimer */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-start">
          <FaInfoCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            Swaps on CrossFi are executed at the best possible price. There may be price impact due to the size of your trade and liquidity depth.
          </div>
        </div>
      </div>
    </div>
  );
} 