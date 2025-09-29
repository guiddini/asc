import Description from "../_components/description";
import Hero from "../_components/hero";
import Navbar from "../_components/navbar";
import EventInfo from "../_components/event-info";
import { PricingCard } from "./_components/pricing-card";
import TicketSection from "./ticket-payment-results/_components/ticket-section";
import { Event } from "../page";
import { useNavigate, useParams } from "react-router-dom";
import { Ticket } from "lucide-react";
import { GALLERY_IMAGES } from "../../landing-page/data/gallery-images";

const TicketsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  if (slug !== "asc") {
    return <div>Not found</div>;
  }

  const data: Event[] = [
    {
      slug: "asc",
      title: "African Startup Conference",
      description: `The African Startup Conference has established itself as the leading pan-African gathering dedicated to innovation, entrepreneurship, and future technologies. Since its inception, it has brought together national and continental ecosystems, governments, investors, and the African diaspora around a shared ambition: to build a technologically sovereign and inclusive Africa.
Edition after edition, the African Startup Conference has become a high-level platform for dialogue and cooperation, where strategic initiatives for the continent’s future are shaped. The Algiers Declaration on Startup Development, the African Charter for Talent Retention, and more recently the continental Public Policy Framework on Artificial Intelligence all testify to the structuring impact of this event on the pan-African ecosystem.
In 2025, the Conference returns for its 4th edition, under the theme “Raising African Champions”. This edition will shine a spotlight on high-growth African startups, those already positioning themselves as major players on the continent and beyond. It will also analyze the key success factors behind these champions, access to financing, regional integration, and the adoption of advanced technologies — while strengthening the strategic bond with the African diaspora.`,
      date: "December 6 - 8, 2025",
      gallery: GALLERY_IMAGES,
      info: "Join the biggest gathering of African champions in innovation and entrepreneurship.",
      location:
        "Centre International de Conference Abdeelatif Rahal, Algiers, Algeria",
      website: "https://africanstartupconference.org",
      email: "contact@africanstartupconference.org",
      organizers: ["/media/eventili/logos/algeria-venture-logo.svg"],
      onClick: () => navigate("/profiles/asc"),
      hero: "/media/eventili/cover.webp",
      cta: "Back",
      showIcon: false,
    },
  ];

  const event = data?.find((e) => e.slug === slug);

  return (
    <div className="w-100 h-100">
      <Hero event={event} />
      <div className="profile-container">
        <div id="page-content">
          <Description event={event} />
        </div>
        <div
          className="sticky-container"
          style={{
            position: "relative",
          }}
        >
          <EventInfo event={event} />
        </div>
      </div>

      <div className="container" id="tickets">
        <div id="ticket-section-header">
          <div id="svg-container">
            <Ticket />
          </div>
          <h2>Event Tickets</h2>
        </div>
        <TicketSection />
      </div>
    </div>
  );
};

export default TicketsPage;
