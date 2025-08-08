"use client";

import Header from "@/components/header";
import SearchModal from "@/components/searchModal";
import { useAppStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const { searchResults, isInputFocused, showModal, setShowModal } = useAppStore();
  const router = useRouter();

  function handleClick(id: string | number, mediaType?: string) {
    // Determine if it's a TV show or movie based on media_type or other properties
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
      
      {/* Global Search Modal */}
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
