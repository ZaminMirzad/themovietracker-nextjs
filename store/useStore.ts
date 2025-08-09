import { create } from "zustand";
import { RefObject } from "react";
import { auth, currentUser } from '@clerk/nextjs/server';


interface ISearchResult {
  id: string | number;
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  name?: string;
  media_type?: string;
}

interface IBookmark {
  movieId: string | number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: 'movie' | 'tv';
  // added_at: string;
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
  id?: number;
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
  production_companies?: Array<{ id: number; name: string; logo_path?: string }>;
}

interface ITVDetails {
  id?: number;
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
  currentType: 'movie' | 'tv' | null;
}

interface IAppState {
  // Search functionality
  search: string;
  setSearch: (val: string) => void;
  isInputFocused: boolean;
  setIsInputFocused: (val: boolean) => void;
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  searchResults: ISearchResult[] | null;
  setSearchResults: (results: ISearchResult[] | null) => void;
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  setInputRef: (ref: RefObject<HTMLInputElement | null>) => void;
  user:{
    userId:string,
    userName:string
  }

  // Default page configuration
  defaultPage: string;
  setDefaultPage: (page: string) => void;

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
  addBookmark: (bookmark: IBookmark) => void;
  removeBookmark: (id: string | number, mediaType: 'movie' | 'tv') => void;
  isBookmarked: (id: string | number, mediaType: 'movie' | 'tv') => boolean;
  setBookmarks: (bookmarks: IBookmark[]) => void;

  // Search handlers
  handleSearch: (query: string) => Promise<void>;
  clearSearch: () => void;

  // Navigation helper
  navigateToDefault: () => void;
}

export const useAppStore = create<IAppState>((set, get) => ({
  // Search state
  search: "",
  setSearch: (val) => set({ search: val }),
  isInputFocused: false,
  setIsInputFocused: (val) => set({ isInputFocused: val }),
  showModal: false,
  setShowModal: (val) => set({ showModal: val }),
  searchResults: null,
  setSearchResults: (results) => set({ searchResults: results }),
  isSearching: false,
  setIsSearching: (val) => set({ isSearching: val }),
  inputRef: { current: null },
  setInputRef: (ref) => set({ inputRef: ref }),
  user:{
    userId:"",
    userName:""
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
  setMovieData: (data) => {
    const state = get();
    set({ 
      movieData: { 
        ...state.movieData, 
        ...data,
        lastFetched: Date.now()
      } 
    });
  },
  fetchMovieData: async () => {
    const state = get();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Check if data is still fresh
    if (state.movieData.lastFetched && 
        Date.now() - state.movieData.lastFetched < CACHE_DURATION &&
        state.movieData.weekTrending) {
      return; // Data is still fresh, no need to refetch
    }

    state.setMovieData({ isLoading: true });
    
    try {
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
      
      state.setMovieData({
        weekTrending: trendingData,
        popular: popularData,
        upcoming: upcomingData,
        popularTV: popularTVData,
        topRatedTV: topRatedTVData,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching movie data:', error);
      state.setMovieData({ isLoading: false });
    }
  },
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
      }
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
        lastFetched: Date.now()
      } 
    });
  },
  fetchMovieDetails: async (id: string) => {
    const state = get();
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for detail pages
    
    // Check if data is still fresh for the same movie
    if (state.detailPageData.currentId === id && 
        state.detailPageData.currentType === 'movie' &&
        state.detailPageData.lastFetched && 
        Date.now() - state.detailPageData.lastFetched < CACHE_DURATION &&
        state.detailPageData.movie) {
      return; // Data is still fresh, no need to refetch
    }

    state.setDetailPageData({ isLoading: true, currentId: id, currentType: 'movie' });
    
    try {
      const [movieRes, creditsRes, relatedRes, trailersRes] = await Promise.all([
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
      ]);
      
      const [movieData, creditsData, relatedData, trailersData] = await Promise.all([
        movieRes.json(),
        creditsRes.json(),
        relatedRes.json(),
        trailersRes.json(),
      ]);
      
      const officialTrailers = trailersData.results?.filter(
        (trailer: ITrailer) => trailer.type === "Trailer" && trailer.site === "YouTube"
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
      console.error('Error fetching movie details:', error);
      state.setDetailPageData({ isLoading: false });
    }
  },
  fetchTVDetails: async (id: string) => {
    const state = get();
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for detail pages
    
    // Check if data is still fresh for the same TV show
    if (state.detailPageData.currentId === id && 
        state.detailPageData.currentType === 'tv' &&
        state.detailPageData.lastFetched && 
        Date.now() - state.detailPageData.lastFetched < CACHE_DURATION &&
        state.detailPageData.tvShow) {
      return; // Data is still fresh, no need to refetch
    }

    state.setDetailPageData({ isLoading: true, currentId: id, currentType: 'tv' });
    
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
      
      const officialTrailers = trailersData.results?.filter(
        (trailer: ITrailer) => trailer.type === "Trailer" && trailer.site === "YouTube"
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
      console.error('Error fetching TV details:', error);
      state.setDetailPageData({ isLoading: false });
    }
  },
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
      }
    });
  },

  // Bookmarks state
  bookmarks: (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookmarks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  })(),
  setBookmarks: (bookmarks) => set({ bookmarks }),
  addBookmark: (bookmark) => {
    const state = get();
    const exists = state.bookmarks.find(
      b => b.movieId === bookmark.movieId && b.media_type === bookmark.media_type
    );
    if (!exists) {
      const updated = [...state.bookmarks, bookmark];
      set({ bookmarks: updated });
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmarks', JSON.stringify(updated));
        
        // Sync with InstantDB
        import('@/lib/instantdb').then(({ db }) => {
          import('@instantdb/react').then(({ id }) => {
            db.transact(
              db.tx.bookmarks[id()].create({
                movieId: bookmark.movieId,
                title: bookmark.title,
                poster_path: bookmark.poster_path,
                backdrop_path: bookmark.backdrop_path,
                media_type: bookmark.media_type,
              })
            );
          });
        }).catch(err => console.error('Error adding bookmark to InstantDB:', err));
      }
    }
  },
  removeBookmark: (id, mediaType) => {
    const state = get();
    const filtered = state.bookmarks.filter(
      b => !(b.movieId === id && b.media_type === mediaType)
    );
    set({ bookmarks: filtered });
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookmarks', JSON.stringify(filtered));
      
      // Remove from InstantDB
      import('@/lib/instantdb').then(({ db }) => {
        import('@instantdb/react').then(({ id }) => {
          db.transact(db.tx.bookmarks[id.toString()].delete());
        });
      }).catch(err => console.error('Error removing bookmark from InstantDB:', err));
    }
  },
  syncWithInstantDB: async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // This would sync bookmarks from InstantDB
      // Implementation depends on your InstantDB setup
    } catch (error) {
      console.error('Error syncing with InstantDB:', error);
    }
  },
  isBookmarked: (id, mediaType) => {
    const state = get();
    return state.bookmarks.some(
      b => b.movieId === id && b.media_type === mediaType
    );
  },

  handleSearch: async (query: string) => {
    const state = get();
    if (!query.trim()) {
      state.setSearchResults(null);
      return;
    }
    state.setIsSearching(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/search/multi?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      state.setSearchResults(data.results || []);
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
  IDetailPageData
};
export default useAppStore;
