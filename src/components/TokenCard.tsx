import React from 'react';
import Link from 'next/link';
import { FaCoins, FaExchangeAlt, FaChartLine } from 'react-icons/fa';
import Image from 'next/image';

interface TokenCardProps {
  name: string;
  symbol: string;
  address: string;
  logoUrl?: string;
  price?: string;
  priceChange?: number;
  totalSupply?: string;
  marketCap?: string;
}

const TokenCard: React.FC<TokenCardProps> = ({
  name,
  symbol,
  address,
  logoUrl,
  price,
  priceChange,
  totalSupply,
  marketCap,
}) => {
  // Truncate address for display
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`;
  };

  // Format number with commas
  const formatNumber = (num: string | undefined) => {
    if (!num) return '-';
    return Number(num).toLocaleString();
  };

  // Format price with 4 decimal places
  const formatPrice = (price: string | undefined) => {
    if (!price) return '-';
    return `$${parseFloat(price).toFixed(4)}`;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-2 mr-3 flex items-center justify-center w-12 h-12">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <FaCoins className="text-crossfi-primary" size={24} />
            )}
          </div>
          <div>
            <Link href={`/token/${address}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-crossfi-primary">
              {name} ({symbol})
            </Link>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Link href={`/token/${address}`} className="hover:text-crossfi-primary hover:underline">
                {truncateAddress(address)}
              </Link>
            </div>
          </div>
        </div>
        <Link href={`/token/${address}`} className="text-crossfi-primary text-sm hover:underline">
          View Details
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</div>
          {price ? (
            <div className="text-sm font-medium flex items-center">
              {formatPrice(price)}
              {priceChange !== undefined && (
                <span className={`ml-2 text-xs ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm">-</div>
          )}
        </div>
        
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
          <div className="text-sm">{marketCap ? `$${formatNumber(marketCap)}` : '-'}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Supply</div>
          <div className="text-sm">{formatNumber(totalSupply)}</div>
        </div>

        <div className="flex items-end">
          <Link 
            href={`/swap?outputCurrency=${address}`}
            className="text-sm bg-crossfi-primary text-white px-3 py-1 rounded flex items-center hover:bg-primary-600 transition-colors duration-300"
          >
            <FaExchangeAlt className="mr-1" size={12} />
            Swap
          </Link>
        </div>
      </div>

      {price && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">Price Chart (24h)</div>
            <Link href={`/token/${address}/chart`} className="text-xs text-crossfi-primary hover:underline flex items-center">
              <FaChartLine className="mr-1" size={10} />
              View Full Chart
            </Link>
          </div>
          <div className="h-12 mt-2 bg-gray-100 dark:bg-secondary-800 rounded-md flex items-end">
            {/* Mock chart - in a real app, you'd use a proper charting library */}
            <div className="flex-1 h-full flex items-end px-1">
              {Array(24).fill(0).map((_, i) => {
                const height = Math.max(15, Math.min(100, Math.random() * 100));
                return (
                  <div 
                    key={i} 
                    className="flex-1 mx-0.5 rounded-t" 
                    style={{
                      height: `${height}%`, 
                      backgroundColor: priceChange && priceChange >= 0 ? '#10B981' : '#EF4444'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenCard; 