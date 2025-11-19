// Core data types for the Travel App

export type CategoryType = 'places' | 'shopping' | 'food';
export type SubcategoryType = string | null;  // Allow any subcategory string
export type StatusType = 'pending' | 'visited' | 'purchased' | 'tasted';
export type PriorityType = 'must' | 'optional' | null;
export type RatingType = 1 | 2 | 3 | 4 | 5 | null;
export type SortType = 'manual' | 'name' | 'rating' | 'status' | 'priority';
export type ThemeType = 'light' | 'dark' | 'auto';

/**
 * Main travel item model
 */
export interface TravelItem {
  id: string;                          // UUID
  city: string;                        // From Column A
  category: CategoryType;              // From Column B
  subcategory?: SubcategoryType;       // Optional: Any subcategory string
  name: string;                        // From Column C
  details: string;                     // From Column D
  location: string;                    // Google Maps URL
  
  // User-generated data
  status: StatusType;                  // User's completion status
  priority: PriorityType;              // User's priority flag
  rating: RatingType;                  // User's star rating
  userNotes: string;                   // User's personal notes
  sortOrder: number;                   // For manual ordering
  isPinned: boolean;                   // Pin to top regardless of status
  
  // Metadata
  isAdminAdded: boolean;               // True if added via admin mode
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Application settings stored in IndexedDB
 */
export interface AppSettings {
  id: 'app-settings';                  // Fixed ID for singleton
  adminPIN: string;                    // PIN for admin mode
  theme: ThemeType;                    // UI theme preference
  lastSync: Date;                      // Last data sync timestamp
  sortPreference: {
    places: SortType;
    shopping: SortType;
    food: SortType;
  };
}

/**
 * Parsed row from Excel file
 */
export interface ExcelRow {
  city: string;                        // Column A
  category: string;                    // Column B
  name: string;                        // Column C
  details: string;                     // Column D
  location?: string;                   // Column E (if exists)
  subcategory?: string;                // Optional subcategory
}

/**
 * Filter state for items
 */
export interface FilterState {
  search: string;
  priority: PriorityType | 'all';
  status: StatusType | 'all';
  category: CategoryType | 'all';
}

/**
 * City summary for home page
 */
export interface CitySummary {
  city: string;
  totalItems: number;
  completedItems: number;
  categoryCounts: {
    places: number;
    shopping: number;
    food: number;
  };
}

/**
 * Admin form data for new entries
 */
export interface AdminFormData {
  city: string;
  category: CategoryType;
  subcategory?: SubcategoryType;
  name: string;
  details: string;
  location: string;
}
