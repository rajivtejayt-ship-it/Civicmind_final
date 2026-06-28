"use client";
import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
           : type === "error" ? "bg-rose-50 text-rose-800 border-rose-200" 
           : "bg-amber-50 text-amber-800 border-amber-200";
           
  const icon = type === "success" ? "✓" : "⚠";

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 ${bg}`}>
      <span className="font-bold">{icon}</span>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
