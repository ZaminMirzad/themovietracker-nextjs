import React from 'react';

interface RatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export default function Rating({ rating, maxRating = 10, className = '' }: RatingProps) {
  const percentage = (rating / maxRating) * 100;
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-yellow-400"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700/50 dark:text-gray-300">
            {Math.round(rating * 10) / 10}
          </span>
        </div>
      </div>
      <span className="text-sm text-gray-600/50 dark:text-gray-400">
        / {maxRating}
      </span>
    </div>
  );
}
