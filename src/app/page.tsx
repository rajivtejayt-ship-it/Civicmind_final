"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-50">
      {/* Navigation Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <Link
                href="/"
                className="text-xl font-black tracking-tight text-slate-900 dark:text-white"
              >
                CivicMind
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors dark:text-zinc-400 dark:hover:text-white"
              >
                Home
              </Link>
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors dark:text-zinc-400 dark:hover:text-white"
              >
                Features
              </a>
              <Link
                href="/signin"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Home
              </Link>
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Features
              </a>
              <Link
                href="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-lg bg-slate-900 px-4 py-2 text-center text-base font-bold text-white dark:bg-white dark:text-zinc-950"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Tag / Badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-400/20">
              <span>Next-Gen Civic Action</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                CivicMind
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-zinc-400">
              AI-powered civic engagement platform helping citizens identify, report, and resolve
              local issues collaboratively.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signin"
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-98 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Get Started
              </Link>
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-98 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-slate-200 bg-white dark:border-zinc-900 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Platform Features
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-zinc-400">
              Empowering communities with smart, cooperative tools.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: AI Classification */}
            <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                AI Classification
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                Gemini-powered issue categorization and severity assessment.
              </p>
            </div>

            {/* Feature 2: CivicCred */}
            <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                CivicCred
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                Community trust and reputation system rewarding constructive participation.
              </p>
            </div>

            {/* Feature 3: Community Action */}
            <div className="relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
                Community Action
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                Citizens collaboratively validate reports and drive local improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 border-t border-slate-200 bg-slate-50 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-500 sm:text-5xl">
                500+
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-zinc-400">
                Issues Reported
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 sm:text-5xl">
                87%
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-zinc-400">
                Resolution Rate
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-500 sm:text-5xl">
                2,000+
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-zinc-400">
                Active Citizens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-slate-200 bg-white dark:border-zinc-900 dark:bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Ready to improve your community?
            </h2>
            <div className="mt-10">
              <Link
                href="/signin"
                className="inline-flex rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-98 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Join CivicMind
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200/60 bg-slate-50 dark:border-zinc-900 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400 dark:text-zinc-500">
            &copy; Built for Google Solution Challenge 2026. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
