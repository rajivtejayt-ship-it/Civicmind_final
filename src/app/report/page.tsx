"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AIClassification, CivicIssue, CivicUser } from "@/types/civic";
import { calculateTrustScore } from "@/agents/TrustAgent";
import { calculateImpactScore } from "@/agents/ImpactAgent";

export default function ReportIssuePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [severity, setSeverity] = useState("Medium");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [textEvidence, setTextEvidence] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [geoError, setGeoError] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  const [aiResult, setAiResult] = useState<AIClassification | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const handleAnalyzeAI = async () => {
    if (!title || !description) {
      setAnalysisError("Title and description are required for AI analysis.");
      return;
    }
    setAiResult(null);
    setAnalysisError("");
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Classification failed.");
      const data = await res.json();
      setAiResult({
        category: data.category,
        severity: data.severity,
        confidence: Number(data.confidence),
        reasoning: data.reasoning,
      });
      // Automatically update fields
      if (data.category) setCategory(data.category);
      if (data.severity) setSeverity(data.severity);
    } catch (err: unknown) {
      console.error(err);
      setAnalysisError((err as Error).message || "Failed to analyze issue.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetLocation = () => {
    setGeoError("");
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by this browser.");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toString());
        setLng(position.coords.longitude.toString());
        setIsDetecting(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Location permission denied.");
        } else {
          setGeoError(error.message || "Failed to retrieve location.");
        }
        setIsDetecting(false);
      }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitError("");
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      // Dynamically import Firebase to prevent build-time static generation errors
      const { auth } = await import("@/lib/firebase/client");
      const { createIssue } = await import("@/lib/firebase/issues");

      // Retrieve current user
      const user = auth.currentUser;
      if (!user) {
        setSubmitError("Please sign in again.");
        setIsSubmitting(false);
        return;
      }

      if (!lat || !lng) {
        setSubmitError("Please select a location or use Current Location.");
        setIsSubmitting(false);
        return;
      }

      const userData: CivicUser = {
        uid: user.uid,
        displayName: user.displayName || "Anonymous Citizen",
        email: user.email || "",
        photoURL: user.photoURL || undefined,
        civicCred: 25,
        badge: "New Neighbor",
        role: "citizen",
        reportsFiled: 0,
        reportsConfirmed: 0,
        reportsRejected: 0,
        isGuardian: false,
        joinedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      const categoryMap: Record<string, CivicIssue["category"]> = {
        Infrastructure: "infrastructure",
        Safety: "safety",
        Sanitation: "sanitation",
        Mobility: "mobility",
        Environment: "environment",
        Other: "other",
      };

      const severityMap: Record<string, CivicIssue["severity"]> = {
        Low: "low",
        Medium: "medium",
        High: "high",
        Critical: "critical",
      };

      const tempIssue: CivicIssue = {
        id: "",
        title,
        description,
        category: categoryMap[category],
        severity: severityMap[severity],
        coordinates: {
          lat: parseFloat(lat) || 0,
          lng: parseFloat(lng) || 0,
        },
        reporterId: user.uid,
        trustScore: 0,
        impactScore: 0, // computed by ImpactAgent below
        status: "reported",
        classificationReason: aiResult?.reasoning || "",
        recommendations: [],
        evidenceCount: (photoPreview ? 1 : 0) + (textEvidence.trim() ? 1 : 0),
        communityConfirmations: 0,
        linkedReports: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const trust = calculateTrustScore(userData, tempIssue);

      // Build the trust-enriched issue so that ImpactAgent can factor in trustScore
      const issueWithTrust: CivicIssue = {
        ...tempIssue,
        trustScore: trust.score,
        trustExplainer: trust.explainer,
      };

      const impact = calculateImpactScore(issueWithTrust);

      const issue: CivicIssue = {
        ...issueWithTrust,
        impactScore: impact.score,
        impactExplainer: impact.explainer,
      };

      await createIssue(issue);
      setSubmitSuccess(true);

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Infrastructure");
      setSeverity("Medium");
      setLat("");
      setLng("");
      setSubmitSuccess(true);
      setTimeout(() => window.location.href = "/issues", 2000);
    } catch (err: unknown) {
      console.error(err);
      setSubmitError((err as Error).message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Report an Issue
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Help improve your neighborhood.
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

        {/* Success Alert */}
        {submitSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/30 dark:text-emerald-400 transition-all">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">Report submitted successfully.</span>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="ml-auto text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Card */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                >
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Pothole on Maple Street"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the issue..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                />
              </div>

              {/* Dropdowns row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option>Infrastructure</option>
                    <option>Safety</option>
                    <option>Sanitation</option>
                    <option>Mobility</option>
                    <option>Environment</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label
                    htmlFor="severity"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Severity
                  </label>
                  <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              {/* Coordinates row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Latitude */}
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="e.g., 37.7749"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>

                {/* Longitude */}
                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="longitude"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="e.g., -122.4194"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Evidence Section */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800/80 space-y-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                  Evidence (Optional)
                </h3>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">
                    Upload Photo
                  </label>
                  {!photoPreview ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950/40 dark:file:text-blue-400 dark:hover:file:bg-blue-900/50"
                    />
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
                      >
                        Remove Photo
                      </button>
                    </div>
                  )}
                </div>

                {/* Text Notes */}
                <div>
                  <label
                    htmlFor="textEvidence"
                    className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2"
                  >
                    Text Notes
                  </label>
                  <textarea
                    id="textEvidence"
                    rows={2}
                    value={textEvidence}
                    onChange={(e) => setTextEvidence(e.target.value)}
                    placeholder="Additional details, context, or observations..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white resize-none"
                  />
                </div>
              </div>

              {/* Geolocation Button */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isDetecting}
                  className="inline-flex w-full sm:w-auto self-start items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900/50 cursor-pointer transition-all"
                >
                  {isDetecting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-slate-500 dark:text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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
                      <span>Detecting Location...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4 text-slate-500 dark:text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
                {geoError && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {geoError}
                  </p>
                )}
              </div>

              {/* Analyze with AI Button */}
              <div>
                <button
                  type="button"
                  onClick={handleAnalyzeAI}
                  disabled={isAnalyzing}
                  className="w-full flex justify-center items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/50 px-6 py-3.5 text-base font-bold text-blue-700 hover:bg-blue-50 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-400 cursor-pointer transition-all mb-4"
                >
                  {isAnalyzing ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
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
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Analyze with AI</span>
                    </>
                  )}
                </button>
                {analysisError && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-4">
                    {analysisError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 active:scale-98 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
              {submitError && (
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-3 text-center">
                  {submitError}
                </p>
              )}
            </form>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {/* AI Preview Score Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/80 pb-3 dark:border-zinc-800/80 mb-4">
                AI Preview Score
              </h3>

              <div className="space-y-6">
                {/* Estimated Trust Score */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                      Estimated Trust Score
                    </span>
                    <span className="text-xl font-black text-blue-600 dark:text-blue-500">
                      75
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full w-[75%] rounded-full bg-blue-600 dark:bg-blue-500" />
                  </div>
                </div>

                {/* Badge Indicator */}
                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                    Badge status
                  </span>
                  <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-700/10 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-400/20">
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
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Community Verified Candidate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Classification Results Card */}
            {aiResult && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-zinc-800/80 dark:bg-zinc-900 transition-all">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/80 pb-3 dark:border-zinc-800/80 mb-4 flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-blue-600 dark:text-blue-500"
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
                  <span>AI Classification</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Category
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {aiResult.category}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Severity
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {aiResult.severity}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        Confidence
                      </span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-500">
                        {aiResult.confidence}%
                      </span>
                    </div>
                    {/* Confidence Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                        style={{ width: `${aiResult.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Reasoning
                    </span>
                    <p className="text-sm text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">
                      {aiResult.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
