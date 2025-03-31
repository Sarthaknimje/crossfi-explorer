import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <Layout title="404 - Page Not Found">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-blue-500">404</h1>
        <div className="my-4 h-1 w-20 bg-blue-500 rounded"></div>
        <h2 className="mb-8 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Go Home
          </Link>
          <Link href="/explorer" className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
            Explore Blockchain
          </Link>
        </div>
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          Redirecting to home in {countdown} seconds...
        </p>
      </div>
    </Layout>
  );
} 