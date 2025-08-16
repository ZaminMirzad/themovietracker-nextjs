"use client";

import { useAppStore } from "@/store/useStore";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setBookmarks } = useAppStore();

  useEffect(() => {
    // Load bookmarks from localStorage
    const loadBookmarks = () => {
      try {
        const savedBookmarks = localStorage.getItem('bookmarks');
        if (savedBookmarks) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    loadBookmarks();
  }, [setBookmarks]);

  return <>{children}</>;
}
