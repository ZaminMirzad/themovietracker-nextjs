"use client";

import { useAppStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState, useCallback } from "react";

interface BookmarkButtonProps {
  movieId: string | number | undefined;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: 'movie' | 'tv';
  className?: string;
  variant?: 'default' | 'minimal';
}

export default function BookmarkButton({ 
  movieId, 
  title, 
  poster_path, 
  backdrop_path, 
  media_type, 
  className = '',
  variant = 'default' 
}: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure hooks are always called, handle invalid movieId in render
  const isBookmarkedState = movieId ? isBookmarked(movieId, media_type) : false;

  const handleBookmark = useCallback(async () => {
    if (!movieId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const bookmarkData = {
        movieId,
        title,
        poster_path: poster_path,
        media_type: media_type,
        backdrop_path: backdrop_path,
      };
      
      if (isBookmarkedState) {
        removeBookmark(movieId, media_type);
        
        // Remove from InstantDB
        if (typeof window !== 'undefined' && (window as any).db) {
          try {
            // This would need to be implemented based on your InstantDB schema
            // For now, we'll use a placeholder approach
            console.log('Removing bookmark from InstantDB:', movieId, media_type);
          } catch (err) {
            console.error('Error removing from InstantDB:', err);
          }
        }
      } else {
        addBookmark(bookmarkData);
        
        // Add to InstantDB
        if (typeof window !== 'undefined' && (window as any).db) {
          try {
            (window as any).db.transact(
              (window as any).db.tx.bookmarks[(window as any).id()].create({
                ...bookmarkData,
                added_at: new Date().toISOString(),
              })
            );
          } catch (err) {
            console.error('Error adding to InstantDB:', err);
          }
        }
      }
    } catch (err) {
      setError('Failed to update bookmark');
      console.error('Bookmark error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isBookmarkedState, movieId, title, poster_path, backdrop_path, media_type, addBookmark, removeBookmark, isLoading]);

  const bookmarkIcon = (
    <AnimatePresence mode="wait">
      <motion.div
        key={isBookmarkedState ? 'bookmarked' : 'not-bookmarked'}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <svg 
          className={`w-5 h-5 transition-colors duration-200 ${
            isBookmarkedState ? 'text-white' : 'text-gray-400'
          }`} 
          fill={isBookmarkedState ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
          />
        </svg>
      </motion.div>
    </AnimatePresence>
  );

  if (variant === 'minimal') {
    return (
      <>
        <SignedOut>
          <SignInButton mode="modal">
            <motion.button
              className={`p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Sign in to bookmark"
            >
              {bookmarkIcon}
            </motion.button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <motion.button
            onClick={handleBookmark}
            disabled={isLoading || !movieId}
            className={`p-2 rounded-full transition-all duration-200 ${
              isBookmarkedState 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            } ${className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isBookmarkedState ? 'Remove bookmark' : 'Add bookmark'}
          >
            {bookmarkIcon}
          </motion.button>
        </SignedIn>
      </>
    );
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <motion.button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              className || 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {bookmarkIcon}
            <span>Sign in to bookmark</span>
          </motion.button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <motion.button
          onClick={handleBookmark}
          disabled={isLoading || !movieId}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isBookmarkedState 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          } ${className}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            bookmarkIcon
          )}
          <span>{isBookmarkedState ? 'Bookmarked' : 'Bookmark'}</span>
        </motion.button>
      </SignedIn>
    </>
  );
}
