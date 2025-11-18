import { create } from 'zustand';
import { FilterState, ThemeType, SortType, CategoryType } from '@/types';

interface AppState {
  // Theme
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  
  // Current view
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  
  selectedCategory: CategoryType | null;
  setSelectedCategory: (category: CategoryType | null) => void;
  
  // Filters
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // Sort
  sortBy: SortType;
  setSortBy: (sort: SortType) => void;
  
  // Admin mode
  isAdminMode: boolean;
  setAdminMode: (isAdmin: boolean) => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Offline detection
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
}

const defaultFilters: FilterState = {
  search: '',
  priority: 'all',
  status: 'all',
  category: 'all',
};

export const useAppStore = create<AppState>((set) => ({
  theme: 'auto',
  setTheme: (theme) => set({ theme }),
  
  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city }),
  
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  filters: defaultFilters,
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  resetFilters: () => set({ filters: defaultFilters }),
  
  sortBy: 'manual',
  setSortBy: (sort) => set({ sortBy: sort }),
  
  isAdminMode: false,
  setAdminMode: (isAdmin) => set({ isAdminMode: isAdmin }),
  
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  isOffline: false,
  setOffline: (offline) => set({ isOffline: offline }),
}));
