"use client";

import { useAppStore } from "@/store/useStore";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import SearchModal from "./searchModal";
import { useRouter } from "next/navigation";

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
    <header className="w-full mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-4xl font-bold text-light-foreground dark:text-dark-foreground">
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
                className="text-light-input-background cursor-pointer hover:text-white dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
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
  );
}
