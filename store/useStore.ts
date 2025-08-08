import { RefObject, createRef } from "react";
import { create } from "zustand";

// Define the shape of a search result
interface ISearchResult {
  id: string | number;
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  name?: string;
  media_type?: string;
}

// Define the shape of the application state
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
  
  // Search handlers
  handleSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // Navigation helpers
  navigateToDefault: () => void;
}

// Create a Zustand store for the application state
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
  inputRef: typeof window !== "undefined" ? createRef<HTMLInputElement>() : { current: null },
  setInputRef: (ref) => set({ inputRef: ref }),
  
  // Default page configuration
  defaultPage: "/",
  setDefaultPage: (page) => set({ defaultPage: page }),
  
  // Search handlers
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
  
  // Navigation helpers
  navigateToDefault: () => {
    const state = get();
    if (typeof window !== "undefined") {
      window.location.href = state.defaultPage;
    }
  },
}));

export type { IAppState, ISearchResult };
export default useAppStore;
