"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EpisodeDetailModal from "@/components/episodeDetailModal";
import BookmarkButton from "@/components/bookmarkButton";
import Rating from "@/components/Rating";
import { filterAndLimitMedia } from "@/lib/mediaFilters";
import { tvApi, dataUtils } from "@/lib/apiService";

export default function TVShowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  type TVShow = {
    id?: string | number;
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

  type Season = {
    id: number;
    name: string;
    overview: string;
    poster_path?: string;
    season_number: number;
    episodes: Episode[];
  };

  const [tvShow, setTvShow] = useState<TVShow | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
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
      if (!id) return;

      try {
        const [tvData, trailersData, relatedData] = (await Promise.all([
          tvApi.getDetails(id),
          tvApi.getTrailers(id),
          tvApi.getRelated(id),
        ])) as [TVShow, any, any];

        setTvShow(tvData);
        setTrailers(dataUtils.processTrailers((trailersData as any).results));
        setRelatedShows(
          dataUtils.processRelatedMedia((relatedData as any).results),
        );

        if (
          dataUtils.processTrailers((trailersData as any).results).length > 0
        ) {
          setSelectedTrailer(
            dataUtils.processTrailers((trailersData as any).results)[0].key,
          );
        }

        // Fetch seasons data
        if (tvData.number_of_seasons) {
          const seasonsData: Season[] = [];
          for (let i = 1; i <= tvData.number_of_seasons; i++) {
            const seasonData = await tvApi.getSeason(id, i);
            seasonsData.push(seasonData as Season);
          }
          setSeasons(seasonsData);
        }
      } catch (error) {
        console.error("Error fetching TV show:", error);
      }
    }

    if (id) {
      fetchTVShow();
    }
  }, [id]);

  const handleClick = (id: string | number) => {
    router.push(`/tv/${id}`);
  };

  const handlePlayTrailer = () => {
    if (trailers.length > 0) {
      setIsPlayingTrailer(true);
    }
  };

  const handlePauseTrailer = () => {
    setIsPlayingTrailer(false);
  };

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
    setShowEpisodeModal(true);
  };

  const currentSeason = seasons.find(
    (season) => season.season_number === selectedSeason,
  );

  return (
    <main className="min-h-screen bg-transparent dark:bg-dark-background/10 relative rounded-2xl">
      {/* Full Page Backdrop Background - Behind everything */}
      {tvShow?.backdrop_path && (
        <div className="fixed inset-0 z-[-1]">
          <Image
            src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
            alt="TV Show backdrop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-dark-background via-background/80 dark:via-dark-background/80 to-transparent dark:text-dark-foreground" />
        </div>
      )}

      {/* TV Show Details */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-red-700/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
        {/* Title and Bookmark Button - Now inline */}
        <div className="flex sm:flex-row justify-between items-center gap-4 mb-4 bg-transparent">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 flex-1 text-white dark:text-dark-foreground">
            {tvShow?.name || "Loading..."}
          </h1>
          <BookmarkButton
            movieId={tvShow?.id as string | number}
            title={tvShow?.name || ""}
            poster_path={tvShow?.poster_path}
            backdrop_path={tvShow?.backdrop_path}
            media_type="tv"
            overview={tvShow?.overview}
            variant="minimal"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-6 sm:mb-8 backdrop-blur-sm">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted dark:bg-dark-muted max-w-sm mx-auto lg:mx-0 h-[300px] sm:h-[400px] lg:h-[450px]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${tvShow?.poster_path}`}
              alt={tvShow?.name || "TV Show poster"}
              width={110}
              height={350}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="rounded-xl w-full object-cover h-full"
            />
          </div>

          <div className="flex flex-1/5 flex-col text-black dark:text-dark-foreground">
            <div className="flex gap-2 mb-3 flex-wrap">
              {tvShow?.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="border rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className=" mb-4 text-sm sm:text-base">
              {tvShow?.overview?.slice(0, 250) ||
                "Loading TV show description..."}
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-sm dark:text-dark-foreground">
                Status: <span className="font-medium">{tvShow?.status}</span>
              </p>
              <p className="text-sm dark:text-dark-foreground">
                First Air Date:{" "}
                <span className="font-medium">{tvShow?.first_air_date}</span>
              </p>
              <p className="text-sm dark:text-dark-foreground">
                Seasons:{" "}
                <span className="font-medium">{tvShow?.number_of_seasons}</span>
              </p>
              <p className="text-sm dark:text-dark-foreground">
                Episodes:{" "}
                <span className="font-medium">
                  {tvShow?.number_of_episodes}
                </span>
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-dark-foreground mb-2">
              IMDB Rating
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Rating rating={tvShow?.vote_average || 0} />
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex-3/5">
            <div className="relative rounded-xl overflow-hidden">
              {isPlayingTrailer && selectedTrailer ? (
                <div className="relative w-full h-[250px] sm:h-[380px] rounded-xl overflow-hidden dark:text-dark-foreground">
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
                <div className="relative w-full h-[200px] sm:h-[250px] lg:h-[300px] rounded-xl overflow-hidden dark:text-dark-foreground">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${tvShow?.backdrop_path}`}
                    alt="TV Show Backdrop"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {trailers.length > 0 && (
                    <button
                      onClick={handlePlayTrailer}
                      className="absolute inset-0 flex items-center justify-center bg-black dark:bg-dark-background bg-opacity-30 hover:bg-opacity-50 transition-colors rounded-xl group"
                    >
                      <div className="bg-white dark:bg-dark-background bg-opacity-90 p-3 sm:p-4 rounded-full group-hover:scale-110 transition-transform">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-dark-foreground ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
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
          <div className="mb-12 backdrop-blur-sm rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <div className="flex gap-2 mb-6 flex-wrap">
              {seasons.map((season, index) => (
                <button
                  key={season.season_number}
                  className={`px-3 py-1 border rounded-md transition-colors dark:text-dark-foreground ${
                    selectedSeason === season.season_number
                      ? "bg-blue-500 text-white border-blue-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-dark-foreground"
                  }`}
                  onClick={() => setSelectedSeason(season.season_number)} 
                >
                  Season {season.season_number}
                </button>
              ))}
            </div>

            {/* Selected Season Episodes */}
            {currentSeason && (
              <div className="backdrop-blur-sm rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Season {currentSeason.season_number} - {currentSeason.name}
                </h3>
                <p className="text-gray-600 dark:text-dark-foreground mb-4">{currentSeason.overview}</p>

                {/* Episodes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentSeason.episodes?.map((episode: any, idx: number) => (
                    <div
                      key={episode.id}
                      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleEpisodeClick(episode)}
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
                        <p className="text-xs text-gray-500">
                          {episode.air_date}
                        </p>
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
              {filterAndLimitMedia(relatedShows, 12).map((show) => (
                <div
                  key={show.id}
                  className="cursor-pointer group backdrop-blur-lg rounded-lg"
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
                      <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold">
                          {show.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-center line-clamp-2 text-black">
                    {show.name}
                  </div>
                  {show.first_air_date && (
                    <div className="text-xs text-gray-500/50 text-center">
                      {new Date(show.first_air_date).getFullYear()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EpisodeDetailModal
        isOpen={showEpisodeModal}
        onClose={() => setShowEpisodeModal(false)}
        episode={selectedEpisode}
      />
    </main>
  );
}
