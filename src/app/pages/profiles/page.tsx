import { useNavigate, useParams } from "react-router-dom";
import Hero from "./_components/hero";
import EventInfo from "./_components/event-info";
import Agenda from "./_components/agenda";
import Gallery from "./_components/gallery";
import Description from "./_components/description";
import { useState } from "react";
import SignupPressConferenceModal from "./_components/signup-press-conference-modal";
import { useScrollNavigation } from "../../hooks/useScrollNavigation";
import { GALLERY_IMAGES } from "../landing-page/data/gallery-images";

export interface Event {
  slug: string;
  title: string;
  description: string;
  date: string;
  gallery: string[];
  info: string;
  hero: string;
  location: string;
  website: string;
  email: string;
  cta?: string;
  organizers: string[];
  onClick: () => void;
  showIcon?: boolean;
  cta2?: string;
  onClick2?: () => void;
}

const EntityProfilePage = () => {
  const { slug } = useParams();

  const navigateAndScroll = useScrollNavigation();

  if (slug !== "asc") {
    return <div>Not found</div>;
  } else {
    const [isOpen, setIsOpen] = useState(false);

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
        onClick: () => navigateAndScroll("tickets#tickets"),
        hero: "/media/eventili/cover.webp",
        cta: "Join the Conference",
        showIcon: true,
      },
    ];

    const event = data?.find((e) => e.slug === slug);

    return (
      <div className="w-100 h-100">
        <Hero event={event} />
        <div className="profile-container">
          <div id="page-content">
            <Description event={event} />
            {/* <Agenda /> */}
            <Gallery event={event} />
          </div>
          <div className="sticky-container">
            <EventInfo event={event} />
          </div>
        </div>

        <SignupPressConferenceModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  }
};

export { EntityProfilePage };
