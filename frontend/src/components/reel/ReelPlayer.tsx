"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import { compositions, type CompositionId } from "@/remotion/registry";
import { FPS, H, W } from "@/remotion/theme";

type Props = {
  id: CompositionId;
  label: string;
  /** Pauses playback regardless of visibility. */
  paused?: boolean;
  /** Called on every rendered frame — keep it cheap (e.g. set a MotionValue). */
  onFrame?: (frame: number) => void;
};

/** Remotion composition that loops while on screen; reduced-motion users get a still frame. */
export default function ReelPlayer({ id, label, paused = false, onFrame }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  // State, not a ref: the Player's handle arrives after first render and the effects must re-run when it does.
  const [player, setPlayer] = useState<PlayerRef | null>(null);
  const visible = useRef(false);
  const pausedRef = useRef(paused);
  const { component, durationInFrames, still } = compositions[id];

  useEffect(() => {
    pausedRef.current = paused;
    if (!player) return;
    if (visible.current && !paused) player.play();
    else player.pause();
  }, [paused, player]);

  useEffect(() => {
    const el = wrap.current;
    const p = player;
    if (!el || !p) return;
    const sync = () => (visible.current && !pausedRef.current ? p.play() : p.pause());
    const onUpdate = (e: { detail: { frame: number } }) => onFrame?.(e.detail.frame);
    p.addEventListener("frameupdate", onUpdate);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.seekTo(still);
      return () => p.removeEventListener("frameupdate", onUpdate);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        sync();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      p.removeEventListener("frameupdate", onUpdate);
    };
  }, [player, still, onFrame]);

  return (
    <div ref={wrap} role="img" aria-label={label} className="aspect-video w-full overflow-hidden">
      <Player
        ref={setPlayer}
        component={component}
        durationInFrames={durationInFrames}
        fps={FPS}
        compositionWidth={W}
        compositionHeight={H}
        style={{ width: "100%", height: "100%" }}
        loop
        // Silent reels. Unmuted, the Player waits for an AudioContext that browsers keep suspended until a click — frames never advance.
        initiallyMuted
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        acknowledgeRemotionLicense
      />
    </div>
  );
}
