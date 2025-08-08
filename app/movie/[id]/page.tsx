"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
export default function MoviePage() {
  const [search, setSearch] = useState("");
  const { id } = useParams();
  type Movie = {
    poster_path?: string;
    backdrop_path?: string;
    title?: string;
    overview?: string;
    vote_average?: number;
    // add other fields as needed
  };
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data = await res.json();
      setMovie(data);
    }
    fetchMovie();
  }, [id]);

  const fakeSeasons = [1, 2, 3, 4];
  const fakeEpisodes = [
    { title: "Pilot: Part 1", img: "/ep1.jpg" },
    { title: "Raised by Another", img: "/ep2.jpg" },
    { title: "All the Best Cowboys", img: "/ep3.jpg" },
    { title: "Whatever the Case May Be", img: "/ep4.jpg" },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-start gap-x-40">
        <Link href={"/"} className="text-5xl font-bold">
          The <br />
          Movie <br /> Tracker
        </Link>
        <div className="flex-1 flex items-center relative">
          <input
            className="w-full max-w-2xl border border-gray-300 dark:border-[#444444] px-3 py-1.5 pt-2  rounded-full shadow-md bg-[#D9D9D9] dark:bg-dark-input-background focus:outline-none focus:ring-2 focus:ring-[#65656590] dark:text-[#d5d3d3]"
            type="text"
            name="search"
            placeholder="Search a movie or a series"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className=" px-4 py-1.5 bg-dark-border text-white rounded-full absolute right-0.5 top-0.5">
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

      {/* Movie Details */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4 ">
          <h1 className="text-4xl font-bold mb-4">
            {movie?.title || "Loading..."}
          </h1>
          <button className="flex items-center gap-2 text-sm border px-4 py-2 rounded-full">
            <span>🔖</span> Add to watchlist
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-8 ">
          <div className="w-full lg:w-1/3 flex-1/5">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
              alt={movie?.title || "Movie poster"}
              width={110}
              height={200}
              className="rounded-xl w-full object-cover"
            />
          </div>
          <div className="flex flex-1/5 flex-col">
            <div className="flex gap-2 mb-3">
              <span className="border rounded-full px-3 py-1 text-sm">
                Action
              </span>
              <span className="border rounded-full px-3 py-1 text-sm">
                Sci-Fi
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {movie?.overview?.slice(0, 250) || "Loading movie description..."}
            </p>
            <p className="text-sm text-gray-500 mb-2">IMDB Rating</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="font-medium text-sm">
                {movie?.vote_average?.toFixed(1) || "0.0"}/10
              </span>
              <span className="text-gray-500 text-sm">8k Reviews</span>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex-3/5 ">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`}
              alt="Trailer"
              width={600}
              height={250}
              className="rounded-xl object-cover w-full border"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Seasons</h2>
          <div className="flex gap-2 mb-6">
            {fakeSeasons.map((s) => (
              <button key={s} className="px-3 py-1 border rounded-md">
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fakeEpisodes.map((ep, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <Image
                  src={ep.img}
                  alt={ep.title}
                  width={200}
                  height={120}
                  className="object-cover w-full h-[120px]"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold mb-2">{ep.title}</h3>
                  <select className="w-full border rounded px-2 py-1 text-sm">
                    <option>Select Status</option>
                    <option>Watched</option>
                    <option>In Progress</option>
                    <option>Plan to Watch</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
