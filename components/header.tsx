"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useStore";
import { useRef, useEffect } from "react";
import {  Search, X } from "lucide-react";

export default function Header() {
  const {
    search,
    setSearch,
    isInputFocused,
    setIsInputFocused,
    showModal,
    setShowModal,
    searchResults,
    setSearchResults,
    isSearching,
    setIsSearching,
    inputRef,
    setInputRef,
    handleSearch,
    clearSearch,
  } = useAppStore();

  const localInputRef = useRef<HTMLInputElement>(null);

  // Set the inputRef in the store on mount
  useEffect(() => {
    setInputRef(localInputRef);
  }, [setInputRef]);

  // Debounce search
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

  // Show modal when input is focused and has search results
  useEffect(() => {
    if (search.trim() && searchResults) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [search, searchResults, setShowModal]);

  return (
    <header className="mb-10 flex items-center justify-start gap-x-40">
      <Link href={"/"} className="text-5xl font-bold">
        The <br />
        Movie <br /> Tracker
      </Link>
      <div className="flex-1 flex items-center justify-between relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder"
          size={20}
        />
        <form className="w-full relative" onSubmit={(e) => e.preventDefault()}>
          <input
            ref={localInputRef}
            className="w-full pl-10 max-w-2xl border border-gray-300 dark:border-[#444444]/50 px-3 py-1.5 pt-2 rounded-full shadow-md bg-[#D9D9D9] dark:bg-dark-input-background focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:text-[#d5d3d3]"
            type="text"
            name="search"
            placeholder="Search a movie or a series"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              setIsInputFocused(true);
              if (search.trim()) {
                setShowModal(true);
              }
            }}
          
          />
          {search && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-red-500 rounded-full dark:text-white p-0.5 shadow-md"
              onClick={clearSearch}
              tabIndex={-1}
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </form>
      </div>
      <Link
        href="/profile"
        className="text-dark-accent underline w-20 h-20 rounded-full ring-2 ring-dark-border flex items-center justify-center"
      >
        Profile
      </Link>
    </header>
  );
}
