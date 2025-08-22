"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilteringTabs from "@/components/filteringTabs";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useStore";

interface MediaItem {
  id: string | number;
  movieId?: string | number;
  backdrop_path?: string;
  title?: string;
  name?: string;
  rating?: number;
  media_type?: string;
  first_air_date?: string;
}

export default function Home() {
  const router = useRouter();

  // Get data and functions from store
  const { movieData, fetchMovieData, fetchBookmarks } = useAppStore();
  const { weekTrending, popular, upcoming, popularTV, topRatedTV, isLoading } =
    movieData;

  const [activeTab, setActiveTab] = useState<
    "all" | "currently" | "suggested" | "previously" | "tv"
  >("all");

  // Fetch movie data on component mount
  useEffect(() => {
    fetchMovieData();
    fetchBookmarks();
  }, []);

  // render sections
  const renderSection = (title: string, items: MediaItem[]) => (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 px-1">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4 px-1">
        {items.length < 1 ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full aspect-[13/8] dark:bg-dark-foreground/50 bg-dark-input-border/50 rounded-xl animate-pulse"
            ></div>
          ))
        ) : (
          <AnimatePresence>
            {items.map((item, idx) => {
              const src = typeof item === "string" ? item : item.backdrop_path;
              const rating = typeof item === "object" && item.rating;
              const title = item.title || item.name;
              const isTV = Boolean(
                item.media_type === "tv" || item.first_air_date,
              );

              return (
                <motion.div
                  key={idx}
                  className="relative w-full aspect-[13/8] overflow-hidden rounded-xl bg-white shadow-md hover:ring-2 cursor-pointer group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleClick(item.id, isTV)}
                >
                  <Image
                    src={
                      (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "") +
                      (src || "")
                    }
                    alt={title || "Image"}
                    loading={"lazy"}
                    fill
                    className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {rating && (
                    <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black bg-opacity-70 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-xs font-medium">{rating}</span>
                    </div>
                  )}
                  {isTV && (
                    <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-blue-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      TV
                    </div>
                  )}
                  {/* Mobile overlay with title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:hidden">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                        {title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );

  function handleClick(id: string | number, isTV: boolean = false) {
    if (isTV) {
      router.push(`/tv/${id}`);
    } else {
      router.push(`/movie/${id}`);
    }
  }

  // Show loading state
  if (isLoading && !weekTrending) {
    return (
      <main className="px-1">
        <FilteringTabs setActiveTab={setActiveTab} activeTab={activeTab} />
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm sm:text-base">Loading movie data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-1">
      <FilteringTabs setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* filtering  */}
      {activeTab === "all" && (
        <>
          {renderSection("Currently Trending", weekTrending?.results || [])}
          {renderSection("Popular Movies", popular?.results || [])}
          {renderSection("Popular TV Shows", popularTV?.results || [])}
          {renderSection("Top Rated TV Shows", topRatedTV?.results || [])}
          {renderSection("Upcoming Movies", upcoming?.results || [])}
        </>
      )}

      {/* default listed movies */}
      {activeTab === "currently" &&
        renderSection("Currently Trending", weekTrending?.results || [])}
      {activeTab === "suggested" &&
        renderSection("Upcoming Movies", upcoming?.results || [])}
      {activeTab === "previously" &&
        renderSection("Popular Movies", popular?.results || [])}
      {activeTab === "tv" && (
        <>
          {renderSection("Popular TV Shows", popularTV?.results || [])}
          {renderSection("Top Rated TV Shows", topRatedTV?.results || [])}
        </>
      )}
    </main>
  );
}
