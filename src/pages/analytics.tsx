import React from 'react';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import Layout from '../components/Layout';

const AnalyticsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <AnalyticsDashboard />
      </div>
    </Layout>
  );
};

export default AnalyticsPage; 