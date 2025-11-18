'use client';

import { useState, useEffect, useCallback } from 'react';

interface UserNotesProps {
  notes: string;
  onChange: (notes: string) => void;
  placeholder?: string;
}

export default function UserNotes({ notes, onChange, placeholder = 'Add your personal notes...' }: UserNotesProps) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Debounce save
  useEffect(() => {
    if (localNotes === notes) return;
    
    setIsSaving(true);
    const timer = setTimeout(() => {
      onChange(localNotes);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [localNotes, notes, onChange]);
  
  const maxLength = 500;
  const remaining = maxLength - localNotes.length;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          📝 Your Notes
        </label>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isSaving && <span className="text-blue-500">Saving...</span>}
          {lastSaved && !isSaving && (
            <span className="text-green-600">
              ✓ Saved
            </span>
          )}
          <span className={remaining < 50 ? 'text-orange-500' : ''}>
            {remaining} chars left
          </span>
        </div>
      </div>
      
      <textarea
        value={localNotes}
        onChange={(e) => setLocalNotes(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}
