'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCities } from '@/hooks/useItems';
import { db } from '@/lib/db';
import { CategoryType, TravelItem } from '@/types';
import { useLiveQuery } from 'dexie-react-hooks';
import ExportToExcel from '@/components/ExportToExcel';

type FormMode = 'add' | 'edit';

export default function AdminPage() {
  const { cities } = useCities();
  const allItems = useLiveQuery(() => db.items.toArray()) || [];
  
  // Form state
  const [mode, setMode] = useState<FormMode>('add');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    city: '',
    category: 'places' as CategoryType,
    subcategory: '',
    name: '',
    details: '',
    location: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Search for existing items to edit
  const [searchCity, setSearchCity] = useState('');
  const [searchCategory, setSearchCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredItems = allItems.filter(item => {
    if (searchCity && item.city !== searchCity) return false;
    if (searchCategory !== 'all' && item.category !== searchCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(query) || 
             item.details.toLowerCase().includes(query);
    }
    return true;
  }).slice(0, 50); // Limit to 50 items for performance
  
  const handleEditItem = (item: TravelItem) => {
    setMode('edit');
    setEditingItemId(item.id);
    setFormData({
      city: item.city,
      category: item.category,
      subcategory: item.subcategory || '',
      name: item.name,
      details: item.details,
      location: item.location,
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setMode('add');
    setEditingItemId(null);
    setFormData({
      city: '',
      category: 'places',
      subcategory: '',
      name: '',
      details: '',
      location: '',
    });
    setMessage(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.city.trim() || !formData.name.trim()) {
      setMessage({ type: 'error', text: 'City and Item Name are required!' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      if (mode === 'edit' && editingItemId) {
        // Update existing item
        await db.items.update(editingItemId, {
          city: formData.city,
          category: formData.category,
          subcategory: formData.subcategory || null,
          name: formData.name,
          details: formData.details,
          location: formData.location,
          updatedAt: new Date(),
        });
        
        setMessage({ type: 'success', text: `✅ Successfully updated "${formData.name}"!` });
        handleCancelEdit();
      } else {
        // Add new item
        const existingItems = await db.items
          .where({ city: formData.city, category: formData.category })
          .toArray();
        
        const maxSortOrder = existingItems.length > 0
          ? Math.max(...existingItems.map(item => item.sortOrder))
          : 0;
        
        const newItem: TravelItem = {
          id: `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          city: formData.city,
          category: formData.category,
          subcategory: formData.subcategory || null,
          name: formData.name,
          details: formData.details,
          location: formData.location,
          status: 'pending',
          rating: null,
          priority: null,
          userNotes: '',
          sortOrder: maxSortOrder + 1,
          isAdminAdded: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await db.items.add(newItem);
        
        setMessage({ type: 'success', text: `✅ Successfully added "${formData.name}" to ${formData.city}!` });
        
        // Reset form but keep city if it's new
        const keepCity = !cities.includes(formData.city);
        setFormData({
          city: keepCity ? formData.city : '',
          category: 'places',
          subcategory: '',
          name: '',
          details: '',
          location: '',
        });
      }
    } catch (error) {
      console.error('Error saving item:', error);
      setMessage({ type: 'error', text: '❌ Failed to save item. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNewCity = formData.city && !cities.includes(formData.city);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-500 hover:text-blue-600">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">🔐 Admin Panel</h1>
          </div>
          <Link
            href="/admin/manage"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
          >
            📋 Manage Custom Entries
          </Link>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Export to Excel Component */}
        <div className="mb-6">
          <ExportToExcel />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div>
            {/* Success/Error Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
            
            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {mode === 'edit' ? '✏️ Edit Entry' : '➕ Add New Entry'}
                </h2>
                {mode === 'edit' && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* City Field */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {mode === 'add' && (
                      <select
                        id="city-select"
                        value={cities.includes(formData.city) ? formData.city : ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select existing or type below --</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    )}
                    
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={mode === 'add' ? "Or type a new city name..." : "City name"}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    
                    {isNewCity && mode === 'add' && (
                      <p className="text-sm text-amber-600">
                        ℹ️ This will create a new city: <strong>{formData.city}</strong>
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Category Field */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="places">🏛️ Places to Visit</option>
                    <option value="shopping">🛍️ Shopping</option>
                    <option value="food">🍽️ Food Spots</option>
                  </select>
                </div>
                
                {/* Subcategory Field */}
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g., Abaya-Thobe, Historical, Modern, etc."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use subcategories to group similar items together
                  </p>
                </div>
                
                {/* Item Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item / Place Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Grand Mosque, Al Baik Restaurant, Gold Souq"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                {/* Details/Notes Field */}
                <div>
                  <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Details / Notes
                  </label>
                  <textarea
                    id="details"
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Add any relevant details, tips, or notes..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                
                {/* Location Link Field */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Maps Location Link
                  </label>
                  <input
                    type="url"
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional: Paste a Google Maps link for easy navigation
                  </p>
                </div>
                
                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : mode === 'edit'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isSubmitting 
                      ? '⏳ Saving...' 
                      : mode === 'edit' 
                      ? '💾 Update Entry' 
                      : '➕ Add Entry'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ city: '', category: 'places', subcategory: '', name: '', details: '', location: '' });
                      setMessage(null);
                      if (mode === 'edit') handleCancelEdit();
                    }}
                    className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
            
            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">💡 Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>You can add new cities by typing them in the city field</li>
                <li>Subcategories help organize items (e.g., "Historical", "Modern", "Luxury")</li>
                <li>Click any item in the list to edit all its details</li>
                <li>Google Maps links enable the "View on Map" button</li>
              </ul>
            </div>
          </div>
          
          {/* Right Column: Search & Edit List */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Search Items to Edit</h2>
              
              {/* Search Filters */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by City
                  </label>
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Category
                  </label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value as CategoryType | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="places">🏛️ Places</option>
                    <option value="shopping">🛍️ Shopping</option>
                    <option value="food">🍽️ Food</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search Name/Details
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg text-sm"
                  />
                </div>
              </div>
              
              {/* Results */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                  {filteredItems.length === 50 && ' (showing first 50)'}
                </p>
                
                <div className="max-h-[600px] overflow-y-auto space-y-2">
                  {filteredItems.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      No items found. Try adjusting your filters.
                    </p>
                  ) : (
                    filteredItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleEditItem(item)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          editingItemId === item.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 truncate text-sm">
                                {item.name}
                              </h4>
                              {item.isAdminAdded && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex-shrink-0">
                                  Custom
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{item.city}</span>
                              <span>•</span>
                              <span>
                                {item.category === 'places' ? '🏛️' : 
                                 item.category === 'shopping' ? '🛍️' : '🍽️'}
                                {item.subcategory && ` (${item.subcategory})`}
                              </span>
                            </div>
                            {!item.location && (
                              <span className="text-xs text-orange-600 mt-1 block">
                                ⚠️ Missing map link
                              </span>
                            )}
                          </div>
                          {editingItemId === item.id && (
                            <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
