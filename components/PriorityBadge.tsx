'use client';

import { PriorityType } from '@/types';

interface PriorityBadgeProps {
  priority: PriorityType;
  onChange: (priority: PriorityType) => void;
  readonly?: boolean;
}

export default function PriorityBadge({ priority, onChange, readonly = false }: PriorityBadgeProps) {
  if (readonly) {
    if (!priority) return null;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        priority === 'must' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-blue-100 text-blue-800'
      }`}>
        {priority === 'must' ? '⭐ Must Visit' : '💡 Optional'}
      </span>
    );
  }
  
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange(priority === 'must' ? null : 'must')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          priority === 'must'
            ? 'bg-red-500 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-red-100'
        }`}
      >
        ⭐ Must
      </button>
      <button
        onClick={() => onChange(priority === 'optional' ? null : 'optional')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          priority === 'optional'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-blue-100'
        }`}
      >
        💡 Optional
      </button>
      {priority && (
        <button
          onClick={() => onChange(null)}
          className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
