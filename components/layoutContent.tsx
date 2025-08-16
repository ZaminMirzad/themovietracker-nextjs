"use client";

import Header from "@/components/header";
import Footer from "@/components/Footer";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { useAppStore } from "@/store/useStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LayoutContentProps {
  children: React.ReactNode;
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { setBookmarks } = useAppStore();
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



  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function LayoutContent({ children }: LayoutContentProps) {
  return (
    <ClerkProvider publishableKey="pk_test_am9pbnQtbGFjZXdpbmctODkuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <InnerLayout>{children}</InnerLayout>
    </ClerkProvider>
  );
}
