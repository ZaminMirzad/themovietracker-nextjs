"use client";

import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Play } from "lucide-react";

export default function BookmarksPage() {
  const router = useRouter();
  const { user } = useUser();
  const { bookmarks, fetchBookmarks } = useAppStore(state => state);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const nextSlide = () => {
    if (bookmarks && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % bookmarks.length);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const prevSlide = () => {
    if (bookmarks && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev - 1 + bookmarks.length) % bookmarks.length);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToSlide = (index: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleClick = (id: string | number, mediaType: "movie" | "tv") => {
    if (mediaType === "tv") {
      router.push(`/tv/${id}`);
    } else {
      router.push(`/movie/${id}`);
    }
  };

  const currentBookmark = bookmarks?.[currentIndex];

  return (
    <>
      {/* Full Page Backdrop Background - Behind everything */}
      {currentBookmark?.backdrop_path && (
        <div className="fixed inset-0 z-[-1]">
          <Image
            src={`https://image.tmdb.org/t/p/original${currentBookmark.backdrop_path}`}
            alt="Backdrop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-light-background dark:from-dark-background via-light-background/80 dark:via-dark-background/80 to-transparent" />
        </div>
      )}

      <main className="min-h-screen bg-transparent text-light-input-text overflow-hidden relative z-10">
        <SignedOut>
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-light-foreground dark:text-dark-foreground mb-4">
                Sign in to view your bookmarks
              </h1>
              <p className="text-light-input-text dark:text-dark-input-text mb-8">
                You need to be signed in to access your bookmarks.
              </p>
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Page Content - Above backdrop */}
          <div className="relative z-10 min-h-screen flex flex-col">
            {/* Header - Always visible above backdrop */}
            <div className="pt-8 pb-6 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="mb-2 p-8 relative">
                  {/* Modern accent line with glow */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 shadow-lg shadow-red-500/25 "></div>
                  
                  {/* Animated floating orbs */}
                  <div className="absolute inset-0">
                    <div className="absolute top-6 right-6 w-36 h-36 bg-gradient-to-br from-red-400/20 via-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-6 left-6 w-28 h-28 bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                  </div>
                  
                  {/* Enhanced downward fade effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 dark:from-transparent dark:via-slate-400/5 dark:to-slate-900/20 blur-sm"></div>
                  
                  {/* Subtle noise texture */}
                  <div className="absolute inset-0 opacity-3 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px] blur-sm"></div>
                  
                  {/* Modern border glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5 opacity-20 blur-sm"></div>
                  
                  <div className="relative z-10 ">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-3 tracking-tight drop-shadow-sm">
                      My Bookmarks
                    </h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed backdrop-blur-sm">
                      Welcome back, <span className="font-semibold text-red-500 dark:text-red-400 drop-shadow-sm">{user?.fullName || user?.username}</span>! You have{" "}
                      <span className="font-bold text-blue-600 dark:text-blue-400 drop-shadow-sm">{bookmarks?.length}</span> bookmarked items.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {bookmarks?.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-500">
                    <Heart className="w-full h-full" />
                  </div>
                  <h2 className="text-2xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                    No bookmarks yet
                  </h2>
                  <p className="text-light-input-text dark:text-dark-input-text mb-6">
                    Start bookmarking your favorite movies and TV shows to see them
                    here.
                  </p>
                  <Link
                    href="/"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    Discover Movies & Shows
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                {/* 3D Carousel Container */}
                <div className="relative w-full max-w-7xl">
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    disabled={isTransitioning}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-6 h-6 text-light-foreground dark:text-dark-foreground" />
                  </button>

                  <button
                    onClick={nextSlide}
                    disabled={isTransitioning}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-light-background/80 dark:bg-dark-background/80 backdrop-blur-sm border border-light-border dark:border-dark-border rounded-full p-4 hover:shadow-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-6 h-6 text-light-foreground dark:text-dark-foreground" />
                  </button>

                  {/* Center Featured Card */}
                  <div className="flex justify-center mb-12">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="relative group cursor-pointer"
                        onClick={() => {
                          if (currentBookmark?.movieId !== undefined && currentBookmark?.media_type) {
                            handleClick(
                              currentBookmark.movieId,
                              currentBookmark.media_type as "movie" | "tv",
                            );
                          }
                        }}
                      >
                        {/* Featured Card */}
                        <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl">
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${currentBookmark?.poster_path || currentBookmark?.backdrop_path}`}
                            alt={currentBookmark?.title || "No title"}
                            fill
                            className="object-cover"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Media Type Badge */}
                          <div className="absolute top-4 right-4">
                                                         <span
                               className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                 currentBookmark?.media_type === "tv"
                                   ? "bg-blue-500 text-white"
                                   : "bg-green-500 text-white"
                               }`}
                             >
                               {currentBookmark?.media_type === "tv" ? "TV" : "Movie"}
                             </span>
                          </div>

                          {/* Bookmark Icon */}
                          <div className="absolute top-4 left-4">
                            <div className="w-10 h-10 bg-light-background/90 dark:bg-dark-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                              <Heart className="w-5 h-5 text-red-500 fill-current" />
                            </div>
                          </div>

                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                              <Play className="w-8 h-8 text-white fill-current ml-1" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                              {currentBookmark?.title}
                            </h2>
                            
                            {currentBookmark?.overview && (
                              <p className="text-white/90 text-sm line-clamp-2">
                                {currentBookmark.overview}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Horizontal Card List */}
                  <div className="flex justify-center">
                    <div className="flex gap-4 max-w-6xl overflow-x-auto scrollbar-hide px-4">
                      {bookmarks?.map((bookmark, index) => (
                        <motion.div
                          key={`${bookmark.movieId}-${bookmark.media_type}`}
                          className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                            index === currentIndex 
                              ? 'scale-100 opacity-100' 
                              : 'scale-90 opacity-70 hover:scale-95 hover:opacity-90'
                          }`}
                          onClick={() => goToSlide(index)}
                          whileHover={{ scale: index === currentIndex ? 1.05 : 0.95 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Small Card */}
                          <div className="relative w-32 h-48 rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-blue-400 transition-colors duration-200">
                            <Image
                              src={`https://image.tmdb.org/t/p/w300${bookmark.poster_path || bookmark.backdrop_path}`}
                              alt={bookmark.title || "No title"}
                              fill
                              className="object-cover"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Media Type Badge */}
                            <div className="absolute top-2 right-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  bookmark.media_type === "tv"
                                    ? "bg-blue-500 text-white"
                                    : "bg-green-500 text-white"
                                }`}
                              >
                                {bookmark.media_type === "tv" ? "TV" : "M"}
                              </span>
                            </div>

                            {/* Bookmark Icon */}
                            <div className="absolute top-2 left-2">
                              <div className="w-6 h-6 bg-light-background/90 dark:bg-dark-background/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Heart className="w-3 h-3 text-red-500 fill-current" />
                              </div>
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                              <h3 className="text-white text-xs font-semibold line-clamp-2 text-center">
                                {bookmark.title}
                              </h3>
                            </div>

                            {/* Current Indicator */}
                            {index === currentIndex && (
                              <div className="absolute inset-0 border-2 border-blue-400 rounded-xl" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center mt-8">
                    <div className="flex space-x-2">
                      {bookmarks?.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          disabled={isTransitioning}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentIndex
                              ? 'bg-blue-500 scale-125'
                              : 'bg-light-border dark:bg-dark-border hover:bg-light-input-text dark:hover:bg-dark-input-text'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SignedIn>
      </main>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
