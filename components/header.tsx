"use client";

import { useAppStore } from "@/store/useStore";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import SearchModal from "./searchModal";
import { useRouter } from "next/navigation";
import { Search, Home, Bookmark, User, Film } from "lucide-react";

export default function Header() {
  const {
    search,
    setSearch,
    showModal,
    setShowModal,
    searchResults,
    isSearching,
    setInputRef,
    handleSearch,
    clearSearch,
  } = useAppStore();

  const inputRefLocal = useRef<HTMLInputElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    setInputRef(inputRefLocal);
  }, [setInputRef]);

  useEffect(() => {
    if (!search.trim()) {
      handleSearch("");
      return;
    }
    const handler = setTimeout(() => {
      handleSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, handleSearch]);

  const onFocus = () => {
    if (search.trim() || searchResults?.length) setShowModal(true);
  };

  const onBlur = () => {
    setTimeout(() => setShowModal(false), 150);
  };

  const router = useRouter();

  const handleSearchItemClick = (id: string | number, mediaType?: string) => {
    const path = mediaType === "tv" ? `/tv/${id}` : `/movie/${id}`;
    setShowModal(false);
    clearSearch();
    setTimeout(() => {
      router.push(path);
    }, 100);
  };


  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block w-full mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                The <br /> Movie <br /> Tracker
              </h1>
            </Link>

            <div className="flex-1 max-w-md mx-8">
              <form className="relative">
                <input
                  ref={inputRefLocal}
                  type="text"
                  placeholder="Search movies and TV shows..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  className="w-full px-4 py-2 bg-light-background dark:bg-dark-background border border-gray-600 rounded-full text-light-foreground dark:text-dark-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-light-input-border dark:focus:ring-dark-accent"
                />
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-light-input-border rounded-full animate-spin"></div>
                  </div>
                )}
              </form>

              <SearchModal
                open={showModal}
                results={searchResults || []}
                onClose={() => setShowModal(false)}
                onItemClick={handleSearchItemClick}
              />
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-dark-accent cursor-pointer hover:bg-dark-accent-hover text-light-input-background dark:text-dark-foreground px-4 py-2 rounded-lg transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <Link
                  href="/signup"
                  className="text-light-input-background cursor-pointer hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/bookmarks"
                  className="group relative p-2 rounded-xl transition-all duration-300 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/20 hover:border-red-500/40 backdrop-blur-sm"
                >
                  <svg
                    className="w-6 h-6 text-red-500 group-hover:text-red-600 transition-colors duration-200"
                    fill="none"
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
                </Link>
                <UserButton
                  appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header - Simplified */}
      <header className="md:hidden w-full mb-4 sticky top-0 z-40 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/10">
        <div className="px-4 py-2">
          <div className="flex items-center justify-start">
            {/* Logo - Centered */}
            <Link href="/" className="flex items-center gap-2" >
              <h1 className="text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <Film className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                TheMovieTracker
              </span>
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/10 rounded-full m-2 backdrop-blur-sm dark:bg-dark-background/10 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-around">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-white"
          >
            <Home className="w-5 h-5 text-gray-800 dark:text-white" />
            <span className="text-xs font-medium text-gray-800 dark:text-white">Home</span>
          </Link>

          <SignedIn>
            <Link
              href="/bookmarks"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-white"
            >
              <Bookmark className="w-5 h-5 text-gray-800 dark:text-white" />
              <span className="text-xs font-medium text-gray-800 dark:text-white">Bookmarks</span>
            </Link>
          </SignedIn>

          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-white"
          >
            <Search className="w-5 h-5 text-gray-800 dark:text-white" />
            <span className="text-xs font-medium text-gray-800 dark:text-white">Search</span>
          </button>

          <SignedIn>
            <div className="flex flex-col items-center gap-1 p-2 text-gray-800 dark:text-white">
              <UserButton
                appearance={{ 
                  elements: { 
                    userButtonAvatarBox: "w-5 h-5",
                    userButtonPopoverCard: "shadow-lg"
                  } 
                }}
              />
              <span className="text-xs font-medium text-gray-800 dark:text-white">Profile</span>
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href="/login"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-white"
            >
              <User className="w-5 h-5 text-gray-800 dark:text-white" />
              <span className="text-xs font-medium text-gray-800 dark:text-white">Sign In</span>
            </Link>
          </SignedOut>
        </div>

        {/* Expandable Search Bar - Below bottom navigation */}
        {isSearchExpanded && (
          <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <form className="relative">
              <input
                ref={inputRefLocal}
                type="text"
                placeholder="Search movies and TV shows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                className="w-full px-4 py-3 bg-white/10 dark:bg-gray-700/10 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                </div>
              )}
            </form>

            <SearchModal
              open={showModal}
              results={searchResults || []}
              onClose={() => setShowModal(false)}
              onItemClick={handleSearchItemClick}
            />
          </div>
        )}
      </nav>
    </>
  );
}
