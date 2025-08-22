"use client";

import { useAppStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { id as uuid } from "@instantdb/react";

interface BookmarkButtonProps {
  movieId: string | number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: "movie" | "tv";
  className?: string;
  variant?: "default" | "minimal";
  overview?: string;
}

export default function BookmarkButton({
  movieId,
  title,
  poster_path,
  backdrop_path,
  media_type,
  className = "",
  variant = "default",
  overview,
}: BookmarkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToBookmark, bookmarks, removeBookmark } = useAppStore((state) => state);

  // Check if this movie is bookmarked and get the bookmark data
  const existingBookmark = bookmarks.find(
    (bookmark) => bookmark.movieId === movieId,
  );
  const isBookmarked = !!existingBookmark;

  // handle adding to instantdb bookmark
  const handleBookmark = async () => {
    const addId = uuid(); // Generate ID when needed
    if (!addId) {
      console.error("No addId generated");
      return;
    }

    try {
      setIsLoading(true);
      await addToBookmark({
        id: addId,
        movieId,
        title,
        poster_path,
        backdrop_path,
        media_type,
        overview,
        added_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle removing from instantdb bookmark if bookmark is in the bookmarks array
  const handleRemoveBookmark = async () => {
    if (!existingBookmark?.id) {
      console.error("No bookmark found to remove");
      return;
    }
    
    try {
      setIsLoading(true);
      await removeBookmark(existingBookmark.id);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const bookmarkIcon = (
    <AnimatePresence mode="wait">
      <motion.div
        key={`icon-${movieId}-${media_type}-${isBookmarked}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            isBookmarked ? "text-white" : "text-gray-400"
          }`}
          fill={isBookmarked ? "currentColor" : "none"}
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

  if (variant === "minimal") {
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
            key={`bookmark-minimal-${movieId}-${media_type}-${isBookmarked}`}
            onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all duration-200 ${
              isBookmarked
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            } ${className}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
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
              className ||
              "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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
          key={`bookmark-${movieId}-${media_type}-${isBookmarked}`}
          onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isBookmarked
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          } ${className}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            bookmarkIcon
          )}
          <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </motion.button>
      </SignedIn>
    </>
  );
}
