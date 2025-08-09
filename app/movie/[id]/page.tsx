"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import BookmarkButton from "@/components/bookmarkButton";
import { useAppStore } from "@/store/useStore";
import type { ICast, ICrew, ITrailer } from "@/store/useStore";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const {
    detailPageData,
    fetchMovieDetails,
    clearDetailPageData,
  } = useAppStore();

  const {
    movie,
    cast,
    crew,
    relatedMovies,
    trailers,
    isLoading,
  } = detailPageData;

  const [selectedTrailer, setSelectedTrailer] = useState<string>("");
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [selectedCast, setSelectedCast] = useState<ICast | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<ICrew | null>(null);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showCrewModal, setShowCrewModal] = useState(false);

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

  const handleCastClick = useCallback(async (castMember: ICast) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${castMember.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const details = await res.json();
      setSelectedCast({ ...castMember, ...details });
      setShowCastModal(true);
    } catch (error) {
      console.error("Error fetching cast details:", error);
    }
  }, []);

  const handleClick = useCallback((id: string | number) => {
    router.push(`/movie/${id}`);
  }, [router]);

  const handlePlayTrailer = useCallback(() => {
    setIsPlayingTrailer(true);
  }, []);

  const handlePauseTrailer = useCallback(() => {
    setIsPlayingTrailer(false);
  }, []);

  const handleCrewClick = useCallback(async (crewMember: ICrew) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${crewMember.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const details = await res.json();
      setSelectedCrew({ ...crewMember, ...details });
      setShowCrewModal(true);
    } catch (error) {
      console.error("Error fetching crew details:", error);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/3 h-[500px] bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                {movie.tagline}
              </p>
            )}
          </div>
          <BookmarkButton 
            movieId={movie.id || 0}
            title={movie.title || ''}
            poster_path={movie.poster_path}
            backdrop_path={movie.backdrop_path}
            media_type="movie"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path || ''}`}
                    alt={movie.title || 'Movie'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
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
                    className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Movie Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Release Date</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </p>
                </div>
                {movie.runtime && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Runtime</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatRuntime(movie.runtime)}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {movie.status || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {movie.budget && movie.budget > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Budget</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(movie.budget)}
                    </p>
                  </div>
                )}
                {movie.revenue && movie.revenue > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Revenue</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(movie.revenue)}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Rating</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={`text-${star <= Math.round((movie.vote_average || 0) / 2) ? 'yellow-400' : 'gray-300'} text-sm`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({movie.vote_count?.toLocaleString() || '0'} votes)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trailer Section */}
            {trailers && trailers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Trailer</h2>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
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
                        className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={movie.backdrop_path 
                          ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                          : '/placeholder-backdrop.jpg'}
                        alt={movie.title || 'Movie'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
                        <p className="text-gray-200 text-sm line-clamp-3">
                          {movie.overview || 'No overview available.'}
                        </p>
                      </div>
                      
                      <button
                        onClick={handlePlayTrailer}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                      >
                        <div className="bg-white/90 p-4 rounded-full group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                
                {trailers.length > 1 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">More Trailers</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {trailers.map((trailer) => (
                        <button
                          key={trailer.key}
                          onClick={() => setSelectedTrailer(trailer.key)}
                          className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-full transition-colors ${
                            selectedTrailer === trailer.key
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
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
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {cast.map((actor) => (
                <div 
                  key={actor.id} 
                  className="text-center cursor-pointer group"
                  onClick={() => handleCastClick(actor)}
                >
                  <div className="relative overflow-hidden rounded-full mb-2 mx-auto w-20 h-20 bg-gray-200 dark:bg-gray-700">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name || 'Cast member'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-200"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {actor.name || 'Cast member'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {actor.character || 'No character available'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <div
                  key={relatedMovie.id}
                  className="cursor-pointer group"
                  onClick={() => handleClick(relatedMovie.id)}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${relatedMovie.poster_path}`}
                      alt={relatedMovie.title || 'Movie'}
                      width={150}
                      height={225}
                      className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    {relatedMovie.vote_average && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        {relatedMovie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-center line-clamp-2">
                    {relatedMovie.title || 'Movie'}
                  </div>
                  {relatedMovie.release_date && (
                    <div className="text-xs text-gray-500 text-center">
                      {new Date(relatedMovie.release_date).getFullYear()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Crew Section */}
        {crew && crew.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Crew</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {crew.map((member) => (
                <div 
                  key={`${member.id}-${member.job}`} 
                  className="text-center cursor-pointer group"
                  onClick={() => handleCrewClick(member)}
                >
                  <div className="relative overflow-hidden rounded-full mb-2 mx-auto w-16 h-16">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                        alt={member.name || 'Crew member'}
                        width={64}
                        height={64}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xl">👤</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-full" />
                  </div>
                  <h3 className="text-xs font-semibold line-clamp-1">{member.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{member.job}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Production Companies */}
        {movie?.production_companies && movie.production_companies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Production Companies</h2>
            <div className="flex gap-4 flex-wrap">
              {movie.production_companies.map((company) => (
                <div key={company.id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  {company.logo_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                      width={40}
                      height={20}
                      className="object-contain h-auto"
                    />
                  ) : (
                    <span className="text-gray-500">🏢</span>
                  )}
                  <span className="text-sm font-medium">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Related Movies Section */}
        {relatedMovies.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Related Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <div
                  key={relatedMovie.id}
                  className="cursor-pointer group"
                  onClick={() => handleClick(relatedMovie.id)}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${relatedMovie.poster_path}`}
                      alt={relatedMovie.title || 'Movie'}
                      width={150}
                      height={225}
                      className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    {relatedMovie.vote_average && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        {relatedMovie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium text-center line-clamp-2">
                    {relatedMovie.title }
                  </div>
                  {relatedMovie.release_date && (
                    <div className="text-xs text-gray-500 text-center">
                      {new Date(relatedMovie.release_date).getFullYear()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cast Details Modal */}
      {showCastModal && selectedCast && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedCast.name}</h2>
                <button
                  onClick={() => setShowCastModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-6">
                {/* Cast Member Image */}
                <div className="flex-shrink-0">
                  <div className="relative overflow-hidden rounded-full w-24 h-24">
                    {selectedCast.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${selectedCast.profile_path}`}
                        alt={selectedCast.name || 'Cast member'}
                        width={96}
                        height={96}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-3xl">👤</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cast Member Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Character</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedCast.character}</p>
                  </div>

                  {selectedCast.biography && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Biography</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                        {selectedCast.biography}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedCast.birthday && (
                      <div>
                        <span className="text-gray-500">Birthday:</span>
                        <p className="font-medium">{selectedCast.birthday}</p>
                      </div>
                    )}
                    {selectedCast.place_of_birth && (
                      <div>
                        <span className="text-gray-500">Birth Place:</span>
                        <p className="font-medium">{selectedCast.place_of_birth}</p>
                      </div>
                    )}
                    {selectedCast.known_for_department && (
                      <div>
                        <span className="text-gray-500">Known For:</span>
                        <p className="font-medium">{selectedCast.known_for_department}</p>
                      </div>
                    )}
                    {selectedCast.popularity && (
                      <div>
                        <span className="text-gray-500">Popularity:</span>
                        <p className="font-medium">{selectedCast.popularity.toFixed(1)}</p>
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
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedCrew.name}</h2>
                <button
                  onClick={() => setShowCrewModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-6">
                {/* Crew Member Image */}
                <div className="flex-shrink-0">
                  <div className="relative overflow-hidden rounded-full w-24 h-24">
                    {selectedCrew.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${selectedCrew.profile_path}`}
                        alt={selectedCrew.name || 'Crew member'}
                        width={96}
                        height={96}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-3xl">👤</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Crew Member Details */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Job</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedCrew.job}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-1">Department</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedCrew.department}</p>
                  </div>

                  {selectedCrew.biography && (
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Biography</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-4">
                        {selectedCrew.biography}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedCrew.birthday && (
                      <div>
                        <span className="text-gray-500">Birthday:</span>
                        <p className="font-medium">{selectedCrew.birthday}</p>
                      </div>
                    )}
                    {selectedCrew.place_of_birth && (
                      <div>
                        <span className="text-gray-500">Birth Place:</span>
                        <p className="font-medium">{selectedCrew.place_of_birth}</p>
                      </div>
                    )}
                    {selectedCrew.known_for_department && (
                      <div>
                        <span className="text-gray-500">Known For:</span>
                        <p className="font-medium">{selectedCrew.known_for_department}</p>
                      </div>
                    )}
                    {selectedCrew.popularity && (
                      <div>
                        <span className="text-gray-500">Popularity:</span>
                        <p className="font-medium">{selectedCrew.popularity.toFixed(1)}</p>
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
