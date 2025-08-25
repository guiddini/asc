import HeroSection from "./_components/hero-section";
import EventsSection from "./_components/events-section";
import Footer from "./_components/footer";
import HowItWorks from "./_components/how-it-works-section";
import Partners from "./_components/partners";
import WhyParticipate from "./_components/participate";
import Speakers from "./_components/speakers";
import Sponsors from "./_components/sponsors";
import Newsletter from "./_components/newsletter";

const LandingPage = () => {
  return (
    <div id="landing-page-body" className="w-100 h-100">
      <HeroSection />
      <WhyParticipate />
      <Sponsors />
      <Speakers />
      <Partners />
      <EventsSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export { LandingPage };
