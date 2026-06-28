"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CivicIssue, IssueStatus } from "@/types/civic";
import { getBadge } from "@/agents/BadgeAgent";
import { Toast, ToastType } from "@/components/ui/Toast";

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

export default function IssuesPage() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const isDemo = typeof sessionStorage !== "undefined" && sessionStorage.getItem("civicmind-demo-active") === "true";
        let data: CivicIssue[] = [];
        
        if (isDemo) {
          const demoDataStr = sessionStorage.getItem("civicmind-demo-data");
          if (demoDataStr) data = JSON.parse(demoDataStr);
        }

        if (!data || data.length === 0) {
          const { getIssues } = await import("@/lib/firebase/issues");
          data = await getIssues();
        }

        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setIssues(sorted);
      } catch (error) {
        console.error("Failed to load issues:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    setIssues((current) =>
      current.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );

    try {
      const isDemo = typeof sessionStorage !== "undefined" && sessionStorage.getItem("civicmind-demo-active") === "true";
      if (!isDemo) {
        const { updateIssueStatus } = await import("@/lib/firebase/issues");
        await updateIssueStatus(issueId, newStatus);
      } else {
        // Update in session storage if in demo mode
        const demoDataStr = sessionStorage.getItem("civicmind-demo-data");
        if (demoDataStr) {
          const demoData: CivicIssue[] = JSON.parse(demoDataStr);
          const updated = demoData.map(i => i.id === issueId ? { ...i, status: newStatus } : i);
          sessionStorage.setItem("civicmind-demo-data", JSON.stringify(updated));
        }
      }
      setToast({ message: "Status Updated", type: "success" });
    } catch (error) {
      console.error("Failed to update status:", error);
      setToast({ message: "Update Failed", type: "error" });
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  };

  const getSeverityStyles = (severity: string) => {
    const s = severity.toLowerCase();
    switch (s) {
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40";
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-800/40";
    }
  };

  const getTrustStyles = (score: number) => {
    if (score <= 40) return "text-rose-600 dark:text-rose-400";
    if (score <= 70) return "text-amber-600 dark:text-amber-400";
    return "text-emerald-600 dark:text-emerald-400";
  };

  /**
   * Impact colour coding:
   *   0–40  → Green  (low urgency)
   *   41–70 → Amber  (moderate urgency)
   *   71–100 → Red   (high priority)
   */

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40";
      case "classified":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/40";
      case "investigating":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40";
      case "addressing":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/40";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40";
      case "archived":
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-zinc-900/20 dark:text-zinc-400 dark:border-zinc-800/40";
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Community Feed
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Browse recently reported issues.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </header>

        {/* States Section */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-5 w-20 bg-slate-200 dark:bg-zinc-800 rounded-full"></div>
                  <div className="h-5 w-16 bg-slate-200 dark:bg-zinc-800 rounded-full"></div>
                </div>
                <div>
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded-md mb-2"></div>
                  <div className="h-4 w-full bg-slate-200 dark:bg-zinc-800 rounded-md"></div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <div className="h-4 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded-md mb-2"></div>
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-zinc-800 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
            <svg
              className="mx-auto h-10 w-10 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              Unable to load issues.
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
              Please check your connection and try refreshing the page.
            </p>
          </div>
        )}

        {!isLoading && !hasError && issues.length === 0 && (
          <div className="rounded-2xl border border-slate-200 border-dashed p-16 text-center dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-zinc-800">
                <svg className="h-10 w-10 text-slate-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No issues available
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
              There are currently no reports in this community. Be the first to file a civic issue.
            </p>
            <div className="mt-6">
              <Link
                href="/report"
                className="inline-flex rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-700 hover:shadow-sm transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Report Issue
              </Link>
            </div>
          </div>
        )}

        {/* Actions / Map Toggle */}
        {!isLoading && !hasError && issues.length > 0 && (
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Reports</h2>
            <button
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-800/80 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {showMap ? "Hide Map" : "Show Map"}
            </button>
          </div>
        )}

        {/* Map View */}
        {showMap && !isLoading && !hasError && issues.length > 0 && (
          <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-zinc-800 relative z-0">
            <IssueMap issues={issues} />
          </div>
        )}

        {/* Issue Cards Grid */}
        {!isLoading && !hasError && issues.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`rounded-2xl border bg-white p-6 shadow-xs hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                  issue.status === "archived" && issue.severity !== "critical"
                    ? "opacity-60 saturate-50 border-slate-200/50 dark:border-zinc-800/50 dark:bg-zinc-900/50"
                    : issue.severity === "critical"
                    ? "border-rose-200/80 dark:border-rose-900/40 dark:bg-zinc-900"
                    : "border-slate-200/80 dark:border-zinc-800/80 dark:bg-zinc-900"
                }`}
              >
                <div className="space-y-4">
                  {/* Top tags row */}
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-blue-700 ring-1 ring-blue-700/10 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-400/20">
                        {issue.category}
                      </span>
                      {issue.evidenceCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {issue.evidenceCount} Evidence
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getSeverityStyles(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {issue.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400 line-clamp-3">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Details Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/60 space-y-3.5">
                  {/* Trust & Impact row */}
                  <div className="flex flex-col gap-3">
                    {/* Trust Bar */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                          Trust
                        </span>
                        <span className={`text-xs font-bold ${getTrustStyles(issue.trustScore ?? 0)}`} title={issue.trustExplainer?.reason}>
                          {issue.trustScore ?? 0}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            (issue.trustScore ?? 0) > 80 ? 'bg-emerald-500' :
                            (issue.trustScore ?? 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, issue.trustScore ?? 0))}%` }}
                        />
                      </div>
                    </div>

                    {/* Impact Bar */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                          Impact
                        </span>
                        <span className={`text-xs font-bold ${
                          (issue.impactScore ?? 0) <= 40 ? 'text-emerald-500' :
                          (issue.impactScore ?? 0) <= 70 ? 'text-amber-500' : 'text-rose-500'
                        }`} title={issue.impactExplainer?.reason}>
                          {issue.impactScore ?? 0}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            (issue.impactScore ?? 0) <= 40 ? 'bg-emerald-500' :
                            (issue.impactScore ?? 0) <= 70 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, issue.impactScore ?? 0))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status row */}
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <span className="font-semibold text-slate-400 dark:text-zinc-500">
                      Status:
                    </span>
                    <div className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 ${getStatusStyles(issue.status)}`}>
                      {issue.status === "resolved" && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value as IssueStatus)}
                        className="appearance-none bg-transparent font-bold focus:outline-none cursor-pointer capitalize pr-4"
                        style={{
                          backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right center',
                          backgroundSize: '12px'
                        }}
                      >
                        <option value="reported" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">Reported</option>
                        <option value="classified" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">Classified</option>
                        <option value="investigating" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">Investigating</option>
                        <option value="addressing" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">Addressing</option>
                        <option value="resolved" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">Resolved</option>
                        <option value="archived" className="text-slate-900 bg-white dark:bg-zinc-800 dark:text-white">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* ── Trust explainer disclosure ── */}
                  {issue.trustExplainer && (
                    <details className="group rounded-lg border border-slate-100 dark:border-zinc-800/60 bg-slate-50/60 dark:bg-zinc-950/30 overflow-hidden">
                      <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 select-none list-none hover:bg-slate-100 dark:hover:bg-zinc-900/60 transition-colors">
                        <span>Why this trust score?</span>
                        <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-3 pt-1 pb-3 space-y-1.5">
                        {([
                          { label: "Reputation", value: issue.trustExplainer.reporterCivicCredContribution },
                          { label: "Evidence", value: issue.trustExplainer.evidenceMultiplier },
                          { label: "Community", value: issue.trustExplainer.verificationWeight },
                          { label: "Penalty", value: -issue.trustExplainer.anomalyPenalty },
                        ] as { label: string; value: number }[]).map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                              <span className="text-emerald-500">✓</span> {label}
                            </span>
                            <span className={`font-bold tabular-nums ${
                              value > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                              value < 0 ? 'text-rose-500 dark:text-rose-400' :
                              'text-slate-400 dark:text-zinc-500'
                            }`}>
                              {value > 0 ? `+${value}` : value}
                            </span>
                          </div>
                        ))}
                        <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-600 dark:text-zinc-300">Base score</span>
                          <span className="font-bold text-slate-700 dark:text-zinc-200">{issue.trustExplainer.baseScore}</span>
                        </div>
                      </div>
                    </details>
                  )}

                  {/* ── Impact explainer disclosure ── */}
                  {issue.impactExplainer && (
                    <details className="group rounded-lg border border-slate-100 dark:border-zinc-800/60 bg-slate-50/60 dark:bg-zinc-950/30 overflow-hidden">
                      <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 select-none list-none hover:bg-slate-100 dark:hover:bg-zinc-900/60 transition-colors">
                        <span>Why this impact score?</span>
                        <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-3 pt-1 pb-3 space-y-1.5">
                        {([
                          { label: "Severity", value: issue.impactExplainer.severityMultiplier },
                          { label: "Trust", value: issue.impactExplainer.baseWeight },
                          { label: "Community", value: issue.impactExplainer.densityFactor },
                          { label: "Age", value: issue.impactExplainer.durationDaysFactor },
                        ] as { label: string; value: number }[]).map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-1 text-slate-500 dark:text-zinc-400">
                              <span className="text-emerald-500">✓</span> {label}
                            </span>
                            <span className={`font-bold tabular-nums ${
                              value > 0 ? 'text-emerald-600 dark:text-emerald-400' :
                              value < 0 ? 'text-rose-500 dark:text-rose-400' :
                              'text-slate-400 dark:text-zinc-500'
                            }`}>
                              {value > 0 ? `+${value}` : value}
                            </span>
                          </div>
                        ))}
                        <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-600 dark:text-zinc-300">Final score</span>
                          <span className="font-bold text-slate-700 dark:text-zinc-200">{issue.impactExplainer.finalScore}</span>
                        </div>
                      </div>
                    </details>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{getBadge((issue.title.length * 27) % 600)}</span>
                    </div>
                    <span className="text-slate-400 dark:text-zinc-500 font-medium">
                      {formatRelativeTime(issue.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
