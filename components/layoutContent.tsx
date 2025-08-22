"use client";

import Header from "@/components/header";
import Footer from "@/components/Footer";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { useAppStore } from "@/store/useStore";
import { useEffect } from "react";


interface LayoutContentProps {
  children: React.ReactNode;
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const { fetchBookmarks, setBookmarks } = useAppStore((state) => state);

  // Initialize store and fetch bookmarks when app starts
  useEffect(() => {
    if (isSignedIn) {
      fetchBookmarks();
    } else {
      // Clear bookmarks when user signs out
      setBookmarks([]);
    }
  }, [isSignedIn, fetchBookmarks, setBookmarks]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-20 sm:pb-0">{children}</div>
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
