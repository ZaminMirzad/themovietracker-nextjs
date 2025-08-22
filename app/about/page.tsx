"use client";

import { motion } from "framer-motion";
import { Film, Heart, Users, Zap, Shield, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-light-background dark:bg-dark-background">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl mb-4 sm:mb-6">
            <Film className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-light-foreground dark:text-dark-foreground mb-4 sm:mb-6">
            About MovieTracker
          </h1>
          <p className="text-base sm:text-lg text-light-input-text dark:text-dark-input-text max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Your ultimate companion for discovering, tracking, and managing your favorite movies and TV shows.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-4 sm:mb-6">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-3 sm:mb-4">
            At MovieTracker, we believe that great entertainment should be easy to discover, 
            remember, and share. Our platform is designed to help you navigate the vast world 
            of movies and television shows with ease.
          </p>
          <p className="text-base sm:text-lg text-light-input-text dark:text-dark-input-text leading-relaxed">
            Whether you're a casual viewer or a dedicated cinephile, MovieTracker provides 
            the tools you need to build your personal entertainment library and never lose 
            track of what you want to watch.
          </p>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6 sm:mb-8">
            What We Offer
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Smart Discovery
                </h3>
                <p className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text leading-relaxed">
                  Discover trending movies and TV shows, get personalized recommendations, 
                  and explore content based on your preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Personal Library
                </h3>
                <p className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text leading-relaxed">
                  Save your favorite content, create watchlists, and keep track of what 
                  you've watched and what you want to see next.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Secure & Private
                </h3>
                <p className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text leading-relaxed">
                  Your data is protected with industry-standard security measures. 
                  Your watchlists and preferences remain private and secure.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Always Accessible
                </h3>
                <p className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text leading-relaxed">
                  Access your movie library from anywhere, on any device. 
                  Your data syncs seamlessly across all platforms.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technology Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-4 sm:mb-6">
            Built with Modern Technology
          </h2>
          <p className="text-base sm:text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-4 sm:mb-6">
            MovieTracker is built using cutting-edge web technologies to ensure 
            the best possible user experience:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              "Next.js 14 for lightning-fast performance",
              "TypeScript for type safety and reliability",
              "Tailwind CSS for beautiful, responsive design",
              "InstantDB for real-time data synchronization",
              "TMDb API for comprehensive movie and TV data",
              "Framer Motion for smooth animations"
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                <span className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Creator Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-4 sm:mb-6">
            Meet the Creator
          </h2>
          <div className="bg-light-input-background dark:bg-dark-input-background rounded-xl p-4 sm:p-8 border border-light-border dark:border-dark-border">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-light-foreground dark:text-dark-foreground">
                  Zamin Mirzad
                </h3>
                <p className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text">
                  Developer & Movie Enthusiast
                </p>
              </div>
            </div>
            <p className="text-base sm:text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-4 sm:mb-6">
              A passionate developer and movie enthusiast who believes in creating 
              tools that make life better. MovieTracker was born from the simple 
              idea that finding and remembering great content shouldn't be complicated.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="https://github.com/ZaminMirzad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity font-medium text-sm sm:text-base"
              >
                <span>GitHub</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity font-medium text-sm sm:text-base"
              >
                <span>Twitter</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6">
              Join thousands of users who are already organizing their entertainment with MovieTracker.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-white text-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
              >
                <span>Start Exploring</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <a
                href="https://github.com/ZaminMirzad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-all duration-200 text-sm sm:text-base"
              >
                <span>Get in Touch</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
