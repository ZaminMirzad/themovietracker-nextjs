"use client";

import Header from "@/components/header";
import SearchModal from "@/components/searchModal";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { useAppStore } from "@/store/useStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LayoutContentProps {
  children: React.ReactNode;
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { searchResults, isInputFocused, showModal, setShowModal, setBookmarks } = useAppStore();
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    async function hydrateBookmarks() {
      try {
        if (isSignedIn) {
          const res = await fetch('/api/bookmarks', { cache: 'no-store' });
          if (!res.ok) {
            setBookmarks([]);
            return;
          }
          const text = await res.text();
          const data = text ? JSON.parse(text) : { bookmarks: [] };
          if (Array.isArray(data.bookmarks)) {
            setBookmarks(data.bookmarks);
            if (typeof window !== 'undefined') {
              localStorage.setItem('bookmarks', JSON.stringify(data.bookmarks));
            }
          }
        } else {
          // Fallback to localStorage for signed-out users
          const raw = typeof window !== 'undefined' ? localStorage.getItem('bookmarks') : null;
          if (raw) {
            setBookmarks(JSON.parse(raw));
          } else {
            setBookmarks([]);
          }
        }
      } catch (e) {
        console.error('hydrateBookmarks error', e);
        setBookmarks([]);
      }
    }
    hydrateBookmarks();
  }, [isSignedIn, setBookmarks]);

  function handleClick(id: string | number, mediaType?: string) {
    const isTV = mediaType === 'tv' || (searchResults && searchResults.find(item => item.id === id)?.media_type === 'tv');
    if (isTV) {
      router.push(`/tv/${id}`);
    } else {
      router.push(`/movie/${id}`);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header />
      {children}

      <SearchModal
        open={isInputFocused && showModal && !!searchResults}
        results={
          searchResults
            ? searchResults
                .filter(
                  (item) =>
                    (item.backdrop_path || item.poster_path) &&
                    item.id !== undefined
                )
                .map((item) => ({
                  id: item.id,
                  backdrop_path: item.backdrop_path,
                  poster_path: item.poster_path,
                  title: item.title,
                  name: item.name,
                  media_type: item.media_type,
                }))
            : []
        }
        onClose={() => setShowModal(false)}
        onItemClick={(id, mediaType) => {
          setShowModal(false);
          handleClick(id, mediaType);
        }}
      />
    </div>
  );
}

export default function LayoutContent({ children }: LayoutContentProps) {
  return (
    <ClerkProvider>
      <InnerLayout>{children}</InnerLayout>
    </ClerkProvider>
  );
}
