import { AppStatsSection } from "./_components/app-stats-section";
import { CtaBanner } from "./_components/cta-banner";
import { ExpressBar } from "./_components/express-bar";
import { HeroSection } from "./_components/hero-section";
import { HowItWorks } from "./_components/how-it-works";
import { RestaurantShowcase } from "./_components/restaurant-showcase";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ExpressBar />
      <RestaurantShowcase />
      <HowItWorks />
      <AppStatsSection />
      <CtaBanner />
    </>
  );
}
