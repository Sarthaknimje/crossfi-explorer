import React, { useEffect, useState } from 'react';
import { useBlockchain } from '../hooks/useBlockchain';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TokenMetrics {
  timestamp: number;
  price: number;
  volume: number;
  transactions: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const { getTokenMetrics } = useBlockchain();
  const [metrics, setMetrics] = useState<TokenMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getTokenMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getTokenMetrics]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Real-time Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Total Volume</h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            ${metrics[metrics.length - 1]?.volume.toLocaleString() || 0}
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-200">Price</h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            ${metrics[metrics.length - 1]?.price.toFixed(2) || 0}
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-200">Transactions</h3>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {metrics[metrics.length - 1]?.transactions.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
              formatter={(value: number, name: string) => [
                name === 'price' ? `$${value.toFixed(2)}` : value.toLocaleString(),
                name.charAt(0).toUpperCase() + name.slice(1)
              ]}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb" 
              name="Price"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="volume" 
              stroke="#16a34a" 
              name="Volume"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="transactions" 
              stroke="#9333ea" 
              name="Transactions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 