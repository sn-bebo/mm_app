'use client';

import { useState } from 'react';
import { TravelItem, CategoryType, StatusType } from '@/types';
import StarRating from './StarRating';
import PriorityBadge from './PriorityBadge';
import UserNotes from './UserNotes';
import { useAppStore } from '@/stores/appStore';
import { db } from '@/lib/db';

interface ItemCardProps {
  item: TravelItem;
  onUpdate: (updates: Partial<TravelItem>) => void;
  onDelete?: () => void;
  isExpanded?: boolean;
}

export default function ItemCard({ item, onUpdate, onDelete, isExpanded: initialExpanded = false }: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isAdminMode = useAppStore((state) => state.isAdminMode);
  
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
  
  const searchOnMaps = () => {
    // Create Google Maps search URL with item name and city
    const searchQuery = encodeURIComponent(`${item.name}, ${item.city}`);
    const searchUrl = `https://www.google.com/maps/search/${searchQuery}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };
  
  const handleEditLocation = () => {
    setLocationInput(item.location || '');
    setIsEditingLocation(true);
  };
  
  const handleSaveLocation = () => {
    if (locationInput.trim()) {
      onUpdate({ location: locationInput.trim() });
      setIsEditingLocation(false);
      setLocationInput('');
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditingLocation(false);
    setLocationInput('');
  };
  
  const handleEditItem = () => {
    setNameInput(item.name);
    setDetailsInput(item.details);
    setIsEditingItem(true);
  };
  
  const handleSaveItem = () => {
    if (nameInput.trim()) {
      onUpdate({ 
        name: nameInput.trim(),
        details: detailsInput.trim()
      });
      setIsEditingItem(false);
      setNameInput('');
      setDetailsInput('');
    }
  };
  
  const handleCancelItemEdit = () => {
    setIsEditingItem(false);
    setNameInput('');
    setDetailsInput('');
  };
  
  const handleDelete = async () => {
    if (onDelete) {
      await db.items.delete(item.id);
      onDelete();
    }
    setShowDeleteConfirm(false);
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
            {!isEditingItem ? (
              <>
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
                  <button
                    onClick={handleEditItem}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Edit name and details"
                  >
                    ✏️
                  </button>
                </div>
                
                {item.details && (
                  <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                    {item.details}
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Details/Notes
                  </label>
                  <textarea
                    value={detailsInput}
                    onChange={(e) => setDetailsInput(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveItem}
                    disabled={!nameInput.trim()}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                      nameInput.trim()
                        ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={handleCancelItemEdit}
                    className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
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
        <div className="space-y-2">
          {!isEditingLocation ? (
            <>
              <div className="flex gap-2">
                {item.location ? (
                  <>
                    <button
                      onClick={openLocation}
                      className="flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                      title="Open location in Google Maps"
                    >
                      <span>🗺️</span>
                      <span>View on Map</span>
                    </button>
                    <button
                      onClick={handleEditLocation}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Edit location URL"
                    >
                      ✏️
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={searchOnMaps}
                      className="flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 bg-orange-500 dark:bg-orange-600 text-white hover:bg-orange-600 dark:hover:bg-orange-700"
                      title="Search this place on Google Maps"
                    >
                      <span>🔍</span>
                      <span>Search on Maps</span>
                    </button>
                    <button
                      onClick={handleEditLocation}
                      className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                      title="Add location URL"
                    >
                      ➕ Add
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {isExpanded ? '▲ Less' : '▼ Notes'}
                </button>
              </div>
              
              {!item.location && (
                <div className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>No location set - Click "Search on Maps" to find it, then "Add" to save the URL</span>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    📍 Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={searchOnMaps}
                  className="flex-1 px-3 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors text-sm flex items-center justify-center gap-1"
                >
                  <span>🔍</span>
                  <span>Search First</span>
                </button>
                <button
                  onClick={handleSaveLocation}
                  disabled={!locationInput.trim()}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    locationInput.trim()
                      ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  💾 Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 Tip: Click "Search First" to find the location, then copy the URL from your browser and paste it above
              </p>
            </div>
          )}
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
          
          {/* Delete Button (Admin Mode Only) */}
          {isAdminMode && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  🗑️ Delete Item
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    ⚠️ Are you sure you want to delete "{item.name}"?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm font-medium"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
