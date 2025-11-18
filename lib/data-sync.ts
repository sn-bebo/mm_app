import { db, getItemCount, clearAllItems, initializeSettings, updateSettings } from './db';
import { parseExcelFile } from './excel-parser';
import { TravelItem } from '@/types';

/**
 * Check if initial data sync is needed
 */
export async function needsInitialSync(): Promise<boolean> {
  const count = await getItemCount();
  return count === 0;
}

/**
 * Sync data from Excel file to IndexedDB
 * This is called on first load or when user manually triggers re-import
 */
export async function syncDataFromExcel(): Promise<{ success: boolean; itemCount: number; error?: string }> {
  try {
    // Double-check to prevent duplicate imports
    const currentCount = await getItemCount();
    if (currentCount > 0) {
      return { success: true, itemCount: currentCount };
    }
    
    // Parse Excel file from public directory
    const excelPath = '/data/MM_data.xlsx';
    const items = await parseExcelFile(excelPath);
    
    if (items.length === 0) {
      return { success: false, itemCount: 0, error: 'No items found in Excel file' };
    }
    
    // Add items to database
    await db.items.bulkAdd(items);
    
    // Initialize settings if needed
    await initializeSettings();
    
    // Update last sync time
    await updateSettings({ lastSync: new Date() });
    
    return { success: true, itemCount: items.length };
  } catch (error) {
    console.error('Error syncing data from Excel:', error);
    return { 
      success: false, 
      itemCount: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Re-import data from Excel while preserving user data
 * Merges base data updates with existing user modifications
 */
export async function reimportData(
  mergeStrategy: 'keep-user-data' | 'replace-all' = 'keep-user-data'
): Promise<{ success: boolean; itemCount: number; error?: string }> {
  try {
    const excelPath = '/data/MM_data.xlsx';
    const newItems = await parseExcelFile(excelPath);
    
    if (mergeStrategy === 'replace-all') {
      // Clear all existing data and import fresh
      await clearAllItems();
      await db.items.bulkAdd(newItems);
      await updateSettings({ lastSync: new Date() });
      return { success: true, itemCount: newItems.length };
    }
    
    // Keep user data strategy
    const existingItems = await db.items.toArray();
    const existingMap = new Map(existingItems.map(item => [
      `${item.city}-${item.category}-${item.name}`, 
      item
    ]));
    
    const mergedItems: TravelItem[] = newItems.map(newItem => {
      const key = `${newItem.city}-${newItem.category}-${newItem.name}`;
      const existing = existingMap.get(key);
      
      if (existing) {
        // Keep user data, update base data
        return {
          ...newItem,
          id: existing.id,
          status: existing.status,
          priority: existing.priority,
          rating: existing.rating,
          userNotes: existing.userNotes,
          sortOrder: existing.sortOrder,
          updatedAt: new Date()
        };
      }
      
      return newItem;
    });
    
    // Clear and re-add all items
    await clearAllItems();
    await db.items.bulkAdd(mergedItems);
    await updateSettings({ lastSync: new Date() });
    
    return { success: true, itemCount: mergedItems.length };
  } catch (error) {
    console.error('Error reimporting data:', error);
    return { 
      success: false, 
      itemCount: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<{
  isInitialized: boolean;
  itemCount: number;
  lastSync: Date | null;
}> {
  const itemCount = await getItemCount();
  const settings = await db.settings.get('app-settings');
  
  return {
    isInitialized: itemCount > 0,
    itemCount,
    lastSync: settings?.lastSync || null
  };
}
