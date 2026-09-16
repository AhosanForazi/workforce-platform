import React from 'react';
import { HiStar } from 'react-icons/hi';

const RatingStars = ({ rating = 0, count, size = 'text-sm' }) => (
  <div className="flex items-center gap-1">
    <div className={`flex ${size} text-hazard`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <HiStar key={n} className={n <= Math.round(rating) ? 'opacity-100' : 'opacity-20'} />
      ))}
    </div>
    <span className="text-xs text-ink/50 font-mono">
      {rating?.toFixed ? rating.toFixed(1) : rating} {count !== undefined ? `(${count})` : ''}
    </span>
  </div>
);

export default RatingStars;
