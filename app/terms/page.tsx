"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Users, Globe, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-light-input-text dark:text-dark-input-text max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using MovieTracker. By using our service, you agree to these terms.
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
            Agreement to Terms
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-4">
            These Terms of Service ("Terms") govern your use of MovieTracker, operated by Zamin Mirzad. 
            By accessing or using our service, you agree to be bound by these Terms and all applicable laws and regulations.
          </p>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed">
            If you do not agree with any of these terms, you are prohibited from using or accessing this service. 
            The materials contained in this service are protected by applicable copyright and trademark law.
          </p>
        </motion.section>

        {/* Service Description */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-8">
            Service Description
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  What We Provide
                </h3>
                <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                  MovieTracker is a web-based platform that allows users to discover, track, and manage 
                  movies and TV shows. We provide access to entertainment information and personal 
                  bookmarking capabilities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-2">
                  User Responsibilities
                </h3>
                <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                  Users are responsible for maintaining the confidentiality of their account information 
                  and for all activities that occur under their account. You must be at least 13 years old to use this service.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Acceptable Use */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Acceptable Use Policy
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-6">
            You agree not to use the service to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Violate any applicable laws or regulations",
              "Infringe on intellectual property rights",
              "Harass, abuse, or harm other users",
              "Attempt to gain unauthorized access to our systems",
              "Use automated tools to scrape or collect data",
              "Interfere with the service's operation"
            ].map((rule, index) => (
              <motion.div
                key={rule}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-light-input-text dark:text-dark-input-text">{rule}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* User Accounts */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-8">
            User Accounts and Registration
          </h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                  Account Creation
                </h3>
                <ul className="space-y-2 text-light-input-text dark:text-dark-input-text">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Provide accurate information</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain account security</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Notify us of unauthorized use</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                  Account Security
                </h3>
                <ul className="space-y-2 text-light-input-text dark:text-dark-input-text">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use strong passwords</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Enable two-factor authentication</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Keep login credentials private</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                  Account Termination
                </h3>
                <ul className="space-y-2 text-light-input-text dark:text-dark-input-text">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Close account anytime</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>We may suspend for violations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Data deletion upon request</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Intellectual Property */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Intellectual Property Rights
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-6">
            Understanding our intellectual property policies:
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                Our Rights
              </h3>
              <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                MovieTracker and its original content, features, and functionality are owned by Zamin Mirzad 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-light-foreground dark:text-dark-foreground mb-3">
                Your Rights
              </h3>
              <p className="text-light-input-text dark:text-dark-input-text leading-relaxed">
                You retain ownership of any content you create and share on our platform. By using our service, 
                you grant us a limited license to use your content solely for providing the service.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Limitation of Liability */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Limitation of Liability
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-4">
            In no event shall MovieTracker, nor its directors, employees, partners, agents, suppliers, 
            or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
            damages, including without limitation, loss of profits, data, use, goodwill, or other 
            intangible losses, resulting from your use of the service.
          </p>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed">
            Our total liability to you for any claims arising from the use of our service shall not 
            exceed the amount you paid, if any, for accessing the service during the twelve (12) 
            months preceding the claim.
          </p>
        </motion.section>

        {/* Changes to Terms */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-light-foreground dark:text-dark-foreground mb-6">
            Changes to Terms
          </h2>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed mb-4">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, 
            we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
          <p className="text-lg text-light-input-text dark:text-dark-input-text leading-relaxed">
            What constitutes a material change will be determined at our sole discretion. By continuing 
            to access or use our service after any revisions become effective, you agree to be bound 
            by the revised terms.
          </p>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Terms?
            </h2>
            <p className="text-white/90 text-lg mb-6">
              If you have any questions about these Terms of Service, please don't hesitate to reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="https://github.com/ZaminMirzad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                <span>Contact on GitHub</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
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
