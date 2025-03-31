import { useState } from 'react';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';
import TokenCard from '@/components/TokenCard';
import { useBlockchain } from '@/hooks/useBlockchain';
import { Token } from '@/hooks/useBlockchain';

type SortField = 'name' | 'price' | 'marketCap' | 'priceChange';
type SortDirection = 'asc' | 'desc';

export default function Tokens() {
  const { popularTokens, isLoading, error } = useBlockchain();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Mock tokens data to demonstrate sorting and filtering
  const [allTokens, setAllTokens] = useState<Token[]>([
    ...popularTokens,
    {
      name: 'CrossFi USDT',
      symbol: 'USDT',
      address: '0x3456789012345678901234567890123456789012',
      price: '1.00',
      priceChange: 0.01,
      totalSupply: '10000000000',
      marketCap: '10000000000',
    },
    {
      name: 'CrossFi USDC',
      symbol: 'USDC',
      address: '0x4567890123456789012345678901234567890123',
      price: '1.00',
      priceChange: 0.02,
      totalSupply: '9500000000',
      marketCap: '9500000000',
    },
    {
      name: 'CrossFi Wrapped ETH',
      symbol: 'WETH',
      address: '0x5678901234567890123456789012345678901234',
      price: '3205.75',
      priceChange: 2.5,
      totalSupply: '200000',
      marketCap: '641150000',
    },
  ]);

  // Filter tokens based on search query
  const filteredTokens = allTokens.filter((token) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  });

  // Sort tokens based on sort field and direction
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortField) {
      case 'name':
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'price':
        return sortDirection === 'asc'
          ? parseFloat(a.price || '0') - parseFloat(b.price || '0')
          : parseFloat(b.price || '0') - parseFloat(a.price || '0');
      case 'marketCap':
        return sortDirection === 'asc'
          ? parseFloat(a.marketCap || '0') - parseFloat(b.marketCap || '0')
          : parseFloat(b.marketCap || '0') - parseFloat(a.marketCap || '0');
      case 'priceChange':
        return sortDirection === 'asc'
          ? (a.priceChange || 0) - (b.priceChange || 0)
          : (b.priceChange || 0) - (a.priceChange || 0);
      default:
        return 0;
    }
  });

  // Toggle sort direction or set new sort field
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Render sort icon based on current sort field and direction
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    
    return sortDirection === 'asc' ? (
      <FaSortUp className="ml-1 text-crossfi-primary" />
    ) : (
      <FaSortDown className="ml-1 text-crossfi-primary" />
    );
  };

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-crossfi-primary to-crossfi-accent text-white p-8 rounded-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">CrossFi Tokens</h1>
          <p className="text-lg mb-6">
            Explore tokens on the CrossFi blockchain, including XFI, MPX, and other assets.
          </p>
        </div>
      </section>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-auto">
          <div className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tokens..."
              className="input pr-10 w-full md:w-80"
            />
            <FaSearch className="absolute right-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm bg-gray-100 dark:bg-secondary-800 px-4 py-2 rounded-md"
          >
            <FaFilter className="mr-2" />
            Filters {showFilters ? '▲' : '▼'}
          </button>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button
              onClick={() => handleSort('name')}
              className={`flex items-center text-sm whitespace-nowrap px-3 py-1.5 rounded-md transition-colors ${
                sortField === 'name'
                  ? 'bg-crossfi-primary text-white'
                  : 'bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700'
              }`}
            >
              Name {renderSortIcon('name')}
            </button>
            <button
              onClick={() => handleSort('price')}
              className={`flex items-center text-sm whitespace-nowrap px-3 py-1.5 rounded-md transition-colors ${
                sortField === 'price'
                  ? 'bg-crossfi-primary text-white'
                  : 'bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700'
              }`}
            >
              Price {renderSortIcon('price')}
            </button>
            <button
              onClick={() => handleSort('marketCap')}
              className={`flex items-center text-sm whitespace-nowrap px-3 py-1.5 rounded-md transition-colors ${
                sortField === 'marketCap'
                  ? 'bg-crossfi-primary text-white'
                  : 'bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700'
              }`}
            >
              Market Cap {renderSortIcon('marketCap')}
            </button>
            <button
              onClick={() => handleSort('priceChange')}
              className={`flex items-center text-sm whitespace-nowrap px-3 py-1.5 rounded-md transition-colors ${
                sortField === 'priceChange'
                  ? 'bg-crossfi-primary text-white'
                  : 'bg-gray-100 dark:bg-secondary-800 hover:bg-gray-200 dark:hover:bg-secondary-700'
              }`}
            >
              24h Change {renderSortIcon('priceChange')}
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 dark:bg-secondary-800 p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Filter Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Token Type</label>
              <select className="input py-1.5 text-sm">
                <option>All Tokens</option>
                <option>Native Tokens</option>
                <option>ERC-20 Tokens</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Price Range</label>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="Min" className="input py-1.5 text-sm" />
                <span>to</span>
                <input type="number" placeholder="Max" className="input py-1.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</label>
              <select className="input py-1.5 text-sm">
                <option>All</option>
                <option>$1M+</option>
                <option>$10M+</option>
                <option>$100M+</option>
                <option>$1B+</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button className="text-sm bg-gray-200 dark:bg-secondary-700 hover:bg-gray-300 dark:hover:bg-secondary-600 px-4 py-1.5 rounded">
              Reset
            </button>
            <button className="text-sm bg-crossfi-primary hover:bg-primary-600 text-white px-4 py-1.5 rounded">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-b-2 border-crossfi-primary rounded-full mx-auto mb-4"></div>
          <p>Loading tokens data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p className="text-lg">Error loading tokens: {error}</p>
          <p className="mt-2">Please try again later or contact support.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedTokens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg">No tokens found matching your search criteria.</p>
            </div>
          ) : (
            sortedTokens.map((token) => (
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
            ))
          )}
        </div>
      )}
    </div>
  );
} 