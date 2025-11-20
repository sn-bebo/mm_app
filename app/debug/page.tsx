'use client';

import { useState } from 'react';
import Link from 'next/link';
import { db, getItemCount } from '@/lib/db';
import { syncDataFromExcel } from '@/lib/data-sync';

export default function DebugPage() {
  const [itemCount, setItemCount] = useState<number | null>(null);
  const [status, setStatus] = useState('');
  
  const checkCount = async () => {
    const count = await getItemCount();
    setItemCount(count);
    setStatus(`Database has ${count} items`);
  };
  
  const clearDatabase = async () => {
    const confirmed = confirm('Are you sure you want to clear the entire database?');
    if (!confirmed) return;
    
    try {
      await db.delete();
      setStatus('Database deleted! Refresh page to reinitialize.');
      setItemCount(null);
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };
  
  const resyncData = async () => {
    try {
      await db.items.clear();
      const result = await syncDataFromExcel();
      if (result.success) {
        setStatus(`Resynced! Loaded ${result.itemCount} items.`);
        await checkCount();
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">🔧 Debug Panel</h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Database Tools</h2>
            
            <div className="space-y-3">
              <button
                onClick={checkCount}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Check Item Count
              </button>
              
              <button
                onClick={resyncData}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Re-sync from Excel (Clear & Reload)
              </button>
              
              <button
                onClick={clearDatabase}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ Delete Entire Database
              </button>
            </div>
          </div>
          
          {status && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="font-mono text-sm text-gray-900 dark:text-gray-100">{status}</p>
              {itemCount !== null && (
                <p className="font-mono text-sm mt-2 text-gray-900 dark:text-gray-100">Current count: {itemCount}</p>
              )}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white">💡 Tip:</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              If you see duplicate entries, use "Re-sync from Excel" to clear and reload the data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
