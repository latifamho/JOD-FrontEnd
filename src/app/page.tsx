import { LandingAudience } from "@/components/pages/landing/landing-audience";
import { LandingCta } from "@/components/pages/landing/landing-cta";
import { LandingFeatures } from "@/components/pages/landing/landing-features";
import { LandingGalleryScroll } from "@/components/pages/landing/landing-gallery-scroll";
import { LandingHeader } from "@/components/pages/landing/landing-header";
import { LandingHero } from "@/components/pages/landing/landing-hero";
import { LandingHowItWorks } from "@/components/pages/landing/landing-how-it-works";
import { LandingImpact } from "@/components/pages/landing/landing-impact";
import { LandingParallaxStory } from "@/components/pages/landing/landing-parallax-story";
import { LandingRevealGallery } from "@/components/pages/landing/landing-reveal-gallery";
import { CinematicFooter } from "@/components/ui/motion-footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <LandingHeader />
      <main className="relative z-10 rounded-b-[2.5rem] bg-background shadow-[0_30px_60px_-15px_rgba(0,0,0,0.35)]">
        <LandingHero />
        <LandingRevealGallery />
        <LandingGalleryScroll />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingImpact />
        <LandingParallaxStory />
        <LandingAudience />
        <LandingCta />
      </main>
      <CinematicFooter />
    </div>
  );
}
