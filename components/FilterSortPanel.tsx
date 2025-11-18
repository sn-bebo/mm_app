'use client';

import { useState } from 'react';
import { SortType, PriorityType, StatusType } from '@/types';

interface FilterSortPanelProps {
  // Current values
  sortBy: SortType;
  filterPriority: PriorityType | 'all';
  filterStatus: StatusType | 'all';
  searchQuery: string;
  
  // Callbacks
  onSortChange: (sort: SortType) => void;
  onPriorityFilterChange: (priority: PriorityType | 'all') => void;
  onStatusFilterChange: (status: StatusType | 'all') => void;
  onSearchChange: (search: string) => void;
  onClearAll: () => void;
}

export default function FilterSortPanel({
  sortBy,
  filterPriority,
  filterStatus,
  searchQuery,
  onSortChange,
  onPriorityFilterChange,
  onStatusFilterChange,
  onSearchChange,
  onClearAll,
}: FilterSortPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const activeFiltersCount = 
    (filterPriority !== 'all' ? 1 : 0) +
    (filterStatus !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (sortBy !== 'manual' ? 1 : 0);
  
  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 dark:bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all z-20 flex items-center justify-center"
      >
        <span className="text-2xl relative">
          🔍
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </span>
      </button>
      
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl z-40 transition-transform duration-300 max-h-[80vh] overflow-y-auto ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter & Sort</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🔍 Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or details..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📊 Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSortChange('manual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'manual'
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Manual Order
              </button>
              <button
                onClick={() => onSortChange('name')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'name'
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Name (A-Z)
              </button>
              <button
                onClick={() => onSortChange('rating')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'rating'
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Rating (High)
              </button>
              <button
                onClick={() => onSortChange('priority')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'priority'
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Priority (Must First)
              </button>
            </div>
          </div>
          
          {/* Filter by Priority */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🎯 Priority
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onPriorityFilterChange('all')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterPriority === 'all'
                    ? 'bg-gray-700 dark:bg-gray-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onPriorityFilterChange('must')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterPriority === 'must'
                    ? 'bg-red-500 dark:bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                ⭐ Must
              </button>
              <button
                onClick={() => onPriorityFilterChange('optional')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterPriority === 'optional'
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                💡 Optional
              </button>
            </div>
          </div>
          
          {/* Filter by Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ✓ Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => onStatusFilterChange('all')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-gray-700 dark:bg-gray-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onStatusFilterChange('pending')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-orange-500 dark:bg-orange-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => onStatusFilterChange('visited')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  ['visited', 'purchased', 'tasted'].includes(filterStatus)
                    ? 'bg-green-500 dark:bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
          
          {/* Clear All Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                onClearAll();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 font-medium"
            >
              Clear All Filters ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>
    </>
  );
}
