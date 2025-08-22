"use client";

import React from "react";

interface Season {
  season_number: number;
  name: string;
  overview?: string;
}

interface SeasonSelectorProps {
  seasons: Season[];
  selectedSeason: number;
  onSeasonChange: (seasonNumber: number) => void;
  className?: string;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  className = "",
}) => {
  return (
    <div className={`flex gap-2 mb-6 flex-wrap ${className}`}>
      {seasons.map((season) => (
        <button
          key={season.season_number}
          className={`px-3 py-1 border rounded-md transition-colors ${
            selectedSeason === season.season_number
              ? "bg-blue-500 text-white border-blue-500"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          onClick={() => onSeasonChange(season.season_number)}
        >
          Season {season.season_number}
        </button>
      ))}
    </div>
  );
};
