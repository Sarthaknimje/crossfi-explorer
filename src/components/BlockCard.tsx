import React from 'react';
import Link from 'next/link';
import { FaCube, FaClock, FaList, FaHashtag } from 'react-icons/fa';

interface BlockCardProps {
  blockNumber: string | number;
  timestamp: number;
  transactions: number;
  hash: string;
  gasUsed?: string;
  gasLimit?: string;
  miner?: string;
  block?: any; // For backward compatibility with tests
}

const BlockCard: React.FC<BlockCardProps> = ({
  blockNumber,
  timestamp,
  transactions,
  hash,
  gasUsed,
  gasLimit,
  miner,
  block, // For backward compatibility with tests
}) => {
  // If block prop is provided (test environment), use its properties
  const number = block?.number || blockNumber;
  const time = block?.timestamp || timestamp;
  const txCount = block?.transactions || transactions;
  const blockHash = block?.hash || hash;
  const gas = block?.gasUsed || gasUsed;
  const limit = block?.gasLimit || gasLimit;
  const minerAddress = block?.miner || miner;

  // Format the timestamp to a readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Truncate hash for display
  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  // Format gas values with commas
  const formatGas = (gas: string) => {
    return parseInt(gas).toLocaleString();
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-md" data-testid="block-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-3 mr-3">
            <FaCube className="text-crossfi-primary" size={18} />
          </div>
          <div>
            <Link href={`/block/${number}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-crossfi-primary">
              Block #{number}
            </Link>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              <FaClock className="mr-1" size={12} />
              <span>{formatDate(time)}</span>
            </div>
          </div>
        </div>
        <Link href={`/block/${number}`} className="text-crossfi-primary text-sm hover:underline">
          View Details
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
            <FaHashtag className="mr-1" size={12} />
            <span>Hash</span>
          </div>
          <Link href={`/block/${number}`} className="text-sm text-crossfi-primary hover:underline break-all">
            {truncateHash(blockHash)}
          </Link>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
            <FaList className="mr-1" size={12} />
            <span>Transactions</span>
          </div>
          <Link href={`/block/${number}#transactions`} className="text-sm text-crossfi-primary hover:underline">
            {txCount} transactions
          </Link>
        </div>
      </div>

      {(gas || limit || minerAddress) && (
        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gas && limit && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Gas Used / Limit</div>
              <div className="text-sm">{formatGas(gas)} / {formatGas(limit)}</div>
            </div>
          )}
          
          {gas && !limit && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Gas Used</div>
              <div className="text-sm">{formatGas(gas)}</div>
            </div>
          )}
          
          {!gas && limit && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Gas Limit</div>
              <div className="text-sm">{formatGas(limit)}</div>
            </div>
          )}
          
          {minerAddress && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Miner</div>
              <Link href={`/address/${minerAddress}`} className="text-sm text-crossfi-primary hover:underline">
                {truncateHash(minerAddress)}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockCard; 