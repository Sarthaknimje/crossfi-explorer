import React from 'react';
import { DeveloperAPI } from '../components/DeveloperAPI';
import Layout from '../components/Layout';

const DeveloperPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Developer API</h1>
        <DeveloperAPI />
      </div>
    </Layout>
  );
};

export default DeveloperPage; 