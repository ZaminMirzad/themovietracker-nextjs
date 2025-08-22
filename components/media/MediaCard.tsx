"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export interface MediaItem {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
}

interface MediaCardProps {
  item: MediaItem;
  onClick?: (id: number) => void;
  className?: string;
  showType?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onClick,
  className = "",
  showType = false,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(item.id);
    } else {
      router.push(`/${item.media_type || "movie"}/${item.id}`);
    }
  };

  return (
    <div className={`cursor-pointer group ${className}`} onClick={handleClick}>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={`https://image.tmdb.org/t/p/w500${
            item.poster_path || item.backdrop_path
          }`}
          alt={item.title}
          width={150}
          height={225}
          className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

        {item.vote_average && (
          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {showType && item.media_type && (
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.media_type === "tv"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {item.media_type === "tv" ? "TV" : "Movie"}
            </span>
          </div>
        )}
      </div>

      <div className="p-2">
        <h3 className="text-sm font-semibold line-clamp-2">{item.title}</h3>
        <p className="text-xs text-gray-500">
          {item.release_date || item.first_air_date}
        </p>
      </div>
    </div>
  );
};
