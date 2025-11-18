'use client';

import { SortType, PriorityType, StatusType } from '@/types';

interface ActiveFiltersProps {
  sortBy: SortType;
  filterPriority: PriorityType | 'all';
  filterStatus: StatusType | 'all';
  searchQuery: string;
  onRemoveSort: () => void;
  onRemovePriority: () => void;
  onRemoveStatus: () => void;
  onRemoveSearch: () => void;
}

export default function ActiveFilters({
  sortBy,
  filterPriority,
  filterStatus,
  searchQuery,
  onRemoveSort,
  onRemovePriority,
  onRemoveStatus,
  onRemoveSearch,
}: ActiveFiltersProps) {
  const hasActiveFilters = 
    sortBy !== 'manual' || 
    filterPriority !== 'all' || 
    filterStatus !== 'all' || 
    searchQuery;
  
  if (!hasActiveFilters) return null;
  
  const getSortLabel = (sort: SortType) => {
    switch (sort) {
      case 'name': return 'Sort: A-Z';
      case 'rating': return 'Sort: Rating';
      case 'priority': return 'Sort: Priority';
      default: return null;
    }
  };
  
  const getPriorityLabel = (priority: PriorityType | 'all') => {
    if (priority === 'must') return '⭐ Must';
    if (priority === 'optional') return '💡 Optional';
    return null;
  };
  
  const getStatusLabel = (status: StatusType | 'all') => {
    if (status === 'pending') return 'Pending';
    if (['visited', 'purchased', 'tasted'].includes(status)) return 'Completed';
    return null;
  };
  
  return (
    <div className="bg-blue-50 border-b border-blue-100 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          
          {searchQuery && (
            <button
              onClick={onRemoveSearch}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm border border-gray-300 hover:bg-gray-50"
            >
              <span>🔍 "{searchQuery}"</span>
              <span className="text-gray-400 hover:text-gray-600">✕</span>
            </button>
          )}
          
          {sortBy !== 'manual' && getSortLabel(sortBy) && (
            <button
              onClick={onRemoveSort}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm border border-gray-300 hover:bg-gray-50"
            >
              <span>{getSortLabel(sortBy)}</span>
              <span className="text-gray-400 hover:text-gray-600">✕</span>
            </button>
          )}
          
          {filterPriority !== 'all' && getPriorityLabel(filterPriority) && (
            <button
              onClick={onRemovePriority}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm border border-gray-300 hover:bg-gray-50"
            >
              <span>{getPriorityLabel(filterPriority)}</span>
              <span className="text-gray-400 hover:text-gray-600">✕</span>
            </button>
          )}
          
          {filterStatus !== 'all' && getStatusLabel(filterStatus) && (
            <button
              onClick={onRemoveStatus}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm border border-gray-300 hover:bg-gray-50"
            >
              <span>{getStatusLabel(filterStatus)}</span>
              <span className="text-gray-400 hover:text-gray-600">✕</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
