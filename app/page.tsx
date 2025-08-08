"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilteringTabs from "@/components/filteringTabs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  type TrendingResult = {
    backdrop_path?: string;
    title?: string;
    name?: string;
    rating?: number;
    media_type?: string;
    [key: string]: any;
  };

  type TrendingData = {
    results: TrendingResult[];
    [key: string]: any;
  };
  
  const [weekTrending, setWeekTrending] = useState<TrendingData | null>(null);
  const [popular, setPopular] = useState<TrendingData | null>(null);
  const [upcoming, setUpcoming] = useState<TrendingData | null>(null);
  const [popularTV, setPopularTV] = useState<TrendingData | null>(null);
  const [topRatedTV, setTopRatedTV] = useState<TrendingData | null>(null);

  const [activeTab, setActiveTab] = useState<
    "all" | "currently" | "suggested" | "previously" | "tv"
  >("all");

  useEffect(() => {
    async function fetchTrending() {
      const [trendingRes, popularRes, upcomingRes, popularTVRes, topRatedTVRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/all/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
      ]);
      const [trendingData, popularData, upcomingData, popularTVData, topRatedTVData] = await Promise.all([
        trendingRes.json(),
        popularRes.json(),
        upcomingRes.json(),
        popularTVRes.json(),
        topRatedTVRes.json(),
      ]);
      setWeekTrending(trendingData);
      setPopular(popularData);
      setUpcoming(upcomingData);
      setPopularTV(popularTVData);
      setTopRatedTV(topRatedTVData);
    }

    // Delay rendering for 1 second
    setTimeout(() => fetchTrending(), 1000);
  }, []);

  const handleSearchModalItemClick = (id: string | number) => {
    router.push(`/movie/${id}`);
  };

  console.log("Week Trending Data:", weekTrending);

  // render sections
  const renderSection = (title: string, items: any[]) => (
    <div className="mb-8">
      <h2 className="text-lg mb-3">{title}</h2>
      <div className="flex gap-4 overflow-hidden flex-wrap p-2">
        {items.length < 1 ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="w-[130px] min-w-[130px] h-[100px] dark:bg-dark-foreground/50 bg-dark-input-border/50 rounded-xl animate-pulse"
            ></div>
          ))
        ) : (
          <AnimatePresence>
            {items.map((item, idx) => {
              const src = typeof item === "string" ? item : item.backdrop_path;
              const rating = typeof item === "object" && item.rating;
              const title = item.title || item.name;
              const isTV = item.media_type === 'tv' || item.first_air_date;
              
              return (
                <motion.div
                  key={idx}
                  className="relative w-[130px] min-w-[130px] overflow-hidden rounded-xl bg-white shadow-md hover:ring-2 cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleClick(item.id, isTV)}
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + src}
                    alt={title}
                    width={130}
                    height={70}
                    className="rounded-lg object-cover overflow-hidden"
                  />
                  {rating && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {rating}
                    </div>
                  )}
                  {isTV && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      TV
                    </div>
                  )}
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
  
  return (
    <main>
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

      {/* navigation links */}
      <nav>
        {/* Prefetched when the link is hovered or enters the viewport */}
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </nav>

      {/* built with love by */}
      <p className="text-sm text-gray-400 place-self-end ">
        Built with <span className="text-red-500">❤️</span> by Zamin Mirzad
      </p>
    </main>
  );
}
