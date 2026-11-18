"use client";

import dynamic from "next/dynamic";

// Remotion Player reads the clock on render, so it only runs in the browser; the placeholder keeps the layout stable.
export const Reel = dynamic(() => import("./ReelPlayer"), {
  ssr: false,
  loading: () => <div className="aspect-video w-full bg-[#0a0a0b]" />,
});
