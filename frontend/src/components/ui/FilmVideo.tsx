"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Narrated film player. Next keeps visited pages alive but hidden (Cache Components / <Activity>),
 * so a playing <video> would keep playing after navigating away; pause it when the page is hidden.
 */
export function FilmVideo({ src, poster, captions }: { src: string; poster: string; captions: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useLayoutEffect(() => {
    const v = ref.current;
    return () => v?.pause();
  }, []);
  return (
    <video ref={ref} className="aspect-video w-full" controls preload="metadata" playsInline poster={poster}>
      <source src={src} type="video/mp4" />
      <track kind="captions" src={captions} srcLang="en" label="English" default />
    </video>
  );
}
