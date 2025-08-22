"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Globe, Mail, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-light-background dark:bg-dark-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-light-input-text dark:text-dark-input-text max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. Learn how we protect and handle your information.
          </p>
          <p className="text-sm text-light-input-text dark:text-dark-input-text opacity-60 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Introduction
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-4">
            MovieTracker ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our website and services.
          </p>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed">
            By using MovieTracker, you agree to the collection and use of information in 
            accordance with this policy. If you do not agree with our policies and practices, 
            please do not use our service.
          </p>
        </motion.section>

        {/* Information We Collect */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-8">
            Information We Collect
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                  Personal Information
                </h3>
                <ul className="space-y-2 text-light-input-text dark:text-dark-input-text">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Email address (when you sign up)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Username and profile information</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Authentication data through Clerk</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                  Usage Data
                </h3>
                <ul className="space-y-2 text-light-input-text dark:text-dark-input-text">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Bookmarks and watchlists</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Search queries and preferences</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Interaction with our service</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                  Technical Information
                </h3>
                <ul className="space-y-2 text-light-input-text dark:text-dark-input-text">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>IP address and location data</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Browser type and version</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Device information and cookies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* How We Use Your Information */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            How We Use Your Information
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-6">
            We use the information we collect to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Provide, maintain, and improve our services",
              "Personalize your experience and show relevant content",
              "Process and store your bookmarks and preferences",
              "Communicate with you about our services",
              "Ensure security and prevent fraud",
              "Comply with legal obligations"
            ].map((use, index) => (
              <motion.div
                key={use}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-light-input-text dark:text-dark-input-text">{use}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Data Protection */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-8">
            How We Protect Your Data
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Encryption
                </h3>
                <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                  All data is encrypted in transit and at rest using industry-standard 
                  encryption protocols to ensure your information remains secure.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Access Control
                </h3>
                <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                  Strict access controls ensure that only authorized personnel can access 
                  your data, and all access is logged and monitored.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Secure Storage
                </h3>
                <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                  Your data is stored on secure, redundant servers with regular backups 
                  and disaster recovery procedures in place.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  Privacy by Design
                </h3>
                <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                  We follow privacy-by-design principles, collecting only the data we need 
                  and implementing safeguards from the ground up.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Your Rights */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Your Rights and Choices
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-6">
            You have the right to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Access and review your personal data",
              "Correct inaccurate or incomplete information",
              "Request deletion of your data",
              "Opt-out of certain data collection",
              "Export your data in a portable format",
              "File a complaint with authorities"
            ].map((right, index) => (
              <motion.div
                key={right}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-light-input-text dark:text-dark-input-text">{right}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Privacy?
            </h2>
            <p className="text-white/90 text-lg mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="https://github.com/ZaminMirzad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                <span>Contact on GitHub</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                <span>Back to Home</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
