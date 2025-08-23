"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface EpisodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: {
    episode_number: number;
    name?: string;
    overview?: string;
    air_date?: string;
    runtime?: number;
    vote_average?: number;
    still_path?: string;
  } | null;
}

export default function EpisodeDetailModal({
  isOpen,
  onClose,
  episode,
}: EpisodeDetailModalProps) {
  if (!isOpen || !episode) return null;

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-dark-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">
                  Episode {episode.episode_number}
                  {episode.name && `: ${episode.name}`}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {episode.still_path ? (
                <div className="mb-4">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                    alt={`Episode ${episode.episode_number}`}
                    width={600}
                    height={338}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="text-4xl mb-3">🎬</div>
                      <div className="text-lg font-medium text-blue-700 dark:text-blue-300">
                        Episode {episode.episode_number}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        {episode.name || 'No title available'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {episode.overview || "No description available."}
                </p>

                <div className="space-y-2 text-sm">
                  {episode.air_date && (
                    <p className="text-gray-500 dark:text-gray-400">
                      Air Date:{" "}
                      <span className="font-medium">{episode.air_date}</span>
                    </p>
                  )}
                  {episode.runtime && (
                    <p className="text-gray-500 dark:text-gray-400">
                      Runtime:{" "}
                      <span className="font-medium">
                        {episode.runtime} minutes
                      </span>
                    </p>
                  )}
                  {episode.vote_average && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Rating:
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <=
                              Math.round((episode.vote_average || 0) / 2)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm font-medium">
                          {formatRating(episode.vote_average)}/5
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
