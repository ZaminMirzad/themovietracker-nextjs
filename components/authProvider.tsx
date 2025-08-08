"use client";

import { useAppStore } from "@/store/useStore";
import { useEffect } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsAuthenticated, bookmarks } = useAppStore();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      }
    };

    // Load bookmarks from localStorage
    const loadBookmarks = () => {
      try {
        const savedBookmarks = localStorage.getItem('bookmarks');
        if (savedBookmarks) {
          const parsedBookmarks = JSON.parse(savedBookmarks);
          // Update store with loaded bookmarks
          useAppStore.setState({ bookmarks: parsedBookmarks });
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    checkAuth();
    loadBookmarks();
  }, [setUser]);

  return <>{children}</>;
}
