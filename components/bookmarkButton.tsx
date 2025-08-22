"use client";

import { useAppStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { id as uuid } from "@instantdb/react";
import { Heart, Bookmark, Sparkles } from "lucide-react";

interface BookmarkButtonProps {
  movieId: string | number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: "movie" | "tv";
  className?: string;
  variant?: "default" | "minimal" | "floating";
  overview?: string;
}

export default function BookmarkButton({
  movieId,
  title,
  poster_path,
  backdrop_path,
  media_type,
  className = "",
  variant = "minimal",
  overview,
}: BookmarkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  // Floating variant - modern pill design
  if (variant === "floating") {
    return (
      <>
        <SignedOut>
          <SignInButton mode="modal">
            <motion.button
              className={`group relative overflow-hidden rounded-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              aria-label="Sign in to bookmark"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: isHovered ? 360 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Sign in</span>
              </div>
              
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "0%" : "-100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <motion.button
            key={`bookmark-floating-${movieId}-${media_type}-${isBookmarked}`}
            onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
            disabled={isLoading}
            className={`group relative overflow-hidden rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
              isBookmarked
                ? "bg-gradient-to-r from-red-500 to-pink-500 border border-red-400"
                : "bg-gradient-to-r from-blue-500 to-purple-500 border border-blue-400"
            } ${className}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <div className="flex items-center gap-2 relative z-10">
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <motion.div
                  animate={{ 
                    scale: isHovered ? 1.2 : 1,
                    rotate: isHovered ? 15 : 0 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isBookmarked ? (
                    <Heart className="w-5 h-5 text-white fill-current" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-white" />
                  )}
                </motion.div>
              )}
              <span className="font-medium text-white">
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </span>
            </div>

            {/* Sparkle effect for bookmarked state */}
            {isBookmarked && isHovered && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Sparkles className="w-4 h-4 text-white/80" />
              </motion.div>
            )}

            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: isHovered ? "0%" : "-100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </SignedIn>
      </>
    );
  }

  // Minimal variant - clean icon button
  if (variant === "minimal") {
    return (
      <>
        <SignedOut>
          <SignInButton mode="modal">
            <motion.button
              className={`group relative p-3 rounded-xl transition-all duration-300 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 ${className}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Sign in to bookmark"
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" />
            </motion.button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <motion.button
            key={`bookmark-minimal-${movieId}-${media_type}-${isBookmarked}`}
            onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
            disabled={isLoading}
            className={`group relative p-3 rounded-xl transition-all duration-300 ${
              isBookmarked
                ? "bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/25"
                : "bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-200/80 dark:hover:bg-gray-700/80"
            } ${className}`}
            whileHover={{ scale: 1.1, rotate: isBookmarked ? -5 : 5 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <motion.div
                animate={{ scale: isHovered ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isBookmarked ? (
                  <Heart className="w-5 h-5 text-white fill-current" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200" />
                )}
              </motion.div>
            )}
          </motion.button>
        </SignedIn>
      </>
    );
  }

  // Default variant - modern button with text
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <motion.button
            className={`group relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl ${className}`}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.div>
            <span className="text-gray-700 dark:text-gray-300">Sign in to bookmark</span>
            
            {/* Hover effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <motion.button
          key={`bookmark-${movieId}-${media_type}-${isBookmarked}`}
          onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
          disabled={isLoading}
          className={`group relative overflow-hidden flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
            isBookmarked
              ? "bg-gradient-to-r from-red-500 to-pink-500 border border-red-400"
              : "bg-gradient-to-r from-blue-500 to-purple-500 border border-blue-400"
          } ${className}`}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {isLoading ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <motion.div
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? (isBookmarked ? -15 : 15) : 0 
              }}
              transition={{ duration: 0.2 }}
            >
              {isBookmarked ? (
                <Heart className="w-5 h-5 text-white fill-current" />
              ) : (
                <Bookmark className="w-5 h-5 text-white" />
              )}
            </motion.div>
          )}
          
          <span className="text-white font-medium">
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </span>

          {/* Sparkle effect for bookmarked state */}
          {isBookmarked && isHovered && (
            <motion.div
              className="absolute right-2 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <Sparkles className="w-4 h-4 text-white/80" />
            </motion.div>
          )}

          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </SignedIn>
    </>
  );
}
