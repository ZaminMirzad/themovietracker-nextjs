"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import BookmarkButton from "@/components/bookmarkButton";
import Rating from "@/components/Rating";
import { useAppStore } from "@/store/useStore";
import { usePersonDetails } from "@/lib/hooks/usePersonDetails";

export default function MoviePageTest() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const { detailPageData, fetchMovieDetails, clearDetailPageData } =
    useAppStore();

  const { movie, cast, crew, relatedMovies, trailers, isLoading } =
    detailPageData;

  const [selectedTrailer, setSelectedTrailer] = useState<string>("");
  const [showTrailer, setShowTrailer] = useState(false);

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

  // Auto-play trailer after 5 seconds
  useEffect(() => {
    if (trailers && trailers.length > 0 && selectedTrailer) {
      const timer = setTimeout(() => {
        setShowTrailer(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [trailers, selectedTrailer]);

  const handleClick = (id: string | number) => {
    router.push(`/movie/${id}`);
  };

  const handlePauseTrailer = () => {
    setShowTrailer(false);
  };



  // Show loading state
  if (isLoading || !movie) {
    return (
      <main className="min-h-screen bg-background dark:bg-dark-background relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-8 sm:h-12 bg-muted dark:bg-dark-muted rounded w-3/4 mb-6 sm:mb-8"></div>
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
              <div className="w-full lg:w-1/3 h-[300px] sm:h-[400px] lg:h-[450px] bg-muted dark:bg-dark-muted rounded-xl max-w-sm mx-auto lg:mx-0"></div>
              <div className="flex-1 space-y-3 sm:space-y-4">
                <div className="h-5 sm:h-6 bg-muted dark:bg-dark-muted rounded w-1/2"></div>
                <div className="h-5 sm:h-6 bg-muted dark:bg-dark-muted rounded w-1/2"></div>
                <div className="bg-muted/50 dark:bg-dark-muted/50 rounded-lg p-3 sm:px-4"></div>
                <div className="h-4 bg-muted dark:bg-dark-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent dark:bg-dark-background/10 relative rounded-2xl">
      {/* Full Page Backdrop Background - Behind everything */}
      {movie.backdrop_path && !showTrailer && (
        <div className="fixed inset-0 z-[-1]">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt="Movie backdrop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-dark-background via-background/80 dark:via-dark-background/80 to-transparent dark:text-dark-foreground" />
        </div>
      )}

                    {/* Auto-playing Trailer Background */}
        {showTrailer && selectedTrailer && (
          <div className="fixed inset-0 z-[-1]">
            <iframe
              src={`https://www.youtube.com/embed/${selectedTrailer}?autoplay=1&mute=1&rel=0&controls=0&loop=1&playlist=${selectedTrailer}&modestbranding=1&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&autohide=1&enablejsapi=1&origin=${window.location.origin}&vq=hd1080`}
              title="Auto-playing Trailer"
              className="absolute inset-0 w-screen h-screen scale-150 origin-center"
              style={{
                width: '100vw',
                height: '100vh',
                transform: 'scale(1.5)',
                transformOrigin: 'center center'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
                             onLoad={(e) => {
                 // Force autoplay if needed
                 const iframe = e.target as HTMLIFrameElement;
                 if (iframe.contentWindow) {
                   try {
                     iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                   } catch (error) {
                     console.log('Autoplay initiated');
                   }
                 }
               }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-dark-background via-background/80 dark:via-dark-background/80 to-transparent dark:text-dark-foreground" />
            
                         {/* Volume Control Button - Only show after a delay */}
             <div className="absolute top-4 right-4 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
               <button
                 onClick={() => {
                   const iframe = document.querySelector('iframe');
                   if (iframe && iframe.contentWindow) {
                     try {
                       // Toggle mute/unmute
                       iframe.contentWindow.postMessage('{"event":"command","func":"toggleMute","args":""}', '*');
                     } catch (error) {
                       console.log('Volume control initiated');
                     }
                   }
                 }}
                 className="bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
                 title="Toggle Mute/Unmute (Hover to see)"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                 </svg>
               </button>
             </div>
             

          </div>
        )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-red-400/40 shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:shadow-[0_0_20px_rgba(239,68,68,0.4)] mt-[600px]">
        {/* Title and Bookmark Button - Now inline */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex-1 flex  justify-between items-start w-full">
          <div className="flex-1 text-white">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold  dark:text-dark-foreground mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-base sm:text-lg text-muted-foreground dark:text-dark-muted-foreground italic dark:text-dark-foreground">
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
            variant="minimal"
          />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 backdrop-blur-sm dark:text-dark-foreground">
          {/* Left Column - Poster */}
          <div className="lg:col-span-1 ">
            <div className="sticky top-8 ">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted dark:bg-dark-muted max-w-sm mx-auto lg:mx-0 h-[300px] sm:h-[400px] lg:h-[450px]">
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
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-dark-muted-foreground dark:text-dark-foreground">
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
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="inline-block bg-accent/20 dark:bg-accent/30 text-accent dark:text-accent-foreground text-sm px-3 py-1 rounded-full dark:text-dark-foreground"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground dark:text-dark-foreground">
                Overview
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground dark:text-dark-muted-foreground leading-relaxed dark:text-dark-foreground">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Movie Info */}
            <div className="space-y-4 sm:space-y-6">
                             <h2 className="text-xl sm:text-2xl font-bold text-light-foreground dark:text-dark-foreground">
                Movie Details
              </h2>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {movie.release_date && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground dark:text-dark-foreground mb-1">
                      Release Date
                    </h3>
                    <p className="text-sm text-foreground dark:text-dark-foreground ">
                      {new Date(movie.release_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {movie.runtime && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground dark:text-dark-foreground mb-1">
                      Runtime
                    </h3>
                    <p className="text-sm text-foreground dark:text-dark-foreground ">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </p>
                  </div>
                )}

                {movie.vote_average && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground dark:text-dark-foreground mb-1">
                      Rating
                    </h3>
                    <Rating rating={movie.vote_average} />
                  </div>
                )}

                {movie.status && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground dark:text-dark-foreground mb-1">
                      Status
                    </h3>
                    <p className="text-sm text-foreground dark:text-dark-foreground ">
                      {movie.status}
                    </p>
                  </div>
                )}
              </div>

              {/* Budget and Revenue */}
              {(movie.budget || movie.revenue) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {movie.budget && movie.budget > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground mb-1">
                        Budget
                      </h3>
                      <p className="text-sm text-foreground dark:text-dark-foreground">
                        ${movie.budget.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {movie.revenue && movie.revenue > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground mb-1">
                        Revenue
                      </h3>
                      <p className="text-sm text-foreground dark:text-dark-foreground">
                        ${movie.revenue.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Production Companies */}
              {movie.production_companies && movie.production_companies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground dark:text-dark-muted-foreground mb-2">
                    Production Companies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_companies.map((company) => (
                      <span
                        key={company.id}
                        className="inline-block bg-muted/50 dark:bg-dark-muted/50 text-foreground dark:text-dark-foreground text-sm px-3 py-1 rounded-full"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cast Section */}
            {cast && cast.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground dark:text-dark-foreground">
                  Cast
                </h2>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                   {cast.slice(0, 10).map((person, index) => (
                     <div
                       key={`${person.id}-${index}`}
                       className="text-center cursor-pointer group"
                       onClick={() => handleCastClick(person)}
                     >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-full overflow-hidden bg-muted dark:bg-dark-muted">
                        {person.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-200"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-dark-muted-foreground">
                            <svg
                              className="w-8 h-8"
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
                      </div>
                      <p className="text-xs sm:text-sm text-foreground  dark:text-dark-foreground font-medium truncate">
                        {person.name}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground dark:text-dark-foreground truncate">
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crew Section */}
            {crew && crew.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground  ">
                  Crew
                </h2>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                   {crew.slice(0, 10).map((person, index) => (
                     <div
                       key={`${person.id}-${index}`}
                       className="text-center cursor-pointer group"
                       onClick={() => handleCrewClick(person)}
                     >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-full overflow-hidden bg-muted dark:bg-dark-muted">
                        {person.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-200"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-dark-muted-foreground">
                            <svg
                              className="w-8 h-8"
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
                      </div>
                      <p className="text-xs sm:text-sm text-foreground  dark:text-dark-foreground font-medium truncate">
                        {person.name}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground dark:text-dark-foreground truncate">
                        {person.job}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Movies */}
        {relatedMovies && relatedMovies.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground  dark:text-dark-foreground">
              Related Movies
            </h2>
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
               {relatedMovies.slice(0, 12).map((relatedMovie, index) => (
                 <div
                   key={`${relatedMovie.id}-${index}`}
                   className="cursor-pointer group"
                   onClick={() => handleClick(relatedMovie.id)}
                 >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted dark:bg-dark-muted mb-2">
                    {relatedMovie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${relatedMovie.poster_path}`}
                        alt={relatedMovie.title || "Movie"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-200"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground dark:text-dark-muted-foreground">
                        <svg
                          className="w-8 h-8"
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
                  <h3 className="text-sm font-medium text-foreground  dark:text-dark-foreground truncate">
                    {relatedMovie.title}
                  </h3>
                  {relatedMovie.vote_average && (
                    <div className="flex items-center gap-1 mt-1">
                      <Rating rating={relatedMovie.vote_average} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Controls */}
      {showTrailer && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handlePauseTrailer}
            className="bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
            title="Stop Trailer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Cast Modal */}
      {showCastModal && selectedCast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background dark:bg-dark-background rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                {selectedCast.name}
              </h2>
              <button
                onClick={closeCastModal}
                className="text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {selectedCast.profile_path && (
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-muted dark:bg-dark-muted">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${selectedCast.profile_path}`}
                    alt={selectedCast.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-1">
                  Character
                </h3>
                <p className="text-muted-foreground dark:text-dark-muted-foreground">
                  {selectedCast.character}
                </p>
              </div>
              {selectedCast.biography && (
                <div>
                  <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-1">
                    Biography
                  </h3>
                  <p className="text-muted-foreground dark:text-dark-muted-foreground">
                    {selectedCast.biography}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Crew Modal */}
      {showCrewModal && selectedCrew && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-background dark:bg-dark-background rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground">
                {selectedCrew.name}
              </h2>
              <button
                onClick={closeCrewModal}
                className="text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {selectedCrew.profile_path && (
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-muted dark:bg-dark-muted">
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${selectedCrew.profile_path}`}
                    alt={selectedCrew.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-1">
                  Job
                </h3>
                <p className="text-muted-foreground dark:text-dark-muted-foreground">
                  {selectedCrew.job}
                </p>
              </div>
              {selectedCrew.biography && (
                <div>
                  <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-1">
                    Biography
                  </h3>
                  <p className="text-muted-foreground dark:text-dark-muted-foreground">
                    {selectedCrew.biography}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
