"use client";

import { useAppStore } from "@/store/useStore";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BookmarksPage() {
  const { bookmarks } = useAppStore();
  const router = useRouter();
  const { user } = useUser();

  const handleClick = (id: string | number, mediaType: "movie" | "tv") => {
    if (mediaType === "tv") {
      router.push(`/tv/${id}`);
    } else {
      router.push(`/movie/${id}`);
    }
  };

  return (
    <main className="min-h-screen bg-light-background dark:bg-dark-background text-light-input-text p-6">
      <SignedOut>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Sign in to view your bookmarks
            </h1>
            <p className="text-gray-400 mb-8">
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Bookmarks</h1>
            <p className="text-gray-400">
              Welcome back, {user?.fullName || user?.username}! You have{" "}
              {bookmarks.length} bookmarked items.
            </p>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                No bookmarks yet
              </h2>
              <p className="text-gray-400 mb-6">
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
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {bookmarks.map((bookmark, index) => (
                <motion.div
                  key={`${bookmark.id}-${bookmark.media_type}`}
                  className="bg-light-input-background text-light-input-text rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer group"
                  onClick={() => handleClick(bookmark.id, bookmark.media_type)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="relative">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${
                        bookmark.poster_path || bookmark.backdrop_path
                      }`}
                      alt={bookmark.title}
                      width={300}
                      height={450}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bookmark.media_type === "tv"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {bookmark.media_type === "tv" ? "TV" : "Movie"}
                      </span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <svg
                        className="w-5 h-5 text-blue-500 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {bookmark.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Added {new Date(bookmark.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SignedIn>
    </main>
  );
}
