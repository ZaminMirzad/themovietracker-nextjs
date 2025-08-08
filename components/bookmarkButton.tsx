"use client";

import { useAppStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

interface BookmarkButtonProps {
  id: string | number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: 'movie' | 'tv';
}

export default function BookmarkButton({ id, title, poster_path, backdrop_path, media_type }: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useAppStore();
  const bookmarked = isBookmarked(id, media_type);

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(id, media_type);
    } else {
      addBookmark({
        id,
        title,
        poster_path,
        backdrop_path,
        media_type,
        added_at: new Date().toISOString(),
      });
    }
  };

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <motion.button
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Sign in to bookmark</span>
          </motion.button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <motion.button
          onClick={handleBookmark}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            bookmarked
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg 
            className={`w-5 h-5 ${bookmarked ? 'fill-current' : 'stroke-current'}`} 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
            />
          </svg>
          <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </motion.button>
      </SignedIn>
    </>
  );
}
