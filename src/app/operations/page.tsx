"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CivicIssue, IssueCategory } from "@/types/civic";
import { getBadge } from "@/agents/BadgeAgent";
import { Toast, ToastType } from "@/components/ui/Toast";
import { DEMO_ISSUES } from "@/lib/demoData";

const IssueMap = dynamic(() => import("@/components/maps/IssueMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl">
      <svg className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  )
});

// ─── Helpers ────────────────────────────────────────────────────────────────


function formatRelativeTime(dateString: string): string {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / 60_000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch {
    return "Recently";
  }
}

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  infrastructure: "Infrastructure",
  safety: "Safety",
  sanitation: "Sanitation",
  mobility: "Mobility",
  environment: "Environment",
  other: "Other",
};

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  infrastructure: "bg-blue-500",
  safety: "bg-rose-500",
  sanitation: "bg-amber-500",
  mobility: "bg-violet-500",
  environment: "bg-emerald-500",
  other: "bg-slate-400",
};

const SEVERITY_STYLES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700 ring-emerald-700/10 dark:bg-emerald-950/30 dark:text-emerald-400",
  medium: "bg-amber-50 text-amber-700 ring-amber-700/10 dark:bg-amber-950/30 dark:text-amber-400",
  high: "bg-orange-50 text-orange-700 ring-orange-700/10 dark:bg-orange-950/30 dark:text-orange-400",
  critical: "bg-rose-50 text-rose-700 ring-rose-700/10 dark:bg-rose-950/30 dark:text-rose-400",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        {label}
      </p>
      <p className={`mt-2 text-4xl font-black ${accent}`}>{value}</p>
      {sub && (
        <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">{sub}</p>
      )}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
      {children}
    </h2>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OperationsPage() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const demoActive = typeof sessionStorage !== "undefined" && sessionStorage.getItem("civicmind-demo-active") === "true";
        setIsDemo(demoActive);
        
        let data: CivicIssue[] = [];
        
        if (demoActive) {
          const demoDataStr = sessionStorage.getItem("civicmind-demo-data");
          if (demoDataStr) data = JSON.parse(demoDataStr);
        }
        
        if (!data || data.length === 0) {
          const { getIssues } = await import("@/lib/firebase/issues");
          data = await getIssues();
        }
        setIssues(data);
      } catch (err) {
        console.error("Operations: failed to load issues", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleGenerateDemoData = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("civicmind-demo-active", "true");
      sessionStorage.setItem("civicmind-demo-data", JSON.stringify(DEMO_ISSUES));
      setIssues(DEMO_ISSUES);
      setIsDemo(true);
      setToast({ message: "Demo Data Loaded", type: "success" });
    }
  };
  
  const handleClearDemoData = () => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem("civicmind-demo-active");
      sessionStorage.removeItem("civicmind-demo-data");
      setIsDemo(false);
      setToast({ message: "Demo Data Cleared", type: "success" });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  // ── Derived metrics ────────────────────────────────────────────────────────
  const totalReports = issues.length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;
  const investigatingCount = issues.filter((i) => i.status === "investigating").length;
  const addressingCount = issues.filter((i) => i.status === "addressing").length;

  // ── Category breakdown ─────────────────────────────────────────────────────
  const categoryCounts = issues.reduce<Partial<Record<IssueCategory, number>>>(
    (acc, issue) => {
      acc[issue.category] = (acc[issue.category] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const sortedCategories = (Object.keys(categoryCounts) as IssueCategory[]).sort(
    (a, b) => (categoryCounts[b] ?? 0) - (categoryCounts[a] ?? 0)
  );

  const maxCategoryCount = Math.max(
    1,
    ...Object.values(categoryCounts).map((v) => v ?? 0)
  );

  // ── Top 5 by impact ────────────────────────────────────────────────────────
  const topImpact = [...issues]
    .sort((a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0))
    .slice(0, 5);

  // ── Top 5 by trust ─────────────────────────────────────────────────────────
  const topTrust = [...issues]
    .sort((a, b) => (b.trustScore ?? 0) - (a.trustScore ?? 0))
    .slice(0, 5);

  // ── Top 5 Documented ────────────────────────────────────────────────────────
  const topDocumented = [...issues]
    .sort((a, b) => (b.evidenceCount ?? 0) - (a.evidenceCount ?? 0))
    .slice(0, 5);

  // ── Recent 5 ──────────────────────────────────────────────────────────────
  const recent = [...issues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // ── Mock Top Contributors ──────────────────────────────────────────────────
  const topContributors = [
    { name: "Sarah J.", cred: 642 },
    { name: "Michael T.", cred: 315 },
    { name: "Elena R.", cred: 180 },
    { name: "David L.", cred: 95 },
    { name: "James M.", cred: 45 },
  ];

  // ── Render states ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-center py-32 gap-4">
          <svg
            className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
            Loading operations data…
          </span>
        </div>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
        <div className="mx-auto max-w-6xl flex flex-col items-center justify-center py-32 gap-4 text-center">
          <svg
            className="h-10 w-10 text-rose-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            Unable to load operations data.
          </p>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Check your connection and refresh.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Live Data
              </span>
              {isDemo && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 ring-1 ring-indigo-700/10 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-400/20 uppercase tracking-wider">
                  Demo
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Community Insights
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Understand trends, trust, impact, and issue activity across your community.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {process.env.NODE_ENV === "development" && !isDemo && (
              <button
                onClick={handleGenerateDemoData}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
              >
                Generate Demo Data
              </button>
            )}
            {process.env.NODE_ENV === "development" && isDemo && (
              <button
                onClick={handleClearDemoData}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 transition-colors"
              >
                Clear Demo Data
              </button>
            )}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Dashboard
            </Link>
          </div>
        </header>

        {/* ── City Issues Map (collapsible) ─────────────────────────────── */}
        {issues.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-600 dark:text-zinc-400">
                {showMap ? "Map view active" : "Geographic overview"}
              </span>
              <button
                onClick={() => setShowMap(!showMap)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-800/80 transition-all active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {showMap ? "Hide Map" : "Show Map"}
              </button>
            </div>
            {showMap && (
              <div className="h-[460px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800 relative z-0 transition-all">
                <IssueMap issues={issues} />
              </div>
            )}
          </section>
        )}

        {/* ── Metrics ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading>Overview</SectionHeading>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total Reports"
              value={totalReports}
              sub="All time"
              accent="text-slate-900 dark:text-white"
            />
            <MetricCard
              label="Resolved Issues"
              value={resolvedCount}
              sub="Status: Resolved"
              accent="text-emerald-600 dark:text-emerald-400"
            />
            <MetricCard
              label="Investigating"
              value={investigatingCount}
              sub="Status: Investigating"
              accent="text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              label="Addressing"
              value={addressingCount}
              sub="Status: Addressing"
              accent="text-orange-600 dark:text-orange-400"
            />
          </div>
        </section>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Left column — Category breakdown + Recent Activity */}
          <div className="lg:col-span-1 space-y-8">

            {/* Trending Categories */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <SectionHeading>📈 Trending Categories</SectionHeading>
              {sortedCategories.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400 dark:text-zinc-500">
                  No data yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {sortedCategories.map((cat) => {
                    const count = categoryCounts[cat] ?? 0;
                    const pct = Math.round((count / maxCategoryCount) * 100);
                    return (
                      <li key={cat}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-700 dark:text-zinc-300">
                            {CATEGORY_LABELS[cat]}
                          </span>
                          <span className="font-bold text-slate-500 dark:text-zinc-400">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${CATEGORY_COLORS[cat]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Recent Activity */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <SectionHeading>🕐 Recent Activity</SectionHeading>
              {recent.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400 dark:text-zinc-500">
                  No activity yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100 dark:divide-zinc-800">
                  {recent.map((issue) => (
                    <li
                      key={issue.id}
                      className="py-3 flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                          {issue.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 capitalize dark:bg-zinc-800 dark:text-zinc-400">
                            {issue.status}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500 whitespace-nowrap mt-0.5">
                        {formatRelativeTime(issue.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Right column — Top Impact + Top Trust */}
          <div className="lg:col-span-2 space-y-8">

            {/* Highest Impact Reports */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <SectionHeading>⚡ Highest Impact Reports</SectionHeading>
                <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              {topImpact.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-zinc-500">
                  No reports yet.
                </p>
              ) : (
                <ol className="space-y-3">
                  {topImpact.map((issue, idx) => {
                    const score = issue.impactScore ?? 0;
                    const scoreColor =
                      score > 70
                        ? "text-rose-600 dark:text-rose-400"
                        : score > 40
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400";

                    return (
                      <li
                        key={issue.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-950/40"
                      >
                        {/* Rank */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                          {idx + 1}
                        </span>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                            {issue.title}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-zinc-500 capitalize mt-0.5">
                            {CATEGORY_LABELS[issue.category]}
                          </p>
                        </div>

                        {/* Severity badge */}
                        <span
                          className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 capitalize ${
                            SEVERITY_STYLES[issue.severity] ??
                            SEVERITY_STYLES.medium
                          }`}
                        >
                          {issue.severity}
                        </span>

                        {/* Impact score */}
                        <span className={`shrink-0 text-xl font-black ${scoreColor}`}>
                          {score}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* Most Trusted Reports */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <SectionHeading>🏆 Most Trusted Reports</SectionHeading>
                <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              {topTrust.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-zinc-500">
                  No reports yet.
                </p>
              ) : (
                <ol className="space-y-3">
                  {topTrust.map((issue, idx) => {
                    const score = issue.trustScore ?? 0;
                    const scoreColor =
                      score > 70
                        ? "text-emerald-600 dark:text-emerald-400"
                        : score > 40
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400";

                    return (
                      <li
                        key={issue.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-950/40"
                      >
                        {/* Rank */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                          {idx + 1}
                        </span>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                            {issue.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                              </svg>
                              Verified
                            </span>
                          </div>
                        </div>

                        {/* Trust progress mini-bar */}
                        <div className="hidden sm:flex flex-col items-end gap-1 w-20 shrink-0">
                          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>

                        {/* Trust score */}
                        <span className={`shrink-0 text-xl font-black ${scoreColor}`}>
                          {score}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* Most Documented Reports */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <SectionHeading>📷 Most Documented Reports</SectionHeading>
                <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              {topDocumented.length === 0 || (topDocumented[0]?.evidenceCount || 0) === 0 ? (
                <p className="text-sm text-slate-400 dark:text-zinc-500">
                  No documented reports yet.
                </p>
              ) : (
                <ol className="space-y-3">
                  {topDocumented.filter(i => (i.evidenceCount || 0) > 0).map((issue, idx) => {
                    return (
                      <li
                        key={issue.id}
                        className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-950/40"
                      >
                        {/* Rank */}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                          {idx + 1}
                        </span>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                            {issue.title}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-zinc-500 capitalize mt-0.5">
                            {CATEGORY_LABELS[issue.category]}
                          </p>
                        </div>

                        {/* Evidence count */}
                        <div className="flex items-center gap-1.5 shrink-0 text-slate-700 dark:text-slate-300">
                          <svg className="h-4 w-4 text-slate-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xl font-black">
                            {issue.evidenceCount}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>

            {/* Top Contributors */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <SectionHeading>Top Contributors</SectionHeading>
                <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Top 5
                </span>
              </div>
              <ol className="space-y-3">
                {topContributors.map((contributor, idx) => {
                  const badge = getBadge(contributor.cred);
                  return (
                    <li
                      key={contributor.name}
                      className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-950/40"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                          {contributor.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                          {badge}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                          {contributor.cred}
                        </span>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mt-0.5">
                          CivicCred
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </div>

        {/* Empty state when no issues at all */}
        {totalReports === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-zinc-800">
                <svg className="h-10 w-10 text-slate-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              No reports in the system yet.
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              Once citizens file reports, analytics will appear here.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={handleGenerateDemoData}
                  className="inline-flex rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-indigo-700 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Generate Demo Data
                </button>
              )}
              <Link
                href="/report"
                className="inline-flex rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-700 transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                File First Report
              </Link>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
