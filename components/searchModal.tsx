"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white/95 dark:bg-dark-background/95 backdrop-blur-xl rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-white/20 dark:border-white/10 -mt-[810px] sm:mt-0"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Search Results</h2>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
              aria-label="Close search modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              <p className="text-sm sm:text-base">No results found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <AnimatePresence>
                  {results.slice(0, 6).map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="cursor-pointer group bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={() => onItemClick(item.id, item.media_type)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* Image */}
                        <div className="relative mb-1.5 w-full">
                          {item.poster_path || item.backdrop_path ? (
                            <div className="w-full aspect-[3/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                              <Image
                                src={
                                  imageBaseUrl + (item.poster_path || item.backdrop_path)
                                }
                                alt={item.title || item.name || "Movie"}
                                fill
                                className="object-cover object-center rounded-lg"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-[3/3] rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                              <div className="text-center p-2">
                                <div className="text-2xl mb-1">🎬</div>
                                <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                  {item.media_type === "tv" ? "TV" : "Movie"}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Media Type Badge */}
                          <div className={`absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded-full font-medium text-white shadow-sm ${
                            item.media_type === "tv" ? "bg-blue-500" : "bg-red-500"
                          }`}>
                            {item.media_type === "tv" ? "TV" : "Movie"}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="w-full">
                          <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1 leading-tight mb-0.5">
                            {item.title || item.name}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
           
            </>
          )}
        </motion.div>
    </div>
  );
}
