"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function TVShowPage() {
  const { id } = useParams();
  const router = useRouter();
  
  type TVShow = {
    poster_path?: string;
    backdrop_path?: string;
    name?: string;
    overview?: string;
    vote_average?: number;
    first_air_date?: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
    status?: string;
    genres?: Array<{ id: number; name: string }>;
  };

  type RelatedShow = {
    id: number;
    name: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    first_air_date?: string;
  };

  type Trailer = {
    key: string;
    name: string;
    site: string;
    type: string;
  };

  type Episode = {
    id: number;
    name: string;
    overview: string;
    still_path?: string;
    episode_number: number;
    air_date: string;
    vote_average?: number;
    runtime?: number;
  };
  
  const [tvShow, setTvShow] = useState<TVShow | null>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [relatedShows, setRelatedShows] = useState<RelatedShow[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string>("");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [episodeTrailers, setEpisodeTrailers] = useState<Trailer[]>([]);
  const [isPlayingEpisodeTrailer, setIsPlayingEpisodeTrailer] = useState(false);

  useEffect(() => {
    async function fetchTVShow() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const data = await res.json();
        setTvShow(data);
        
        // Fetch all seasons data
        if (data.number_of_seasons) {
          const seasonsData = [];
          for (let i = 1; i <= data.number_of_seasons; i++) {
            const seasonRes = await fetch(
              `https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
            );
            const seasonData = await seasonRes.json();
            seasonsData.push(seasonData);
          }
          setSeasons(seasonsData);
        }

        // Fetch trailers
        const trailersRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const trailersData = await trailersRes.json();
        const officialTrailers = trailersData.results?.filter(
          (trailer: Trailer) => trailer.type === "Trailer" && trailer.site === "YouTube"
        ) || [];
        setTrailers(officialTrailers);
        if (officialTrailers.length > 0) {
          setSelectedTrailer(officialTrailers[0].key);
        }

        // Fetch related shows
        const relatedRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const relatedData = await relatedRes.json();
        setRelatedShows(relatedData.results || []);
      } catch (error) {
        console.error("Error fetching TV show:", error);
      }
    }
    
    if (id) {
      fetchTVShow();
    }
  }, [id]);

  const fetchEpisodeTrailers = async (episodeId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}/episode/${episodeId}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data = await res.json();
      const officialTrailers = data.results?.filter(
        (trailer: Trailer) => trailer.type === "Trailer" && trailer.site === "YouTube"
      ) || [];
      setEpisodeTrailers(officialTrailers);
    } catch (error) {
      console.error("Error fetching episode trailers:", error);
    }
  };

  function handleClick(id: string | number) {
    router.push(`/tv/${id}`);
  }

  const handlePlayTrailer = () => {
    if (trailers.length > 0) {
      setIsPlayingTrailer(true);
    }
  };

  const handlePauseTrailer = () => {
    setIsPlayingTrailer(false);
  };

  const handleEpisodeClick = async (episode: Episode) => {
    setSelectedEpisode(episode);
    setShowEpisodeModal(true);
    await fetchEpisodeTrailers(episode.episode_number);
  };

  const handlePlayEpisodeTrailer = () => {
    if (episodeTrailers.length > 0) {
      setIsPlayingEpisodeTrailer(true);
    }
  };

  const handlePauseEpisodeTrailer = () => {
    setIsPlayingEpisodeTrailer(false);
  };

  const currentSeason = seasons.find(season => season.season_number === selectedSeason);

  return (
    <main>
      {/* TV Show Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold mb-4">
            {tvShow?.name || "Loading..."}
          </h1>
          <button className="flex items-center gap-2 text-sm border px-4 py-2 rounded-full">
            <span>🔖</span> Add to watchlist
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="w-full lg:w-1/3 flex-1/5">
            <Image
              src={`https://image.tmdb.org/t/p/w500${tvShow?.poster_path}`}
              alt={tvShow?.name || "TV Show poster"}
              width={110}
              height={200}
              className="rounded-xl w-full object-cover"
            />
          </div>
          
          <div className="flex flex-1/5 flex-col">
            <div className="flex gap-2 mb-3 flex-wrap">
              {tvShow?.genres?.map((genre) => (
                <span key={genre.id} className="border rounded-full px-3 py-1 text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <p className="text-gray-600 mb-4">
              {tvShow?.overview?.slice(0, 250) || "Loading TV show description..."}
            </p>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-500">Status: <span className="font-medium">{tvShow?.status}</span></p>
              <p className="text-sm text-gray-500">First Air Date: <span className="font-medium">{tvShow?.first_air_date}</span></p>
              <p className="text-sm text-gray-500">Seasons: <span className="font-medium">{tvShow?.number_of_seasons}</span></p>
              <p className="text-sm text-gray-500">Episodes: <span className="font-medium">{tvShow?.number_of_episodes}</span></p>
            </div>
            
            <p className="text-sm text-gray-500 mb-2">IMDB Rating</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-medium text-sm">
                {tvShow?.vote_average?.toFixed(1) || "0.0"}/10
              </span>
              <span className="text-gray-500 text-sm">8k Reviews</span>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 flex-3/5">
            <div className="relative rounded-xl overflow-hidden">
              {isPlayingTrailer && selectedTrailer ? (
                <div className="relative w-full h-[250px] rounded-xl overflow-hidden">
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
                <div className="relative w-full h-[250px]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${tvShow?.backdrop_path}`}
                    alt="TV Show Backdrop"
                    width={600}
                    height={250}
                    className="rounded-xl object-cover w-full h-full"
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
          </div>
        </div>

        {/* Seasons Section */}
        {seasons.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <div className="flex gap-2 mb-6 flex-wrap">
              {seasons.map((season, index) => (
                <button 
                  key={season.season_number} 
                  className={`px-3 py-1 border rounded-md transition-colors ${
                    selectedSeason === season.season_number 
                      ? "bg-blue-500 text-white border-blue-500" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedSeason(season.season_number)}
                >
                  Season {season.season_number}
                </button>
              ))}
            </div>

            {/* Selected Season Episodes */}
            {currentSeason && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Season {currentSeason.season_number} - {currentSeason.name}
                </h3>
                <p className="text-gray-600 mb-4">{currentSeason.overview}</p>
                
                {/* Episodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentSeason.episodes?.map((episode: any, idx: number) => (
                    <div
                      key={episode.id}
                      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleEpisodeClick(episode)}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                        width={200}
                        height={120}
                        className="object-cover w-full h-[120px]"
                      />
                      <div className="p-3">
                        <h3 className="text-sm font-semibold mb-2 line-clamp-2">{episode.name}</h3>
                        <p className="text-xs text-gray-500 mb-2">Episode {episode.episode_number}</p>
                        <p className="text-xs text-gray-500">{episode.air_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Related Shows Section */}
        {relatedShows.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Related Shows</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {relatedShows.slice(0, 12).map((show) => (
                <div
                  key={show.id}
                  className="cursor-pointer group"
                  onClick={() => handleClick(show.id)}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                      width={150}
                      height={225}
                      className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    {show.vote_average && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        {show.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-center line-clamp-2">
                    {show.name}
                  </div>
                  {show.first_air_date && (
                    <div className="text-xs text-gray-500 text-center">
                      {new Date(show.first_air_date).getFullYear()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Episode Details Modal */}
      {showEpisodeModal && selectedEpisode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedEpisode.name}</h2>
                <button
                  onClick={() => setShowEpisodeModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Episode Image and Trailer */}
                <div className="relative rounded-xl overflow-hidden">
                  {isPlayingEpisodeTrailer && episodeTrailers.length > 0 ? (
                    <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${episodeTrailers[0].key}?autoplay=1&rel=0`}
                        title="Episode Trailer"
                        className="w-full h-full rounded-xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        onClick={handlePauseEpisodeTrailer}
                        className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors z-10"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${selectedEpisode.still_path}`}
                        alt={selectedEpisode.name}
                        width={400}
                        height={300}
                        className="rounded-xl object-cover w-full h-full"
                      />
                      {episodeTrailers.length > 0 && (
                        <button
                          onClick={handlePlayEpisodeTrailer}
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

                {/* Episode Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Episode {selectedEpisode.episode_number}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {selectedEpisode.overview || "No description available."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Air Date: <span className="font-medium">{selectedEpisode.air_date}</span>
                    </p>
                    {selectedEpisode.runtime && (
                      <p className="text-sm text-gray-500">
                        Runtime: <span className="font-medium">{selectedEpisode.runtime} minutes</span>
                      </p>
                    )}
                    {selectedEpisode.vote_average && (
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="font-medium text-sm">
                          {selectedEpisode.vote_average.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
