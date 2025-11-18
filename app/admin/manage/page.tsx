'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function ManageAdminPage() {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const allItems = useLiveQuery(() => db.items.toArray()) || [];
  
  const adminItems = useMemo(() => 
    allItems.filter(item => item.isAdminAdded),
    [allItems]
  );
  
  const filteredItems = useMemo(() => 
    selectedCity === 'all' 
      ? adminItems 
      : adminItems.filter(item => item.city === selectedCity),
    [adminItems, selectedCity]
  );
  
  const cities = useMemo(() => 
    Array.from(new Set(adminItems.map(item => item.city))).sort(),
    [adminItems]
  );
  
  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    
    try {
      await db.items.delete(itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-blue-500 hover:text-blue-600">
              ← Back to Admin
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">📋 Manage Custom Entries</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-medium text-gray-700">Filter by City:</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Cities ({adminItems.length})</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city} ({adminItems.filter(i => i.city === city).length})
              </option>
            ))}
          </select>
        </div>
        
        {/* Items List */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No custom entries found.</p>
            <Link
              href="/admin"
              className="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Your First Entry
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 border border-amber-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        ✏️ Custom
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                      <div>
                        <span className="font-medium">City:</span> {item.city}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>{' '}
                        {item.category === 'places' ? '🏛️ Places' : 
                         item.category === 'shopping' ? '🛍️ Shopping' : 
                         '🍽️ Food'}
                      </div>
                    </div>
                    
                    {item.details && (
                      <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                    )}
                    
                    {item.location && (
                      <a
                        href={item.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        📍 View on Map
                      </a>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
