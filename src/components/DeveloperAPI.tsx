import React, { useState } from 'react';
import { useBlockchain } from '../hooks/useBlockchain';

interface Endpoint {
  name: string;
  method: string;
  path: string;
  description: string;
  parameters?: { name: string; type: string; description: string }[];
  response: { type: string; description: string };
}

const endpoints: Endpoint[] = [
  {
    name: 'Get Token Metrics',
    method: 'GET',
    path: '/api/v1/metrics/token/{address}',
    description: 'Retrieve real-time metrics for a specific token',
    parameters: [
      { name: 'address', type: 'string', description: 'Token contract address' },
      { name: 'timeframe', type: 'string', description: 'Time range for metrics (1h, 24h, 7d, 30d)' }
    ],
    response: {
      type: 'object',
      description: 'Token metrics including price, volume, and transaction count'
    }
  },
  {
    name: 'Get Transaction History',
    method: 'GET',
    path: '/api/v1/transactions/{address}',
    description: 'Get transaction history for an address',
    parameters: [
      { name: 'address', type: 'string', description: 'Wallet or contract address' },
      { name: 'page', type: 'number', description: 'Page number for pagination' },
      { name: 'limit', type: 'number', description: 'Number of transactions per page' }
    ],
    response: {
      type: 'array',
      description: 'List of transactions with details'
    }
  },
  {
    name: 'Get Token Holders',
    method: 'GET',
    path: '/api/v1/tokens/{address}/holders',
    description: 'Get list of token holders and their balances',
    parameters: [
      { name: 'address', type: 'string', description: 'Token contract address' },
      { name: 'minBalance', type: 'number', description: 'Minimum balance to include' }
    ],
    response: {
      type: 'array',
      description: 'List of holders with their balances'
    }
  }
];

export const DeveloperAPI: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [apiKey, setApiKey] = useState('');
  const { getApiKey } = useBlockchain();

  const handleGetApiKey = async () => {
    try {
      const key = await getApiKey();
      setApiKey(key);
    } catch (error) {
      console.error('Error getting API key:', error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Developer API</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">API Key</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={apiKey}
            readOnly
            className="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Your API key will appear here"
          />
          <button
            onClick={handleGetApiKey}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Get API Key
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Endpoints</h3>
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.path}
              className={`p-4 rounded cursor-pointer ${
                selectedEndpoint?.path === endpoint.path
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              onClick={() => setSelectedEndpoint(endpoint)}
            >
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {endpoint.method}
                </span>
                <span className="font-mono text-sm">{endpoint.path}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{endpoint.description}</p>
            </div>
          ))}
        </div>

        {selectedEndpoint && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {selectedEndpoint.name}
            </h3>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Parameters</h4>
              {selectedEndpoint.parameters?.map((param) => (
                <div key={param.name} className="mt-2">
                  <code className="text-sm font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                    {param.name}: {param.type}
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{param.description}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Response</h4>
              <div className="mt-2">
                <code className="text-sm font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  {selectedEndpoint.response.type}
                </code>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {selectedEndpoint.response.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 