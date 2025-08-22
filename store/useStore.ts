import { create } from "zustand";
import { RefObject } from "react";

/*
 * MovieTracker Store with InstantDB Synchronization
 *
 * To initialize the store and sync with InstantDB when your app starts:
 *
 * In your main layout or app component:
 * ```tsx
 * import { useAppStore } from '@/store/useStore';
 *
 * useEffect(() => {
 *   useAppStore.getState().initializeStore();
 * }, []);
 * }
 * ```
 *
 * This will:
 * 1. Sync bookmarks from InstantDB
 * 2. Fetch initial movie data
 * 3. Ensure bookmarks are properly synchronized
 */

interface ISearchResult {
  id: string | number;
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  name?: string;
  media_type?: string;
}

interface IBookmark {
  id: string | number;
  movieId: string | number;
  title: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: "movie" | "tv";
  added_at?: string;
}

interface ITrendingResult {
  id: string | number;
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  name?: string;
  rating?: number;
  media_type?: string;
  [key: string]: any;
}

interface ITrendingData {
  results: ITrendingResult[];
  [key: string]: any;
}

interface IMovieData {
  weekTrending: ITrendingData | null;
  popular: ITrendingData | null;
  upcoming: ITrendingData | null;
  popularTV: ITrendingData | null;
  topRatedTV: ITrendingData | null;
  lastFetched: number | null;
  isLoading: boolean;
}

interface IMovieDetails {
  id?: number | string;
  movieId?: number | string;
  poster_path?: string;
  backdrop_path?: string;
  title?: string;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  production_companies?: Array<{
    id: number;
    name: string;
    logo_path?: string;
  }>;
}

interface ITVDetails {
  id?: number | string;
  movieId?: number | string;
  poster_path?: string;
  backdrop_path?: string;
  name?: string;
  overview?: string;
  vote_average?: number;
  first_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  genres?: Array<{ id: number; name: string }>;
}

interface ICast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  order: number;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for_department?: string;
  popularity?: number;
}

interface ICrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path?: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for_department?: string;
  popularity?: number;
}

interface ITrailer {
  key: string;
  name: string;
  site: string;
  type: string;
}

interface IDetailPageData {
  movie: IMovieDetails | null;
  tvShow: ITVDetails | null;
  cast: ICast[];
  crew: ICrew[];
  seasons: any[];
  relatedMovies: ITrendingResult[];
  relatedShows: ITrendingResult[];
  trailers: ITrailer[];
  episodeTrailers: ITrailer[];
  lastFetched: number | null;
  isLoading: boolean;
  currentId: string | null;
  currentType: "movie" | "tv" | null;
}

interface IAppState {
  // Search state
  search: string;
  searchResults: ISearchResult[] | null;
  isSearching: boolean;
  showModal: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  defaultPage: string;

  // Search actions
  setSearch: (search: string) => void;
  setSearchResults: (results: ISearchResult[] | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  setShowModal: (show: boolean) => void;
  setInputRef: (ref: RefObject<HTMLInputElement | null>) => void;
  setDefaultPage: (page: string) => void;

  // User state
  user: {
    userId: string;
    userName: string;
  };

  // Movie/TV Data
  movieData: IMovieData;
  setMovieData: (data: Partial<IMovieData>) => void;
  fetchMovieData: () => Promise<void>;
  clearMovieData: () => void;

  // Detail Page Data
  detailPageData: IDetailPageData;
  setDetailPageData: (data: Partial<IDetailPageData>) => void;
  fetchMovieDetails: (id: string) => Promise<void>;
  fetchTVDetails: (id: string) => Promise<void>;
  clearDetailPageData: () => void;

  // Bookmarks
  bookmarks: IBookmark[];
  setBookmarks: (bookmarks: IBookmark[]) => void;
  addToBookmark: (bookmark: IBookmark) => void;
  removeBookmark: (id: string | number) => void;
  fetchBookmarks: () => Promise<void>;

  // Search functionality
  handleSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  navigateToDefault: () => void;

  // Store initialization
  initializeStore: () => Promise<void>;
}

// useAppStore
export const useAppStore = create<IAppState>((set, get) => ({
  // Search state
  search: "",
  setSearch: (val) => set({ search: val }),
  showModal: false,
  setShowModal: (val) => set({ showModal: val }),
  searchResults: null,
  setSearchResults: (results) => set({ searchResults: results }),
  isSearching: false,
  setIsSearching: (val) => set({ isSearching: val }),
  inputRef: { current: null },
  setInputRef: (ref) => set({ inputRef: ref }),
  user: {
    userId: "",
    userName: "",
  },

  // Bookmarks state first update every 1 hour then check local storage for updates if no new updates then use local storage
  bookmarks: [],
  setBookmarks: (bookmarks: IBookmark[]) => {
    set({ bookmarks });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  },

  // Default page configuration
  defaultPage: "/",
  setDefaultPage: (page) => set({ defaultPage: page }),

  // Movie/TV Data state
  movieData: {
    weekTrending: null,
    popular: null,
    upcoming: null,
    popularTV: null,
    topRatedTV: null,
    lastFetched: null,
    isLoading: false,
  },

  // set movie data
  setMovieData: (data) => {
    const state = get();
    set({
      movieData: {
        ...state.movieData,
        ...data,
        lastFetched: Date.now(),
      },
    });
  },

  // fetch movie data
  fetchMovieData: async () => {
    const state = get();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Check if data is still fresh
    if (
      state.movieData.lastFetched &&
      Date.now() - state.movieData.lastFetched < CACHE_DURATION &&
      state.movieData.weekTrending
    ) {
      return; // Data is still fresh, no need to refetch
    }

    state.setMovieData({ isLoading: true });

    try {
      const [weekTrending, popular, upcoming, popularTV, topRatedTV] =
        await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ).then((res) => res.json()),
        ]);

      state.setMovieData({
        weekTrending,
        popular,
        upcoming,
        popularTV,
        topRatedTV,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching movie data:", error);
      state.setMovieData({ isLoading: false });
    }
  },

  // clear movie data
  clearMovieData: () => {
    set({
      movieData: {
        weekTrending: null,
        popular: null,
        upcoming: null,
        popularTV: null,
        topRatedTV: null,
        lastFetched: null,
        isLoading: false,
      },
    });
  },

  // Detail Page Data state
  detailPageData: {
    movie: null,
    tvShow: null,
    cast: [],
    crew: [],
    seasons: [],
    relatedMovies: [],
    relatedShows: [],
    trailers: [],
    episodeTrailers: [],
    lastFetched: null,
    isLoading: false,
    currentId: null,
    currentType: null,
  },
  setDetailPageData: (data) => {
    const state = get();
    set({
      detailPageData: {
        ...state.detailPageData,
        ...data,
        lastFetched: Date.now(),
      },
    });
  },

  // fetch movie details
  fetchMovieDetails: async (id: string) => {
    const state = get();
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for detail pages

    // Check if data is still fresh for the same movie
    if (
      state.detailPageData.currentId === id &&
      state.detailPageData.currentType === "movie" &&
      state.detailPageData.lastFetched &&
      Date.now() - state.detailPageData.lastFetched < CACHE_DURATION &&
      state.detailPageData.movie
    ) {
      return; // Data is still fresh, no need to refetch
    }

    state.setDetailPageData({
      isLoading: true,
      currentId: id,
      currentType: "movie",
    });

    try {
      const [movieRes, creditsRes, relatedRes, trailersRes] = await Promise.all(
        [
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          ),
        ]
      );

      const [movieData, creditsData, relatedData, trailersData] =
        await Promise.all([
          movieRes.json(),
          creditsRes.json(),
          relatedRes.json(),
          trailersRes.json(),
        ]);

      const officialTrailers =
        trailersData.results?.filter(
          (trailer: ITrailer) =>
            trailer.type === "Trailer" && trailer.site === "YouTube"
        ) || [];

      state.setDetailPageData({
        movie: movieData,
        cast: creditsData.cast || [],
        crew: creditsData.crew || [],
        relatedMovies: relatedData.results || [],
        trailers: officialTrailers,
        tvShow: null,
        seasons: [],
        relatedShows: [],
        episodeTrailers: [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
      state.setDetailPageData({ isLoading: false });
    }
  },

  // fetch tv details
  fetchTVDetails: async (id: string) => {
    const state = get();
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for detail pages

    // Check if data is still fresh for the same TV show
    if (
      state.detailPageData.currentId === id &&
      state.detailPageData.currentType === "tv" &&
      state.detailPageData.lastFetched &&
      Date.now() - state.detailPageData.lastFetched < CACHE_DURATION &&
      state.detailPageData.tvShow
    ) {
      return; // Data is still fresh, no need to refetch
    }

    state.setDetailPageData({
      isLoading: true,
      currentId: id,
      currentType: "tv",
    });

    try {
      const tvRes = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const tvData = await tvRes.json();

      // Fetch all seasons data
      const seasonsData = [];
      if (tvData.number_of_seasons) {
        for (let i = 1; i <= tvData.number_of_seasons; i++) {
          const seasonRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/season/${i}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
          );
          const seasonData = await seasonRes.json();
          seasonsData.push(seasonData);
        }
      }

      // Fetch trailers and related shows
      const [trailersRes, relatedRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
        fetch(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        ),
      ]);

      const [trailersData, relatedData] = await Promise.all([
        trailersRes.json(),
        relatedRes.json(),
      ]);

      const officialTrailers =
        trailersData.results?.filter(
          (trailer: ITrailer) =>
            trailer.type === "Trailer" && trailer.site === "YouTube"
        ) || [];

      state.setDetailPageData({
        tvShow: tvData,
        seasons: seasonsData,
        relatedShows: relatedData.results || [],
        trailers: officialTrailers,
        movie: null,
        cast: [],
        crew: [],
        relatedMovies: [],
        episodeTrailers: [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching TV details:", error);
      state.setDetailPageData({ isLoading: false });
    }
  },

  // clear detail page data
  clearDetailPageData: () => {
    set({
      detailPageData: {
        movie: null,
        tvShow: null,
        cast: [],
        crew: [],
        seasons: [],
        relatedMovies: [],
        relatedShows: [],
        trailers: [],
        episodeTrailers: [],
        lastFetched: null,
        isLoading: false,
        currentId: null,
        currentType: null,
      },
    });
  },

  // fetch bookmarks and set to store bookmarks and update react state
  fetchBookmarks: async () => {
    const response = await fetch("/api/bookmarks");
    const data = await response.json();
    set({ bookmarks: data?.bookmarks || [] });
    // save to local storage
    localStorage.setItem("bookmarks", JSON.stringify(data?.bookmarks || []));
  },

  // add to instantdb bookmark
  addToBookmark: async (bookmark: IBookmark) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookmark }),
      });
      const data = await response.json();

      if (data?.bookmarks) {
        // Update store state with new bookmarks
        set({ bookmarks: data.bookmarks });
        // Update local storage
        localStorage.setItem("bookmarks", JSON.stringify(data.bookmarks));
      }

      return data;
    } catch (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
  },

  // remove bookmark
  removeBookmark: async (id: string | number) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookmark: { id: id } }),
      });

      const data = await response.json();

      if (data?.bookmarks) {
        // Update store state with new bookmarks
        set({ bookmarks: data.bookmarks });
        // Update local storage
        localStorage.setItem("bookmarks", JSON.stringify(data.bookmarks));
      }

      return data;
    } catch (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
  },

  // Search state
  handleSearch: async (query: string) => {
    const state = get();
    if (!query.trim()) {
      state.setSearchResults(null);
      state.setIsSearching(false);
      state.setShowModal(false);
      return;
    }
    state.setIsSearching(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      state.setSearchResults(data.results || []);
      if (data.results && data.results.length > 0) {
        state.setShowModal(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      state.setSearchResults(null);
    } finally {
      state.setIsSearching(false);
    }
  },

  clearSearch: () => {
    const state = get();
    state.setSearch("");
    state.setSearchResults(null);
    state.setShowModal(false);
    state.inputRef.current?.focus();
  },

  navigateToDefault: () => {
    const state = get();
    if (typeof window !== "undefined") {
      window.location.href = state.defaultPage;
    }
  },

  // Store initialization
  initializeStore: async () => {
    const state = get();
    // Only fetch movie data on initialization, bookmarks will be fetched when needed
    await state.fetchMovieData();
    // You might want to fetch other initial data here if needed
    await state.fetchBookmarks();
  },
}));

export type {
  IAppState,
  ISearchResult,
  ITrendingResult,
  ITrendingData,
  IMovieData,
  IMovieDetails,
  ITVDetails,
  ICast,
  ICrew,
  ITrailer,
  IDetailPageData,
};
export default useAppStore;
