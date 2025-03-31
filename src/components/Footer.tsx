import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaDiscord, FaGithub, FaTelegram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-secondary-900 text-gray-700 dark:text-gray-300 shadow-md">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">CrossFi Explorer</h3>
            <p className="mb-4">
              A comprehensive blockchain explorer for CrossFi, powering the next generation of decentralized finance.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/crossfichain" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-crossfi-primary dark:hover:text-crossfi-primary">
                <FaTwitter size={20} />
              </a>
              <a href="https://discord.com/invite/crossfi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-crossfi-primary dark:hover:text-crossfi-primary">
                <FaDiscord size={20} />
              </a>
              <a href="https://github.com/crossfi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-crossfi-primary dark:hover:text-crossfi-primary">
                <FaGithub size={20} />
              </a>
              <a href="https://t.me/crossfichain" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-crossfi-primary dark:hover:text-crossfi-primary">
                <FaTelegram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explorer" className="hover:text-crossfi-primary">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/tokens" className="hover:text-crossfi-primary">
                  Tokens
                </Link>
              </li>
              <li>
                <Link href="/validators" className="hover:text-crossfi-primary">
                  Validators
                </Link>
              </li>
              <li>
                <a href="https://docs.crossfimain.com/" target="_blank" rel="noopener noreferrer" className="hover:text-crossfi-primary">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Ecosystem</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://crossfi.org/" target="_blank" rel="noopener noreferrer" className="hover:text-crossfi-primary">
                  CrossFi Main
                </a>
              </li>
              <li>
                <a href="https://crossfi.org/blockchain/" target="_blank" rel="noopener noreferrer" className="hover:text-crossfi-primary">
                  CrossFi Chain
                </a>
              </li>
              <li>
                <a href="https://www.alchemy.com/crossfi" target="_blank" rel="noopener noreferrer" className="hover:text-crossfi-primary">
                  Alchemy CrossFi
                </a>
              </li>
              <li>
                <a href="https://bridge.crossfi.org/" target="_blank" rel="noopener noreferrer" className="hover:text-crossfi-primary">
                  CrossFi Bridge
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="hover:text-crossfi-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="https://crossfi.org/contact" target="_blank" rel="noopener noreferrer" className="hover:text-crossfi-primary">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-crossfi-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-crossfi-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CrossFi Explorer. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
            Powered by <a href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer" className="text-crossfi-primary hover:underline">Alchemy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 