'use client';

import { useState } from 'react';
import { TravelItem, CategoryType, StatusType } from '@/types';
import StarRating from './StarRating';
import PriorityBadge from './PriorityBadge';
import UserNotes from './UserNotes';

interface ItemCardProps {
  item: TravelItem;
  onUpdate: (updates: Partial<TravelItem>) => void;
  isExpanded?: boolean;
}

export default function ItemCard({ item, onUpdate, isExpanded: initialExpanded = false }: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  
  const isCompleted = ['visited', 'purchased', 'tasted'].includes(item.status);
  
  const getStatusLabel = (category: CategoryType, status: StatusType) => {
    if (status === 'pending') return 'Not Yet';
    if (category === 'places') return 'Visited';
    if (category === 'shopping') return 'Purchased';
    if (category === 'food') return 'Tasted';
    return status;
  };
  
  const toggleStatus = () => {
    if (item.status === 'pending') {
      // Mark as completed based on category
      if (item.category === 'places') onUpdate({ status: 'visited' });
      else if (item.category === 'shopping') onUpdate({ status: 'purchased' });
      else if (item.category === 'food') onUpdate({ status: 'tasted' });
    } else {
      // Mark as pending
      onUpdate({ status: 'pending' });
    }
  };
  
  const openLocation = () => {
    if (item.location) {
      window.open(item.location, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow border-2 transition-all ${
        isCompleted 
          ? 'border-green-200 dark:border-green-800 opacity-75' 
          : item.priority === 'must' 
            ? 'border-red-200 dark:border-red-800' 
            : item.priority === 'optional'
              ? 'border-blue-200 dark:border-blue-800'
              : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <h3 className={`text-lg font-bold ${isCompleted ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                {item.name}
              </h3>
              {item.subcategory && (
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded whitespace-nowrap capitalize">
                  {item.subcategory}
                </span>
              )}
              {item.isAdminAdded && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded whitespace-nowrap" title="Added via Admin Panel">
                  ✏️ Custom
                </span>
              )}
            </div>
            
            {item.details && (
              <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                {item.details}
              </p>
            )}
          </div>
          
          {/* Status Toggle */}
          <button
            onClick={toggleStatus}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
              isCompleted
                ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted ? '✓' : '○'}
          </button>
        </div>
        
        {/* Status Label and Priority */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isCompleted 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {getStatusLabel(item.category, item.status)}
          </span>
          
          <PriorityBadge
            priority={item.priority}
            onChange={(priority) => onUpdate({ priority })}
            readonly={false}
          />
        </div>
        
        {/* Star Rating */}
        <div className="mb-3">
          <StarRating
            rating={item.rating}
            onChange={(rating) => onUpdate({ rating: rating as any })}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={openLocation}
            disabled={!item.location}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              item.location
                ? 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
            }`}
            title={item.location || 'No location set'}
          >
            <span>📍</span>
            <span>{item.location ? 'View on Map' : 'No Location'}</span>
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isExpanded ? '▲ Less' : '▼ Notes'}
          </button>
        </div>
      </div>
      
      {/* Expandable Notes Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          <UserNotes
            notes={item.userNotes}
            onChange={(userNotes) => onUpdate({ userNotes })}
          />
          
          {/* Metadata */}
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <p>Last updated: {new Date(item.updatedAt).toLocaleDateString()}</p>
            {item.isAdminAdded && <p className="text-blue-600 dark:text-blue-400">✨ Added by admin</p>}
          </div>
        </div>
      )}
    </div>
  );
}
