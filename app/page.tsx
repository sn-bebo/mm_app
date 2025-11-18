'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCitySummaries, useDataSync, useOffline } from '@/hooks/useItems';
import { useAppStore } from '@/stores/appStore';
import InstallPrompt from '@/components/InstallPrompt';
import Header from '@/components/Header';
import { CityCardSkeleton } from '@/components/LoadingSkeleton';

export default function HomePage() {
  const citySummaries = useCitySummaries();
  const { isInitialized, isLoading, error } = useDataSync();
  const isOffline = useOffline();
  const setOfflineState = useAppStore(state => state.setOffline);
  
  useEffect(() => {
    setOfflineState(isOffline);
  }, [isOffline, setOfflineState]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header title="✈️ Travel Companion" showAdminButton={true} />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Loading cities...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CityCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header title="✈️ Travel Companion" showAdminButton={true} />
      
      {/* Cities Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Offline Indicator */}
        {isOffline && (
          <div className="mb-4 flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Offline Mode - Using cached data
          </div>
        )}
        
        {citySummaries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No cities found. Add data to get started.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Select a City ({citySummaries.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {citySummaries.map((summary) => (
                <Link
                  key={summary.city}
                  href={`/city/${encodeURIComponent(summary.city)}`}
                  className="block"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {summary.city}
                    </h3>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{summary.completedItems} / {summary.totalItems}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 dark:bg-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${summary.totalItems > 0 ? (summary.completedItems / summary.totalItems) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Category Counts */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-2xl mb-1">🏛️</div>
                        <div className="font-semibold text-blue-900 dark:text-blue-300">{summary.categoryCounts.places}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">Places</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="text-2xl mb-1">🛍️</div>
                        <div className="font-semibold text-purple-900 dark:text-purple-300">{summary.categoryCounts.shopping}</div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">Shopping</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="text-2xl mb-1">🍽️</div>
                        <div className="font-semibold text-orange-900 dark:text-orange-300">{summary.categoryCounts.food}</div>
                        <div className="text-xs text-orange-600 dark:text-orange-400">Food</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        
        {/* Admin FAB - Hidden since header has admin button */}
      </main>
      
      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  );
}
