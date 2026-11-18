// Kept free of Remotion imports so the page can read it without pulling Remotion into the main bundle.
/** Scene timeline. Scenes overlap by FADE frames and cross-fade. */
export const SCENES = [
  { label: "Every tap", from: 0, dur: 90 },
  { label: "becomes a request", from: 78, dur: 108 },
  { label: "routed through the backend", from: 174, dur: 120 },
  { label: "measured in production", from: 282, dur: 93 },
] as const;
export const HERO_DURATION = 375;
