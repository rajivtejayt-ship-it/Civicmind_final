"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import GoogleSignIn with SSR disabled to prevent server-side Firebase initialization errors at build-time.
// This requires the containing component to be a client component.
const GoogleSignIn = dynamic(
  () => import("@/components/auth/GoogleSignIn"),
  { ssr: false }
);

export default function SignInPage() {
  return (
    <main>
      <GoogleSignIn />
    </main>
  );
}
