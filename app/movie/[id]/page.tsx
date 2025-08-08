"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BookmarkButton from "@/components/bookmarkButton";

export default function MoviePage() {
  const { id } = useParams();
  const router = useRouter();
  
  type Movie = {
    id?: number;
    poster_path?: string;
    backdrop_path?: string;
    title?: string;
    overview?: string;
    vote_average?: number;
    release_date?: string;
    runtime?: number;
    genres?: Array<{ id: number; name: string }>;
    budget?: number;
    revenue?: number;
    status?: string;
    production_companies?: Array<{ id: number; name: string; logo_path?: string }>;
  };

  type Cast = {
    id: number;
    name: string;
    character: string;
    profile_path?: string;
    order: number;
    biography?: string;
    birthday?: string;
    place_of_birth?: string;
    known_for_department?: string;
    popularity?: number;
  };

  type Crew = {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path?: string;
    biography?: string;
    birthday?: string;
    place_of_birth?: string;
    known_for_department?: string;
    popularity?: number;
  };

  type RelatedMovie = {
    id: number;
    title: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    release_date?: string;
  };

  type Trailer = {
    key: string;
    name: string;
    site: string;
    type: string;
  };
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);
  const [selectedCast, setSelectedCast] = useState<Cast | null>(null);
  const [showCastModal, setShowCastModal] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string>("");

  useEffect(() => {
    async function fetchMovie() {
      try {
        const [movieRes, creditsRes, relatedRes, trailersRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
        ]);

        const [movieData, creditsData, relatedData, trailersData] = await Promise.all([
          movieRes.json(),
          creditsRes.json(),
          relatedRes.json(),
          trailersRes.json(),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast?.slice(0, 10) || []);
        setCrew(creditsData.crew?.slice(0, 8) || []);
        setRelatedMovies(relatedData.results?.slice(0, 12) || []);
        
        // Set trailers
        const officialTrailers = trailersData.results?.filter(
          (trailer: Trailer) => trailer.type === "Trailer" && trailer.site === "YouTube"
        ) || [];
        setTrailers(officialTrailers);
        if (officialTrailers.length > 0) {
          setSelectedTrailer(officialTrailers[0].key);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    }
    
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchCastDetails = async (castId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${castId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching cast details:", error);
      return null;
    }
  };

  const fetchCrewDetails = async (crewId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/${crewId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching crew details:", error);
      return null;
    }
  };

  const handleCastClick = async (castMember: Cast) => {
    const details = await fetchCastDetails(castMember.id);
    setSelectedCast({ ...castMember, ...details });
    setShowCastModal(true);
  };

  const handleCrewClick = async (crewMember: Crew) => {
    const details = await fetchCrewDetails(crewMember.id);
    setSelectedCrew({ ...crewMember, ...details });
    setShowCrewModal(true);
  };

  const handlePlayTrailer = () => {
    if (trailers.length > 0) {
      setIsPlayingTrailer(true);
    }
  };

  const handlePauseTrailer = () => {
    setIsPlayingTrailer(false);
  };

  function handleClick(id: string | number) {
    router.push(`/movie/${id}`);
  }

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

  return (
    <main>
      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold mb-4">
            {movie?.title || "Loading..."}
          </h1>
          <BookmarkButton
            id={movie?.id || 0}
            title={movie?.title || ''}
            poster_path={movie?.poster_path}
            backdrop_path={movie?.backdrop_path}
            media_type="movie"
          />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="w-full lg:w-1/3 flex-1/5 h-[350px]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
              alt={movie?.title || "Movie poster"}
              width={110}
              height={350}
              className="rounded-xl w-full object-cover"
            />
          </div>
          
          <div className="flex flex-1/5 flex-col">
            <div className="flex gap-2 mb-3 flex-wrap">
              {movie?.genres?.map((genre) => (
                <span key={genre.id} className="border rounded-full px-3 py-1 text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-500">Release Date: <span className="font-medium">{movie?.release_date}</span></p>
              {movie?.runtime && (
                <p className="text-sm text-gray-500">Runtime: <span className="font-medium">{formatRuntime(movie.runtime)}</span></p>
              )}
              <p className="text-sm text-gray-500">Status: <span className="font-medium">{movie?.status}</span></p>
              {movie?.budget && movie.budget > 0 && (
                <p className="text-sm text-gray-500">Budget: <span className="font-medium">{formatCurrency(movie.budget)}</span></p>
              )}
              {movie?.revenue && movie.revenue > 0 && (
                <p className="text-sm text-gray-500">Revenue: <span className="font-medium">{formatCurrency(movie.revenue)}</span></p>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-2">IMDB Rating</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-medium text-sm">
                {movie?.vote_average?.toFixed(1) || "0.0"}/10
              </span>
              <span className="text-gray-500 text-sm">8k Reviews</span>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3 flex-3/5">
            <div className="relative rounded-xl overflow-hidden">
              {isPlayingTrailer && selectedTrailer ? (
                <div className="relative w-full h-[350px] rounded-xl overflow-hidden">
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
                    src={`https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`}
                    alt="Movie Backdrop"
                    width={600}
                    height={350}
                    className="rounded-xl object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-sm line-clamp-3">
                      {movie?.overview || "Loading movie description..."}
                    </p>
                  </div>
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

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {cast.map((actor) => (
                <div 
                  key={actor.id} 
                  className="text-center cursor-pointer group"
                  onClick={() => handleCastClick(actor)}
                >
                  <div className="relative overflow-hidden rounded-full mb-2 mx-auto w-16 h-16">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                        alt={actor.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xl">👤</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-full" />
                  </div>
                  <h3 className="text-xs font-semibold line-clamp-1">{actor.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crew Section */}
        {crew.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Crew</h2>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
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
                        alt={member.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
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
                      className="object-contain"
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
                      alt={relatedMovie.title}
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
                    {relatedMovie.title}
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
                        alt={selectedCast.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
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
                        alt={selectedCrew.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
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
