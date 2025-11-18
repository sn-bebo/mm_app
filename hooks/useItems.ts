'use client';

import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getCities, getItemsByCity, updateItem } from '@/lib/db';
import { syncDataFromExcel, needsInitialSync } from '@/lib/data-sync';
import { TravelItem, CitySummary, CategoryType } from '@/types';

/**
 * Hook to get all cities with summary data
 */
export function useCities() {
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const items = useLiveQuery(() => db.items.toArray());
  
  useEffect(() => {
    async function loadCities() {
      const cityList = await getCities();
      setCities(cityList);
      setIsLoading(false);
    }
    loadCities();
  }, [items]);
  
  return { cities, isLoading };
}

/**
 * Hook to get city summary with counts
 */
export function useCitySummaries(): CitySummary[] {
  const items = useLiveQuery(() => db.items.toArray()) || [];
  
  const summaries: CitySummary[] = [];
  const cityMap = new Map<string, TravelItem[]>();
  
  // Group items by city
  items.forEach(item => {
    if (!cityMap.has(item.city)) {
      cityMap.set(item.city, []);
    }
    cityMap.get(item.city)!.push(item);
  });
  
  // Create summaries
  cityMap.forEach((cityItems, city) => {
    const totalItems = cityItems.length;
    const completedItems = cityItems.filter(
      item => ['visited', 'purchased', 'tasted'].includes(item.status)
    ).length;
    
    const categoryCounts = {
      places: cityItems.filter(item => item.category === 'places').length,
      shopping: cityItems.filter(item => item.category === 'shopping').length,
      food: cityItems.filter(item => item.category === 'food').length,
    };
    
    summaries.push({
      city,
      totalItems,
      completedItems,
      categoryCounts,
    });
  });
  
  return summaries.sort((a, b) => a.city.localeCompare(b.city));
}

/**
 * Hook to get items for a specific city and category
 */
export function useItems(city: string, category?: CategoryType) {
  const query = category
    ? () => db.items.where({ city, category }).sortBy('sortOrder')
    : () => db.items.where({ city }).sortBy('sortOrder');
  
  const items = useLiveQuery(query) || [];
  
  return { items };
}

/**
 * Hook to update an item
 */
export function useUpdateItem() {
  return async (id: string, updates: Partial<TravelItem>) => {
    await updateItem(id, updates);
  };
}

/**
 * Hook to manage initial data sync
 */
export function useDataSync() {
  const [syncStatus, setSyncStatus] = useState<{
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });
  
  useEffect(() => {
    let isCancelled = false;
    
    async function initializeData() {
      try {
        const needsSync = await needsInitialSync();
        
        if (isCancelled) return;
        
        if (needsSync) {
          const result = await syncDataFromExcel();
          
          if (isCancelled) return;
          
          if (result.success) {
            setSyncStatus({
              isInitialized: true,
              isLoading: false,
              error: null,
            });
          } else {
            setSyncStatus({
              isInitialized: false,
              isLoading: false,
              error: result.error || 'Failed to sync data',
            });
          }
        } else {
          setSyncStatus({
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isCancelled) return;
        
        setSyncStatus({
          isInitialized: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    initializeData();
    
    return () => {
      isCancelled = true;
    };
  }, []);
  
  return syncStatus;
}

/**
 * Hook to detect offline status
 */
export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  
  useEffect(() => {
    setIsOffline(!navigator.onLine);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOffline;
}
