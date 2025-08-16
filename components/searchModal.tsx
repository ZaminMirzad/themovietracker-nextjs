"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  open: boolean;
  results: Array<{
    id: string | number;
    backdrop_path?: string;
    poster_path?: string;
    title?: string;
    name?: string;
    media_type?: string;
  }>;
  onClose: () => void;
  onItemClick: (id: string | number, mediaType?: string) => void;
}

export default function SearchModal({
  open,
  results,
  onClose,
  onItemClick,
}: SearchModalProps) {
  if (!open) return null;

  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-40"
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-dark-background rounded-xl shadow-2xl p-6 w-fit max-w-4xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {results.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No results found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {results.slice(0, 12).map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => onItemClick(item.id, item.media_type)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={imageBaseUrl + (item.poster_path || item.backdrop_path)}
                      alt={item.title || item.name || "Movie"}
                      width={120}
                      height={180}
                      className="w-full h-auto object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {item.media_type === 'tv' && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                        TV
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-xs font-medium text-center line-clamp-2">
                    {item.title || item.name}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
