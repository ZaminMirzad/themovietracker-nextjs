"use client";

import { useAppStore } from "@/store/useStore";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, useUser, SignOutButton } from "@clerk/nextjs";

export default function ProfilePage() {
  const { bookmarks } = useAppStore();
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-[#1e1e1e] p-6">
      <SignedOut>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Sign in to view your profile</h1>
            <p className="text-gray-400 mb-8">You need to be signed in to access your profile.</p>
            <SignInButton mode="modal">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#2a2a2a] rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user?.fullName || user?.username || "User"}
                  width={80}
                  height={80}
                  className="rounded-full h-auto"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {(user?.firstName?.[0] || user?.username?.[0] || 'U')}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user?.fullName || user?.username}</h1>
                <p className="text-gray-400 mb-4">{user?.primaryEmailAddress?.emailAddress}</p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{bookmarks.length}</div>
                    <div className="text-sm text-gray-400">Bookmarks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {bookmarks.filter(b => b.media_type === 'movie').length}
                    </div>
                    <div className="text-sm text-gray-400">Movies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {bookmarks.filter(b => b.media_type === 'tv').length}
                    </div>
                    <div className="text-sm text-gray-400">TV Shows</div>
                  </div>
                </div>
              </div>

              <SignOutButton>
                <motion.button
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              </SignOutButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              className="bg-[#2a2a2a] rounded-xl p-6 cursor-pointer hover:bg-[#333333] transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/bookmarks" className="block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">My Bookmarks</h3>
                    <p className="text-gray-400">View all your bookmarked movies and shows</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              className="bg-[#2a2a2a] rounded-xl p-6 cursor-pointer hover:bg-[#333333] transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/" className="block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Discover</h3>
                    <p className="text-gray-400">Find new movies and TV shows to watch</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {bookmarks.length > 0 && (
            <div className="bg-[#2a2a2a] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Bookmarks</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bookmarks.slice(0, 8).map((bookmark, index) => (
                  <motion.div
                    key={`${bookmark.movieId}-${bookmark.media_type}`}
                    className="bg-[#333333] rounded-lg overflow-hidden cursor-pointer hover:bg-[#444444] transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={`/${bookmark.media_type}/${bookmark.movieId}`}>
                      <div className="relative">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${bookmark.poster_path || bookmark.backdrop_path}`}
                          alt={bookmark.title}
                          width={200}
                          height={300}
                          className="w-full h-auto object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bookmark.media_type === 'tv' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-green-500 text-white'
                          }`}>
                            {bookmark.media_type === 'tv' ? 'TV' : 'Movie'}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-white font-medium text-sm line-clamp-2">
                          {bookmark.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {bookmarks.length > 8 && (
                <div className="text-center mt-6">
                  <Link 
                    href="/bookmarks" 
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                  >
                    View all {bookmarks.length} bookmarks →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </SignedIn>
    </main>
  );
}
