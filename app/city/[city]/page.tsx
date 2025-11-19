'use client';

import Link from 'next/link';
import { useItems, useUpdateItem } from '@/hooks/useItems';
import { CategoryType, TravelItem, SortType, PriorityType, StatusType } from '@/types';
import { useState, useMemo } from 'react';
import ItemCard from '@/components/ItemCard';
import FilterSortPanel from '@/components/FilterSortPanel';
import ActiveFilters from '@/components/ActiveFilters';
import DraggableItem from '@/components/DraggableItem';
import Header from '@/components/Header';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function CityPage({ params }: { params: { city: string } }) {
  const decodedCity = decodeURIComponent(params.city);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('places');
  
  // Filter and sort state
  const [sortBy, setSortBy] = useState<SortType>('manual');
  const [filterPriority, setFilterPriority] = useState<PriorityType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<StatusType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Subcategory collapse state
  const [collapsedSubcategories, setCollapsedSubcategories] = useState<Set<string>>(new Set());
  const [isRegularItemsCollapsed, setIsRegularItemsCollapsed] = useState(false);
  
  const { items: allItems } = useItems(decodedCity);
  const updateItem = useUpdateItem();
  
  const handleDelete = async (itemId: string) => {
    // Item will be automatically removed from the list due to live query
    // Just need to trigger a re-render if needed
  };
  
  const toggleSubcategoryCollapse = (subcategory: string) => {
    setCollapsedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategory)) {
        newSet.delete(subcategory);
      } else {
        newSet.add(subcategory);
      }
      return newSet;
    });
  };
  
  // Apply global search first (across all categories in this city)
  const searchFilteredItems = useMemo(() => {
    if (!searchQuery) return allItems;
    
    const query = searchQuery.toLowerCase();
    return allItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.details.toLowerCase().includes(query)
    );
  }, [allItems, searchQuery]);
  
  // Filter by category
  const categoryItems = useMemo(() => {
    let filtered = searchFilteredItems.filter(item => item.category === selectedCategory);
    
    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === filterPriority);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        filtered = filtered.filter(item => item.status === 'pending');
      } else {
        // Any completed status
        filtered = filtered.filter(item => ['visited', 'purchased', 'tasted'].includes(item.status));
      }
    }
    
    return filtered;
  }, [searchFilteredItems, selectedCategory, filterPriority, filterStatus]);
  
  // Separate items by subcategory
  const { regularItems, subcategoryGroups } = useMemo(() => {
    const regular = categoryItems.filter(item => !item.subcategory);
    const withSubcategory = categoryItems.filter(item => item.subcategory);
    
    // Group by subcategory
    const groups: Record<string, TravelItem[]> = {};
    withSubcategory.forEach(item => {
      const subcat = item.subcategory!;
      if (!groups[subcat]) {
        groups[subcat] = [];
      }
      groups[subcat].push(item);
    });
    
    return { regularItems: regular, subcategoryGroups: groups };
  }, [categoryItems]);
  
  // Sort items: pinned first, then pending, then completed
  const sortItems = (items: TravelItem[]) => {
    let sorted = [...items];
    
    // Separate pinned and unpinned items
    const pinned = sorted.filter(item => item.isPinned);
    const unpinned = sorted.filter(item => !item.isPinned);
    
    // Sort pinned items
    const sortByType = (itemsToSort: TravelItem[]) => {
      const toSort = [...itemsToSort];
      
      switch (sortBy) {
        case 'name':
          toSort.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          toSort.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'priority':
          toSort.sort((a, b) => {
            const priorityOrder = { must: 3, optional: 2, null: 1 };
            return (priorityOrder[b.priority || 'null'] || 0) - (priorityOrder[a.priority || 'null'] || 0);
          });
          break;
        case 'manual':
        default:
          toSort.sort((a, b) => a.sortOrder - b.sortOrder);
          break;
      }
      
      return toSort;
    };
    
    // Sort both groups
    const sortedPinned = sortByType(pinned);
    const sortedUnpinned = sortByType(unpinned);
    
    // For unpinned items, keep completed items at bottom (unless filtering by status)
    if (filterStatus === 'all') {
      const pending = sortedUnpinned.filter(item => item.status === 'pending');
      const completed = sortedUnpinned.filter(item => item.status !== 'pending');
      // Pinned items stay at top regardless of status
      return [...sortedPinned, ...pending, ...completed];
    }
    
    // If filtering by status, just keep pinned at top
    return [...sortedPinned, ...sortedUnpinned];
  };
  
  const sortedRegularItems = useMemo(() => sortItems(regularItems), [regularItems, sortBy, filterStatus]);
  
  // Sort each subcategory group
  const sortedSubcategoryGroups = useMemo(() => {
    const sorted: Record<string, TravelItem[]> = {};
    Object.keys(subcategoryGroups).forEach(key => {
      sorted[key] = sortItems(subcategoryGroups[key]);
    });
    return sorted;
  }, [subcategoryGroups, sortBy, filterStatus]);
  
  // Category counts (with search applied)
  const categoryCounts = useMemo(() => ({
    places: searchFilteredItems.filter(i => i.category === 'places').length,
    shopping: searchFilteredItems.filter(i => i.category === 'shopping').length,
    food: searchFilteredItems.filter(i => i.category === 'food').length,
  }), [searchFilteredItems]);
  
  // Show total count when searching
  const totalSearchResults = useMemo(() => 
    searchQuery ? searchFilteredItems.length : 0,
  [searchQuery, searchFilteredItems]);
  
  const categoryProgress = useMemo(() => {
    const total = categoryItems.length;
    const completed = categoryItems.filter(item => 
      ['visited', 'purchased', 'tasted'].includes(item.status)
    ).length;
    const withLocation = categoryItems.filter(item => item.location).length;
    const withoutLocation = total - withLocation;
    return { 
      total, 
      completed, 
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      withLocation,
      withoutLocation,
      locationPercentage: total > 0 ? Math.round((withLocation / total) * 100) : 0
    };
  }, [categoryItems]);
  
  const handleUpdate = async (itemId: string, updates: Partial<TravelItem>) => {
    await updateItem(itemId, updates);
  };
  
  const clearAllFilters = () => {
    setSortBy('manual');
    setFilterPriority('all');
    setFilterStatus('all');
    setSearchQuery('');
  };
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms delay for touch to prevent accidental drags
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end for regular items
  const handleDragEndRegular = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = sortedRegularItems.findIndex(item => item.id === active.id);
    const newIndex = sortedRegularItems.findIndex(item => item.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    // Reorder the array
    const reordered = arrayMove(sortedRegularItems, oldIndex, newIndex);
    
    // Update sortOrder for all affected items
    const updates = reordered.map((item, index) => ({
      id: item.id,
      sortOrder: index,
    }));
    
    // Batch update all items
    await Promise.all(
      updates.map(({ id, sortOrder }) => updateItem(id, { sortOrder }))
    );
  };
  
  const isDraggingEnabled = sortBy === 'manual';
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header title={decodedCity} showHomeButton={true} showAdminButton={true} />
      
      {/* Category Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-[73px] z-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Results Summary */}
          {searchQuery && (
            <div className="py-2 px-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                🔍 Found <span className="font-bold">{totalSearchResults}</span> result{totalSearchResults !== 1 ? 's' : ''} for "{searchQuery}" across all categories
              </p>
            </div>
          )}
          
          <div className="flex gap-1 md:gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('places')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedCategory === 'places'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              🏛️ Places to Visit ({categoryCounts.places})
            </button>
            <button
              onClick={() => setSelectedCategory('shopping')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedCategory === 'shopping'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              🛍️ Shopping ({categoryCounts.shopping})
            </button>
            <button
              onClick={() => setSelectedCategory('food')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedCategory === 'food'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              🍽️ Food Spots ({categoryCounts.food})
            </button>
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      <ActiveFilters
        sortBy={sortBy}
        filterPriority={filterPriority}
        filterStatus={filterStatus}
        searchQuery={searchQuery}
        onRemoveSort={() => setSortBy('manual')}
        onRemovePriority={() => setFilterPriority('all')}
        onRemoveStatus={() => setFilterStatus('all')}
        onRemoveSearch={() => setSearchQuery('')}
      />
      
      {/* Progress Bar */}
      {categoryProgress.total > 0 && (
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 py-3">
          <div className="max-w-7xl mx-auto px-4 space-y-3">
            {/* Completion Progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Progress</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {categoryProgress.completed} / {categoryProgress.total} ({categoryProgress.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 dark:bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${categoryProgress.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Location Progress */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Locations Added</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {categoryProgress.withLocation} / {categoryProgress.total} ({categoryProgress.locationPercentage}%)
                    {categoryProgress.withoutLocation > 0 && (
                      <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">
                        ({categoryProgress.withoutLocation} missing)
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 dark:bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${categoryProgress.locationPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Items List */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {categoryItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Subcategory Sections - Show first */}
            {Object.keys(sortedSubcategoryGroups).map((subcategoryName) => {
              const subcategoryItems = sortedSubcategoryGroups[subcategoryName];
              const isCollapsed = collapsedSubcategories.has(subcategoryName);
              
              // Create unique drag handler for each subcategory
              const handleDragEndForSubcategory = async (event: DragEndEvent) => {
                const { active, over } = event;
                
                if (!over || active.id === over.id) return;
                
                const oldIndex = subcategoryItems.findIndex(item => item.id === active.id);
                const newIndex = subcategoryItems.findIndex(item => item.id === over.id);
                
                if (oldIndex === -1 || newIndex === -1) return;
                
                const reordered = arrayMove(subcategoryItems, oldIndex, newIndex);
                
                const updates = reordered.map((item, index) => ({
                  id: item.id,
                  sortOrder: index + 1000,
                }));
                
                await Promise.all(
                  updates.map(({ id, sortOrder }) => updateItem(id, { sortOrder }))
                );
              };
              
              return (
                <div key={subcategoryName} className="mt-8">
                  <button
                    onClick={() => toggleSubcategoryCollapse(subcategoryName)}
                    className="w-full flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
                  >
                    <div className="h-px bg-purple-300 dark:bg-purple-700 flex-1"></div>
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-2xl">{isCollapsed ? '▶' : '▼'}</span>
                      <h2 className="text-lg font-bold text-purple-700 dark:text-purple-400 capitalize">
                        {subcategoryName}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({subcategoryItems.length})
                      </span>
                    </div>
                    <div className="h-px bg-purple-300 dark:bg-purple-700 flex-1"></div>
                  </button>
                  
                  {!isCollapsed && (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEndForSubcategory}
                    >
                      <SortableContext
                        items={subcategoryItems.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {subcategoryItems.map((item) => (
                            <DraggableItem key={item.id} id={item.id} isDraggingEnabled={isDraggingEnabled}>
                              <ItemCard
                                item={item}
                                onUpdate={(updates) => handleUpdate(item.id, updates)}
                                onDelete={() => handleDelete(item.id)}
                              />
                            </DraggableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              );
            })}
            
            {/* Regular Items - Show after subcategories */}
            {sortedRegularItems.length > 0 && (
              <div className="mt-8">
                {/* Header for non-subcategorized items */}
                <button
                  onClick={() => setIsRegularItemsCollapsed(!isRegularItemsCollapsed)}
                  className="w-full flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
                >
                  <div className={`h-px flex-1 ${
                    Object.keys(sortedSubcategoryGroups).length > 0 
                      ? 'bg-gray-300 dark:bg-gray-700' 
                      : 'bg-blue-300 dark:bg-blue-700'
                  }`}></div>
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-2xl">{isRegularItemsCollapsed ? '▶' : '▼'}</span>
                    <h2 className={`text-lg font-bold px-4 ${
                      Object.keys(sortedSubcategoryGroups).length > 0
                        ? 'text-gray-600 dark:text-gray-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }`}>
                      {Object.keys(sortedSubcategoryGroups).length > 0 ? 'Other Items' : 'All Items'}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({sortedRegularItems.length})
                    </span>
                  </div>
                  <div className={`h-px flex-1 ${
                    Object.keys(sortedSubcategoryGroups).length > 0 
                      ? 'bg-gray-300 dark:bg-gray-700' 
                      : 'bg-blue-300 dark:bg-blue-700'
                  }`}></div>
                </button>
                
                {!isRegularItemsCollapsed && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEndRegular}
                  >
                    <SortableContext
                      items={sortedRegularItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {sortedRegularItems.map((item) => (
                          <DraggableItem key={item.id} id={item.id} isDraggingEnabled={isDraggingEnabled}>
                            <ItemCard
                              item={item}
                              onUpdate={(updates) => handleUpdate(item.id, updates)}
                              onDelete={() => handleDelete(item.id)}
                            />
                          </DraggableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Filter & Sort Panel */}
      <FilterSortPanel
        sortBy={sortBy}
        filterPriority={filterPriority}
        filterStatus={filterStatus}
        searchQuery={searchQuery}
        onSortChange={setSortBy}
        onPriorityFilterChange={setFilterPriority}
        onStatusFilterChange={setFilterStatus}
        onSearchChange={setSearchQuery}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
