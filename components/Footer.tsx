"use client";

import React from "react";
import Link from "next/link";
import { Heart, Github, X, Instagram, Film } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground mt-16 border-t border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                MovieTracker
              </span>
            </div>
            <p className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text mb-4 max-w-md">
              Discover, track, and share your favorite movies and TV shows.
              Built with modern technology and passion for cinema.
            </p>
            <div className="flex items-center space-x-1 text-xs sm:text-sm text-light-input-text dark:text-dark-input-text opacity-70">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              <span>Made with love by Zamin Mirzad</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/movie/popular"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/tv/popular"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  Popular TV Shows
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-light-foreground dark:text-dark-foreground">Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  TMDb API
                </a>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm sm:text-base text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-light-border dark:border-dark-border mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-6">
              <a
                href="https://github.com/ZaminMirzad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Github className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-input-text dark:text-dark-input-text hover:text-light-accent dark:hover:text-dark-accent transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>

            <p className="text-xs sm:text-sm text-light-input-text dark:text-dark-input-text text-center sm:text-left">
              © {currentYear} MovieTracker. All rights reserved.
            </p>
          </div>
        </div>

        {/* Made with love banner */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 px-3 sm:px-4 py-2 rounded-full">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            <span className="text-xs sm:text-sm font-medium text-white">
              Crafted with ❤️ by Zamin Mirzad
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
