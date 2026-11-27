import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { DPI } from "@/components/dpi/DPI";

export const metadata: Metadata = {
  title: "DPI Engine — deep packet inspection · Satyam Kumar Thakur",
  description:
    "Case study: a Deep Packet Inspection engine that parses captured traffic, tracks flows by Five-Tuple, identifies applications from TLS SNI and HTTP Host, applies blocking rules and writes a filtered capture with a report.",
  openGraph: { images: ["/dpi/poster.jpg"] },
};

export default function Page() {
  return (
    <MotionProvider>
      <DPI />
    </MotionProvider>
  );
}
