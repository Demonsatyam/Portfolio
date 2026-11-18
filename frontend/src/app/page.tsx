import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Achievements } from "@/components/sections/Achievements";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Stats } from "@/components/sections/Stats";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <MotionProvider>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Work />
        <Experience />
        <Skills />
        <Achievements />
      </main>
      <Footer />
    </MotionProvider>
  );
}
