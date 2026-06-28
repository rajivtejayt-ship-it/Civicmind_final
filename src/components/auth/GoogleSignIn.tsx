"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/firebase/auth";

export default function GoogleSignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-linear-to-b from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl transition-all dark:border-zinc-800/80 dark:bg-zinc-900">
        {/* Header/Title Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-4 dark:bg-blue-500">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            CivicMind
          </h1>
          <p className="mt-2.5 text-sm text-slate-500 dark:text-zinc-400">
            Building Better Communities Together
          </p>
        </div>

        {/* Content & Action Button */}
        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="relative flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900/50 dark:active:bg-zinc-900 cursor-pointer"
          >
            {isLoading ? (
              <svg
                className="h-5 w-5 animate-spin text-slate-500 dark:text-zinc-400"
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
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path
                    d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.53c0,-0.62 -0.06,-1.21 -0.16,-1.77Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12,20.6c2.43,0 4.47,-0.81 5.96,-2.19l-3.3,-2.58c-0.91,0.61 -2.08,0.97 -3.3,0.97c-2.33,0 -4.31,-1.58 -5.02,-3.7H2.94v2.66c1.49,2.96 4.54,4.84 8.06,4.84Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.98,13.1c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V7.04H2.94c-0.6,1.21 -0.94,2.57 -0.94,4.01s0.34,2.8 0.94,4.01l4.04,-3.06Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12,6.13c1.32,0 2.51,0.45 3.44,1.34l2.58,-2.58C16.46,3.4 14.42,2.6 12,2.6c-3.52,0 -6.57,1.88 -8.06,4.84l4.04,3.06c0.71,-2.12 2.69,-3.7 5.02,-3.7Z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
