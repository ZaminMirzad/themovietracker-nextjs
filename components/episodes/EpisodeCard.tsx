"use client";

import Image from "next/image";
import React from "react";

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path?: string;
  episode_number: number;
  air_date: string;
  runtime?: number;
}

interface EpisodeCardProps {
  episode: Episode;
  onClick: (episode: Episode) => void;
  className?: string;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={() => onClick(episode)}
    >
      {episode.still_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
          alt={episode.name}
          width={200}
          height={120}
          className="object-cover w-full h-[120px]"
        />
      ) : (
        <div className="w-full h-[120px] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-2xl mb-2">🎬</div>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
              Episode {episode.episode_number}
            </div>
          </div>
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-semibold mb-2 line-clamp-2">
          {episode.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          Episode {episode.episode_number}
        </p>
        <p className="text-xs text-gray-500">{episode.air_date}</p>
      </div>
    </div>
  );
};
