"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilteringTabs from "@/components/filteringTabs";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  type TrendingResult = {
    backdrop_path?: string;
    title?: string;
    rating?: number;
    [key: string]: any;
  };

  type TrendingData = {
    results: TrendingResult[];
    [key: string]: any;
  };
  const [weekTrending, setWeekTrending] = useState<TrendingData | null>(null);
  const [popular, setPopular] = useState<TrendingData | null>(null);
  const [upcoming, setUpcoming] = useState<TrendingData | null>(null);

  const [activeTab, setActiveTab] = useState<
    "all" | "currently" | "suggested" | "previously"
  >("all");

  useEffect(() => {
    async function fetchTrending() {
      const [trendingRes, popularRes, upcomingRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/all/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
      ]);
      const [trendingData, popularData, upcomingData] = await Promise.all([
        trendingRes.json(),
        popularRes.json(),
        upcomingRes.json(),
      ]);
      setWeekTrending(trendingData);
      setPopular(popularData);
      setUpcoming(upcomingData);
    }

    // Delay rendering for 1 second
    setTimeout(() => fetchTrending(), 1000);
  }, []);

  const handleClick = (id: string) => {
    console.log("Clicked movie ID:", id);
    // Navigate to the movie details page using nextjs
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
              className="w-[130px] min-w-[130px] h-[195px] dark:bg-dark-foreground/50 bg-dark-input-border/50 rounded-xl animate-pulse"
            ></div>
          ))
        ) : (
          <AnimatePresence>
            {items.map((item, idx) => {
              const src = typeof item === "string" ? item : item.backdrop_path;
              const rating = typeof item === "object" && item.rating;
              return (
                <motion.div
                  key={idx}
                  className="relative w-[130px] min-w-[130px] overflow-hidden rounded-xl bg-white shadow-md hover:ring-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleClick(item.id)}
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + src}
                    alt={item.title || item.name}
                    width={130}
                    height={195}
                    className="rounded-lg object-cover overflow-hidden"
                  />
                  {rating && (
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {rating}
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

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-start gap-x-40">
        <Link href={"/"} className="text-5xl font-bold">
          The <br />
          Movie <br /> Tracker
        </Link>
        <div className="flex-1 flex items-center justify-between relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-input-placeholder"
            size={20}
          />
          <input
            className="w-full  pl-10 max-w-2xl border border-gray-300 dark:border-[#444444]/50 px-3 py-1.5 pt-2  rounded-full shadow-md bg-[#D9D9D9] dark:bg-dark-input-background focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:text-[#d5d3d3]"
            type="text"
            name="search"
            placeholder="Search a movie or a series"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className=" px-4 py-1.5 bg-dark-border/90 text-white rounded-full absolute right-0.5 top-0.5 flex items-center justify-center">
            Search
          </button>
        </div>
        <Link
          href="/profile"
          className="text-dark-accent underline w-20 h-20 rounded-full ring-2 ring-dark-border flex items-center justify-center"
        >
          Profile
        </Link>
      </div>

      <FilteringTabs setActiveTab={setActiveTab} activeTab={activeTab} />

      {/* filtering  */}
      {activeTab === "all" && (
        <>
          {renderSection("Currently Trending", weekTrending?.results || [])}
          {renderSection("Suggested To Watch", upcoming?.results || [])}
          {renderSection("Popular  Watched", popular?.results || [])}
        </>
      )}

      {/* default listed movies */}
      {activeTab === "currently" &&
        renderSection("Currently Trending", weekTrending?.results || [])}
      {activeTab === "suggested" &&
        renderSection("Suggested To Watch", upcoming?.results || [])}
      {activeTab === "previously" &&
        renderSection("Popular  Watched", popular?.results || [])}

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
