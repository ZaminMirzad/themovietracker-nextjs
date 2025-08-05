"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const movieData = {
  currentlyWatching: ["/grayman.jpg", "/houseofthedragon.jpg"],
  suggested: [
    { src: "/grayman.jpg", rating: 8.7 },
    { src: "/houseofthedragon.jpg", rating: 8.7 },
    { src: "/starwars.jpg", rating: 8.7 },
    { src: "/blackwidow.jpg" },
  ],
  previouslyWatched: [
    "/grayman.jpg",
    "/starwars.jpg",
    "/blackwidow.jpg",
    "/alien.jpg",
    "/joker.jpg",
    "/suicidesquad.jpg",
    "/inception.jpg",
  ],
};

export default function Home() {
  const [search, setSearch] = useState("");

  // render sections
  const renderSection = (title: string, items: any[]) => (
    <div className="mb-8">
      <h2 className="text-lg mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto">
        {items.map((item, idx) => {
          const src = typeof item === "string" ? item : item.src;
          const rating = typeof item === "object" && item.rating;
          return (
            <div
              key={idx}
              className="relative w-[130px] min-w-[130px] overflow-hidden rounded-xl bg-white shadow-md"
            >
              <Image
                src={src}
                alt="Movie Poster"
                width={130}
                height={195}
                className="rounded-xl object-cover"
              />
              {rating && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {rating}
                </div>
              )}
            </div>
          );
        })}
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
        <div className="flex-1 flex items-center relative">
          <input
            className="w-full max-w-2xl border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2  rounded-full shadow-md bg-[#D9D9D9] dark:bg-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:text-[#d5d3d3]"
            type="text"
            name="search"
            placeholder="Search a movie or a series"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className=" px-4 py-1.5 bg-dark-input-placeholder text-white rounded-full absolute right-6.5 top-0.5">
            Search
          </button>
        </div>
        <Link href="/profile" className="text-blue-600 underline">
          Profile
        </Link>
      </div>

      {/* default listed movies */}
      {renderSection("Currently Watching", movieData.currentlyWatching)}
      {renderSection("Suggested To Watch", movieData.suggested)}
      {renderSection("Previously Watched", movieData.previouslyWatched)}
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
