import Dexie, { Table } from 'dexie';
import { TravelItem, AppSettings } from '@/types';

/**
 * IndexedDB database class using Dexie
 */
export class TravelDatabase extends Dexie {
  items!: Table<TravelItem, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('TravelAppDB');
    
    // Define database schema
    this.version(1).stores({
      items: 'id, city, category, subcategory, status, priority, rating, sortOrder, isAdminAdded, updatedAt',
      settings: 'id'
    });
    
    // Version 2: Add isPinned field
    this.version(2).stores({
      items: 'id, city, category, subcategory, status, priority, rating, sortOrder, isAdminAdded, isPinned, updatedAt',
      settings: 'id'
    }).upgrade(tx => {
      // Add isPinned = false to all existing items
      return tx.table('items').toCollection().modify(item => {
        item.isPinned = false;
      });
    });
  }
}

// Create database instance
export const db = new TravelDatabase();

/**
 * Initialize default settings if they don't exist
 */
export async function initializeSettings(): Promise<void> {
  const existingSettings = await db.settings.get('app-settings');
  
  if (!existingSettings) {
    const defaultSettings: AppSettings = {
      id: 'app-settings',
      adminPIN: '1234',
      theme: 'auto',
      lastSync: new Date(),
      sortPreference: {
        places: 'manual',
        shopping: 'manual',
        food: 'manual'
      }
    };
    
    await db.settings.add(defaultSettings);
  }
}

/**
 * Get application settings
 */
export async function getSettings(): Promise<AppSettings> {
  const settings = await db.settings.get('app-settings');
  if (!settings) {
    await initializeSettings();
    return (await db.settings.get('app-settings'))!;
  }
  return settings;
}

/**
 * Update application settings
 */
export async function updateSettings(updates: Partial<Omit<AppSettings, 'id'>>): Promise<void> {
  await db.settings.update('app-settings', updates);
}

/**
 * Get all items for a specific city
 */
export async function getItemsByCity(city: string): Promise<TravelItem[]> {
  return await db.items.where('city').equals(city).toArray();
}

/**
 * Get all unique cities
 */
export async function getCities(): Promise<string[]> {
  const items = await db.items.toArray();
  const cities = [...new Set(items.map(item => item.city))];
  return cities.sort();
}

/**
 * Get items by city and category
 */
export async function getItemsByCityAndCategory(
  city: string, 
  category: string
): Promise<TravelItem[]> {
  return await db.items
    .where('[city+category]')
    .equals([city, category])
    .sortBy('sortOrder');
}

/**
 * Add a new travel item
 */
export async function addItem(item: TravelItem): Promise<string> {
  return await db.items.add(item);
}

/**
 * Update a travel item
 */
export async function updateItem(id: string, updates: Partial<TravelItem>): Promise<void> {
  await db.items.update(id, {
    ...updates,
    updatedAt: new Date()
  });
}

/**
 * Delete a travel item
 */
export async function deleteItem(id: string): Promise<void> {
  await db.items.delete(id);
}

/**
 * Clear all items (for re-sync)
 */
export async function clearAllItems(): Promise<void> {
  await db.items.clear();
}

/**
 * Get total item count
 */
export async function getItemCount(): Promise<number> {
  return await db.items.count();
}
