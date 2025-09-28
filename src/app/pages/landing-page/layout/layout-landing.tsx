import React from "react";
import { Container } from "react-bootstrap";
import Header from "../layout/header";
import FooterSection from "../components/footer-section";
import CookieConsentToast from "../components/cookies-consent-toast";

type LandingLayoutProps = {
  children: React.ReactNode;
};

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div id="landing-layout">
      <Header />
      <Container fluid="md" className="p-0">
        {children}
      </Container>
      <CookieConsentToast />
      <FooterSection />
    </div>
  );
};

export default LandingLayout;
