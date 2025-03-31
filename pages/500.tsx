import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Custom500() {
  return (
    <Layout title="500 - Server Error">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-red-500">500</h1>
        <div className="my-4 h-1 w-20 bg-red-500 rounded"></div>
        <h2 className="mb-8 text-2xl font-semibold">Server Error</h2>
        <p className="mb-8 max-w-md">
          We're sorry, but something went wrong on our server. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Go Home
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md max-w-md">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If the problem persists, please contact our support team or check the CrossFi API status.
          </p>
        </div>
      </div>
    </Layout>
  );
} 