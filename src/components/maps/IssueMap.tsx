"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CivicIssue } from "@/types/civic";

// Task 5: Marker Styling
function getIconForStatus(status: string, severity: string) {
  let color = "bg-blue-500"; // default: Reported
  
  if (severity === "critical" && status !== "resolved" && status !== "archived") {
    color = "bg-rose-500"; // Critical
  } else if (status === "resolved") {
    color = "bg-emerald-500"; // Resolved
  } else if (status === "reported") {
    color = "bg-blue-500"; // Reported
  } else if (status === "investigating" || status === "addressing" || status === "classified") {
    color = "bg-orange-500"; // Investigating
  } else if (status === "archived") {
    color = "bg-slate-400"; // Archived
  }

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div class="w-5 h-5 rounded-full border-[3px] border-white shadow-sm ${color}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

// Center the map logic
function MapBounds({ issues }: { issues: CivicIssue[] }) {
  const map = useMap();
  useEffect(() => {
    if (issues.length > 0) {
      const bounds = L.latLngBounds(issues.map(i => [i.coordinates.lat, i.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [issues, map]);
  return null;
}

export default function IssueMap({ issues }: { issues: CivicIssue[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Fix leafet default icon issue just in case
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl">
        <svg className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-slate-500 dark:text-zinc-400">
        <svg className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold">No issues available</span>
      </div>
    );
  }

  const defaultCenter: [number, number] = issues.length > 0 
    ? [issues[0].coordinates.lat, issues[0].coordinates.lng] 
    : [0, 0];

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-sm relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds issues={issues} />
        {issues.map(issue => (
          <Marker 
            key={issue.id} 
            position={[issue.coordinates.lat, issue.coordinates.lng]}
            icon={getIconForStatus(issue.status, issue.severity)}
          >
            <Popup className="civic-popup">
              <div className="flex flex-col gap-1 min-w-[200px]">
                <h3 className="font-bold text-slate-900 leading-tight">
                  {issue.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {issue.category}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${issue.severity === 'critical' ? 'text-rose-600 bg-rose-50' : issue.severity === 'high' ? 'text-orange-600 bg-orange-50' : 'text-slate-600 bg-slate-100'}`}>
                    {issue.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Trust</p>
                    <p className="font-black text-emerald-600">{issue.trustScore ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Impact</p>
                    <p className="font-black text-rose-600">{issue.impactScore ?? 0}</p>
                  </div>
                </div>
                <div className="mt-1">
                  <span className="text-xs font-semibold text-slate-700 capitalize">Status: {issue.status}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style jsx global>{`
        .civic-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .civic-popup .leaflet-popup-content {
          margin: 12px 16px;
        }
        /* Fix leaflet z-index issues in NextJS apps */
        .leaflet-container {
          z-index: 1 !important;
        }
      `}</style>
    </div>
  );
}
