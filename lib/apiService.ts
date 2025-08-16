// Centralized API service for fetching movie and TV show data

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Generic fetch function with error handling
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Person details (cast/crew)
export async function fetchPersonDetails(personId: number | string) {
  const url = `${BASE_URL}/person/${personId}?api_key=${API_KEY}`;
  return fetchData(url);
}

// Movie data fetching
export const movieApi = {
  async getDetails(movieId: string) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    return fetchData(url);
  },

  async getCredits(movieId: string) {
    const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
    return fetchData(url);
  },

  async getTrailers(movieId: string) {
    const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
    return fetchData(url);
  },

  async getRelated(movieId: string) {
    const url = `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`;
    return fetchData(url);
  }
};

// TV Show data fetching
export const tvApi = {
  async getDetails(tvId: string) {
    const url = `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`;
    return fetchData(url);
  },

  async getSeason(tvId: string, seasonNumber: number) {
    const url = `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`;
    return fetchData(url);
  },

  async getTrailers(tvId: string) {
    const url = `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}`;
    return fetchData(url);
  },

  async getRelated(tvId: string) {
    const url = `${BASE_URL}/tv/${tvId}/similar?api_key=${API_KEY}`;
    return fetchData(url);
  }
};

// Utility functions for data processing
export const dataUtils = {
  processTrailers(trailers: any[]) {
    return trailers?.filter(
      (trailer: any) => trailer.type === "Trailer" && trailer.site === "YouTube"
    ) || [];
  },

  processRelatedMedia(results: any[]) {
    return results || [];
  }
};
