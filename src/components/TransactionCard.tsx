import React from 'react';
import Link from 'next/link';
import { FaExchangeAlt, FaClock, FaCheckCircle, FaTimesCircle, FaEthereum } from 'react-icons/fa';

interface TransactionCardProps {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp?: number;
  status?: 'success' | 'failed' | 'pending';
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number | string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  hash,
  from,
  to,
  value,
  timestamp,
  status = 'success',
  gasUsed,
  gasPrice,
  blockNumber,
}) => {
  // Format the timestamp to a readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Truncate hash for display
  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  // Format value to XFI with 4 decimal places
  const formatValue = (value: string) => {
    // Convert from wei to XFI (18 decimals)
    const xfiValue = parseFloat(value) / 1e18;
    return xfiValue.toFixed(4);
  };

  // Status indicator color and icon
  const getStatusIndicator = () => {
    switch (status) {
      case 'success':
        return {
          color: 'text-green-500',
          background: 'bg-green-100 dark:bg-green-900',
          icon: <FaCheckCircle className="mr-1" />,
          text: 'Success',
        };
      case 'failed':
        return {
          color: 'text-red-500',
          background: 'bg-red-100 dark:bg-red-900',
          icon: <FaTimesCircle className="mr-1" />,
          text: 'Failed',
        };
      case 'pending':
        return {
          color: 'text-yellow-500',
          background: 'bg-yellow-100 dark:bg-yellow-900',
          icon: <FaClock className="mr-1" />,
          text: 'Pending',
        };
      default:
        return {
          color: 'text-green-500',
          background: 'bg-green-100 dark:bg-green-900',
          icon: <FaCheckCircle className="mr-1" />,
          text: 'Success',
        };
    }
  };

  const statusIndicator = getStatusIndicator();

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-3 mr-3">
            <FaExchangeAlt className="text-crossfi-primary" size={18} />
          </div>
          <div>
            <Link href={`/tx/${hash}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-crossfi-primary">
              Transaction
            </Link>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span className={`px-2 py-0.5 rounded-full ${statusIndicator.background} ${statusIndicator.color} flex items-center text-xs font-medium mr-2`}>
                {statusIndicator.icon} {statusIndicator.text}
              </span>
              {timestamp && (
                <span className="flex items-center">
                  <FaClock className="mr-1" size={12} />
                  {formatDate(timestamp)}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/tx/${hash}`} className="text-crossfi-primary text-sm hover:underline">
          View Details
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hash</div>
          <Link href={`/tx/${hash}`} className="text-sm text-crossfi-primary hover:underline break-all">
            {truncateHash(hash)}
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">From</div>
            <Link href={`/address/${from}`} className="text-sm text-crossfi-primary hover:underline">
              {truncateHash(from)}
            </Link>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">To</div>
            <Link href={`/address/${to}`} className="text-sm text-crossfi-primary hover:underline">
              {truncateHash(to)}
            </Link>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mr-2">Value</div>
          <div className="text-sm font-medium flex items-center">
            <FaEthereum className="mr-1 text-crossfi-primary" />
            {formatValue(value)} XFI
          </div>
        </div>
      </div>

      {(blockNumber || gasUsed || gasPrice) && (
        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {blockNumber && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Block</div>
              <Link href={`/block/${blockNumber}`} className="text-sm text-crossfi-primary hover:underline">
                #{blockNumber}
              </Link>
            </div>
          )}
          
          {gasUsed && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Gas Used</div>
              <div className="text-sm">{gasUsed}</div>
            </div>
          )}
          
          {gasPrice && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Gas Price</div>
              <div className="text-sm">{gasPrice} Gwei</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionCard; 