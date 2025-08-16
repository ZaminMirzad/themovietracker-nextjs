'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface Trailer {
  key: string;
  name: string;
  site: string;
  type: string;
}

interface TrailerPlayerProps {
  trailers: Trailer[];
  backdropPath?: string;
  title?: string;
  className?: string;
}

export const TrailerPlayer: React.FC<TrailerPlayerProps> = ({
  trailers,
  backdropPath,
  title,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string>('');

  const handlePlayTrailer = () => {
    if (trailers.length > 0) {
      setSelectedTrailer(trailers[0].key);
      setIsPlaying(true);
    }
  };

  const handlePauseTrailer = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {isPlaying && selectedTrailer ? (
        <div className="relative w-full h-[380px] rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1&rel=0`}
            title="Trailer"
            className="w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            onClick={handlePauseTrailer}
            className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors z-10"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="relative w-full h-[350px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${backdropPath}`}
            alt={title || 'Backdrop'}
            width={600}
            height={250}
            className="rounded-xl object-cover w-full h-auto"
          />
          {trailers.length > 0 && (
            <button
              onClick={handlePlayTrailer}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors rounded-xl group"
            >
              <div className="bg-white bg-opacity-90 p-4 rounded-full group-hover:scale-110 transition-transform">
                <svg 
                  className="w-8 h-8 text-black ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
