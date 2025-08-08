"use client";

import { useAppStore } from "@/store/useStore";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  const {
    search,
    setSearch,
    isInputFocused,
    setIsInputFocused,
    setShowModal,
    setSearchResults,
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
      setSearchResults(null);
      return;
    }
    const handler = setTimeout(() => {
      handleSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, handleSearch, setSearchResults]);

  const onFocus = () => {
    setIsInputFocused(true);
    if (search.trim()) setShowModal(true);
  };

  const onBlur = () => {
    setTimeout(() => setIsInputFocused(false), 200);
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-4xl font-bold text-dark-foreground">The <br /> Movie <br /> Tracker</h1>
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
            className="w-full px-4 py-2 bg-light-background  border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="w-4 h-4 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
              Sign In
            </button>
          </SignInButton>
          <Link 
            href="/signup" 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Sign Up
          </Link>
        </SignedOut>
        <SignedIn>
          <Link 
            href="/bookmarks" 
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Link>
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
        </SignedIn>
      </div>
    </header>
  );
}
