'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number | null;
  onChange: (rating: number) => void;
  readonly?: boolean;
}

export default function StarRating({ rating, onChange, readonly = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const currentRating = hoverRating ?? rating ?? 0;
  
  const getRatingColor = (r: number) => {
    if (r >= 5) return 'text-green-500';
    if (r >= 4) return 'text-green-400';
    if (r >= 3) return 'text-yellow-400';
    if (r >= 2) return 'text-orange-400';
    return 'text-orange-500';
  };
  
  const getRatingLabel = (r: number | null) => {
    if (!r) return '';
    if (r === 5) return 'Excellent';
    if (r === 4) return 'Very Good';
    if (r === 3) return 'Good';
    if (r === 2) return 'Fair';
    return 'Okay';
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(null)}
            className={`text-2xl transition-all ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${
              star <= currentRating ? getRatingColor(currentRating) : 'text-gray-300'
            }`}
          >
            {star <= currentRating ? '★' : '☆'}
          </button>
        ))}
      </div>
      {rating && (
        <span className="text-sm text-gray-600 font-medium">
          {getRatingLabel(rating)}
        </span>
      )}
    </div>
  );
}
