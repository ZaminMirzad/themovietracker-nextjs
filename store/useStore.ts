import { create } from "zustand";
import { RefObject } from "react";

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
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: 'movie' | 'tv';
  added_at: string;
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

  // Default page configuration
  defaultPage: string;
  setDefaultPage: (page: string) => void;

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

  // Default page configuration
  defaultPage: "/",
  setDefaultPage: (page) => set({ defaultPage: page }),

  // Bookmarks state
  bookmarks: [],
  setBookmarks: (bookmarks) => set({ bookmarks }),
  addBookmark: (bookmark) => {
    const state = get();
    const exists = state.bookmarks.find(
      b => b.id === bookmark.id && b.media_type === bookmark.media_type
    );
    if (!exists) {
      const updated = [...state.bookmarks, bookmark];
      set({ bookmarks: updated });
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmarks', JSON.stringify(updated));
      }
    }
  },
  removeBookmark: (id, mediaType) => {
    const state = get();
    const filtered = state.bookmarks.filter(
      b => !(b.id === id && b.media_type === mediaType)
    );
    set({ bookmarks: filtered });
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookmarks', JSON.stringify(filtered));
    }
  },
  isBookmarked: (id, mediaType) => {
    const state = get();
    return state.bookmarks.some(
      b => b.id === id && b.media_type === mediaType
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

export type { IAppState, ISearchResult };
export default useAppStore;
