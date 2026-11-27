import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { CityPulse } from "@/components/citypulse/CityPulse";

export const metadata: Metadata = {
  title: "City Pulse — multi-agent traffic intelligence · Satyam Kumar Thakur",
  description:
    "Case study: City Pulse, a multi-agent AI system that detects, verifies and predicts traffic disruptions and alerts commuters and traffic stations before they reach them. 2nd Runner-Up, Google Agentic AI Day 2025.",
  openGraph: { images: ["/city-pulse/poster.jpg"] },
};

export default function Page() {
  return (
    <MotionProvider>
      <CityPulse />
    </MotionProvider>
  );
}
