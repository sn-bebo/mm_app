'use client';

import { useState } from 'react';
import { db } from '@/lib/db';

export default function ExportToExcel() {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setMessage('');
    
    try {
      // Get all items from IndexedDB
      const allItems = await db.items.toArray();
      
      // Send to API
      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: allItems }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ Success! Exported ${result.itemCount} items to Excel file.`);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
      
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
        💾 Export to Excel
      </h3>
      <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
        Save all your changes back to the MM_data.xlsx file. This will overwrite the existing Excel file.
      </p>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
          isExporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isExporting ? '⏳ Exporting...' : '📥 Export to Excel'}
      </button>
      
      {message && (
        <p className={`mt-3 text-sm ${
          message.startsWith('✅') 
            ? 'text-green-700 dark:text-green-400' 
            : 'text-red-700 dark:text-red-400'
        }`}>
          {message}
        </p>
      )}
      
      <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
        ⚠️ Note: This only works locally. On Vercel, the file system is read-only.
      </p>
    </div>
  );
}
