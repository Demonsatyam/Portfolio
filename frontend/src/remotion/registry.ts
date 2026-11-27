import { CityPulseReel } from "./compositions/CityPulseReel";
import { HeroReel } from "./compositions/HeroReel";
import { IdentityMerge } from "./compositions/IdentityMerge";
import { PacketPipeline } from "./compositions/PacketPipeline";
import { HERO_DURATION } from "./timeline";

/** `still` is the frame shown to reduced-motion users. */
export const compositions = {
  hero: { component: HeroReel, durationInFrames: HERO_DURATION, still: 290 },
  identity: { component: IdentityMerge, durationInFrames: 210, still: 209 },
  dpi: { component: PacketPipeline, durationInFrames: 240, still: 100 },
  citypulse: { component: CityPulseReel, durationInFrames: 270, still: 269 },
} as const;
export type CompositionId = keyof typeof compositions;
