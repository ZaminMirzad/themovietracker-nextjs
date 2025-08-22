"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import BookmarkButton from "@/components/bookmarkButton";
import { useAppStore } from "@/store/useStore";
import {
  filterCastWithProfileImages,
  filterAndLimitMedia,
} from "@/lib/mediaFilters";
import { usePersonDetails } from "@/lib/hooks/usePersonDetails";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const { detailPageData, fetchMovieDetails, clearDetailPageData } =
    useAppStore();

  const { movie, cast, crew, relatedMovies, trailers, isLoading } =
    detailPageData;

  const [selectedTrailer, setSelectedTrailer] = useState<string>("");
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const {
    selectedPerson: selectedCast,
    showModal: showCastModal,
    handlePersonClick: handleCastClick,
    closeModal: closeCastModal,
  } = usePersonDetails();

  const {
    selectedPerson: selectedCrew,
    showModal: showCrewModal,
    handlePersonClick: handleCrewClick,
    closeModal: closeCrewModal,
  } = usePersonDetails();

  useEffect(() => {
    if (!movieId) return;

    fetchMovieDetails(movieId);

    return () => {
      clearDetailPageData();
    };
  }, [movieId, fetchMovieDetails, clearDetailPageData]);



  useEffect(() => {
    if (trailers && trailers.length > 0) {
      setSelectedTrailer(trailers[0].key);
    }
  }, [trailers]);

  const handleClick = useCallback(
    (id: string | number) => {
      router.push(`/movie/${id}`);
    },
    [router],
  );

  const handlePlayTrailer = useCallback(() => {
    setIsPlayingTrailer(true);
  }, []);

  const handlePauseTrailer = useCallback(() => {
    setIsPlayingTrailer(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Show loading state
  if (isLoading || !movie) {
    return (
      <main className="min-h-screen bg-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-muted dark:bg-dark-muted rounded w-3/4 mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/3 h-[500px] bg-muted dark:bg-dark-muted rounded-xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-muted dark:bg-dark-muted rounded w-1/2"></div>
                <div className="bg-muted/50 dark:bg-dark-muted/50 rounded-lg p-4"></div>
                <div className="h-4 bg-muted dark:bg-dark-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-lg text-muted-foreground dark:text-dark-muted-foreground italic">
                {movie.tagline}
              </p>
            )}
          </div>
          <BookmarkButton
            movieId={movie.id as string | number}
            title={movie.title || ""}
            poster_path={movie.poster_path}
            backdrop_path={movie.backdrop_path}
            media_type="movie"
            overview={movie.overview}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted dark:bg-dark-muted">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path || ""}`}
                    alt={movie.title || "Movie"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-dark-muted-foreground">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="inline-block bg-accent/20 dark:bg-accent/30 text-accent dark:text-accent-foreground text-sm px-3 py-1 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-dark-foreground">
                Overview
              </h2>
              <p className="text-muted-foreground dark:text-dark-muted-foreground leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Movie Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground">
                Movie Details
              </h2>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Release Date
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "N/A"}
                    </span>
                  </div>

                  {movie.runtime && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Runtime
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatRuntime(movie.runtime)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {movie.status || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-4">
                  {movie.budget && movie.budget > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Budget
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(movie.budget)}
                      </span>
                    </div>
                  )}

                  {movie.revenue && movie.revenue > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Revenue
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(movie.revenue)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Section */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Rating
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-${star <= Math.round((movie.vote_average || 0) / 2) ? "yellow-400" : "gray-400 dark:text-gray-600"} text-lg`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-foreground dark:text-dark-foreground text-lg">
                      {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    {movie.vote_count?.toLocaleString() || "0"} votes
                  </span>
                </div>
              </div>
            </div>

            {/* Trailer Section */}
            {trailers && trailers.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground">
                    Trailer
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {trailers.length} trailer{trailers.length > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl">
                  {isPlayingTrailer && selectedTrailer ? (
                    <div className="relative w-full h-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1&rel=0`}
                        title="Movie Trailer"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        onClick={handlePauseTrailer}
                        className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/90 transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={
                          movie.backdrop_path
                            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                            : "/placeholder-backdrop.jpg"
                        }
                        alt={movie.title || "Movie"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-2xl">
                          <h3 className="text-2xl font-bold text-white mb-3">
                            Watch the Trailer
                          </h3>
                          <p className="text-gray-200 text-lg leading-relaxed line-clamp-2">
                            {movie.overview ||
                              "Experience the magic of this incredible film."}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handlePlayTrailer}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-300 group"
                      >
                        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                          <svg
                            className="w-12 h-12 text-black"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {trailers.length > 1 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground dark:text-dark-foreground">
                      More Trailers
                    </h4>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {trailers.map((trailer) => (
                        <button
                          key={trailer.key}
                          onClick={() => setSelectedTrailer(trailer.key)}
                          className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                            selectedTrailer === trailer.key
                              ? "bg-accent text-accent-foreground shadow-lg scale-105"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                          }`}
                        >
                          {trailer.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {cast && cast.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground">
                Cast
              </h2>
              <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground bg-muted dark:bg-dark-muted px-3 py-1 rounded-full">
                {cast.length} members
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {filterCastWithProfileImages(cast)
                .slice(0, 16)
                .map((actor) => (
                  <div
                    key={actor.id}
                    className="group cursor-pointer text-center"
                    onClick={() => handleCastClick(actor)}
                  >
                    <div className="relative mb-4 mx-auto">
                      <div className="relative overflow-hidden rounded-2xl w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {actor.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                            alt={actor.name || "Cast member"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <svg
                              className="w-10 h-10"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Hover indicator */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        View
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold text-foreground dark:text-dark-foreground line-clamp-1 group-hover:text-accent transition-colors duration-200">
                      {actor.name || "Cast member"}
                    </h3>
                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground line-clamp-1 mt-1">
                      {actor.character || "No character available"}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground">
                You May Also Like
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {relatedMovies.length} recommendations
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filterAndLimitMedia(relatedMovies)
                .slice(0, 6)
                .map((relatedMovie) => (
                  <div
                    key={relatedMovie.id}
                    className="group cursor-pointer"
                    onClick={() => handleClick(relatedMovie.id)}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${relatedMovie.poster_path}`}
                        alt={relatedMovie.title || "Movie"}
                        width={200}
                        height={300}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Rating badge */}
                      {relatedMovie.vote_average && (
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                          <span className="text-yellow-400">★</span>
                          {relatedMovie.vote_average.toFixed(1)}
                        </div>
                      )}

                      {/* Hover content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
                          {relatedMovie.title || "Movie"}
                        </h3>
                        {relatedMovie.release_date && (
                          <p className="text-xs text-gray-200">
                            {new Date(relatedMovie.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Fallback text for mobile */}
                    <div className="mt-3 text-center md:hidden">
                      <h3 className="text-sm font-medium text-foreground dark:text-dark-foreground line-clamp-2">
                        {relatedMovie.title || "Movie"}
                      </h3>
                      {relatedMovie.release_date && (
                        <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-1">
                          {new Date(relatedMovie.release_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Crew Section */}
        {crew && crew.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground">
                Crew
              </h2>
              <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground bg-muted dark:bg-dark-muted px-3 py-1 rounded-full">
                {crew.length} members
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {filterCastWithProfileImages(crew)
                .slice(0, 16)
                .map((member) => (
                  <div
                    key={`${member.id}-${member.job}`}
                    className="group cursor-pointer text-center"
                    onClick={() => handleCrewClick(member)}
                  >
                    <div className="relative mb-4 mx-auto">
                      <div className="relative overflow-hidden rounded-2xl w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {member.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                            alt={member.name || "Crew member"}
                            width={80}
                            height={80}
                            className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-2xl">
                              👤
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      </div>

                      {/* Hover indicator */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        View
                      </div>
                    </div>

                    <h3 className="text-xs font-semibold text-foreground dark:text-dark-foreground line-clamp-1 group-hover:text-accent transition-colors duration-200">
                      {member.name}
                    </h3>
                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground line-clamp-1 mt-1">
                      {member.job}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Production Companies */}
        {movie?.production_companies &&
          movie.production_companies.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground">
                  Production Companies
                </h2>
                <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground bg-muted dark:bg-dark-muted px-3 py-1 rounded-full">
                  {movie.production_companies.length} companies
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movie.production_companies.map((company) => (
                  <div
                    key={company.id}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {company.logo_path ? (
                          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-xl p-3 shadow-inner">
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                              alt={company.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center shadow-inner">
                            <span className="text-2xl">🏢</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground group-hover:text-accent transition-colors duration-200 line-clamp-2">
                          {company.name}
                        </h3>
                        {/* Company details could be added here if available in the API response */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Remove duplicate Related Movies Section */}
      </div>

      {/* Cast Details Modal */}
      {showCastModal && selectedCast && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">
                    {selectedCast.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cast Member
                  </div>
                </div>
                <button
                  onClick={() => closeCastModal()}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex gap-8">
                {/* Cast Member Image */}
                <div className="flex-shrink-0">
                  <div className="relative overflow-hidden rounded-2xl w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-xl">
                    {selectedCast.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${selectedCast.profile_path}`}
                        alt={selectedCast.name || "Cast member"}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-5xl">
                          👤
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cast Member Details */}
                <div className="flex-1 space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-dark-foreground">
                      Character
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {selectedCast.character}
                    </p>
                  </div>

                  {selectedCast.biography && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-dark-foreground">
                        Biography
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                        {selectedCast.biography}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    {selectedCast.birthday && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Birthday
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCast.birthday}
                        </p>
                      </div>
                    )}
                    {selectedCast.place_of_birth && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Birth Place
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCast.place_of_birth}
                        </p>
                      </div>
                    )}
                    {selectedCast.known_for_department && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Known For
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCast.known_for_department}
                        </p>
                      </div>
                    )}
                    {selectedCast.popularity && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Popularity
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCast.popularity.toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crew Details Modal */}
      {showCrewModal && selectedCrew && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">
                    {selectedCrew.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-dark-muted-foreground">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Crew Member
                  </div>
                </div>
                <button
                  onClick={() => closeCrewModal()}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex gap-8">
                {/* Crew Member Image */}
                <div className="flex-shrink-0">
                  <div className="relative overflow-hidden rounded-2xl w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-xl">
                    {selectedCrew.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${selectedCrew.profile_path}`}
                        alt={selectedCrew.name || "Crew member"}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 text-5xl">
                          👤
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Crew Member Details */}
                <div className="flex-1 space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-dark-foreground">
                      Job
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {selectedCrew.job}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-dark-foreground">
                      Department
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {selectedCrew.department}
                    </p>
                  </div>

                  {selectedCrew.biography && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-3 text-foreground dark:text-dark-foreground">
                        Biography
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                        {selectedCrew.biography}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    {selectedCrew.birthday && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Birthday
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCrew.birthday}
                        </p>
                      </div>
                    )}
                    {selectedCrew.place_of_birth && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Birth Place
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCrew.place_of_birth}
                        </p>
                      </div>
                    )}
                    {selectedCrew.known_for_department && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Known For
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCrew.known_for_department}
                        </p>
                      </div>
                    )}
                    {selectedCrew.popularity && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl">
                        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground block mb-1">
                          Popularity
                        </span>
                        <p className="font-semibold text-foreground dark:text-dark-foreground">
                          {selectedCrew.popularity.toFixed(1)}
                        </p>
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
