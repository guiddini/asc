import HeroSection from "./_components/hero-section";
import EventsSection from "./_components/events-section";
import Footer from "./_components/footer";
import HowItWorks from "./_components/how-it-works-section";

const LandingPage = () => {
  return (
    <div id="landing-page-body" className="w-100 h-100">
      <HeroSection />
      <EventsSection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export { LandingPage };
