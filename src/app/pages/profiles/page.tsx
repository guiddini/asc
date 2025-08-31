import { useNavigate, useParams } from "react-router-dom";
import Hero from "./_components/hero";
import EventInfo from "./_components/event-info";
import Agenda from "./_components/agenda";
import Gallery from "./_components/gallery";
import Description from "./_components/description";
import { useState } from "react";
import SignupPressConferenceModal from "./_components/signup-press-conference-modal";
import { useScrollNavigation } from "../../hooks/useScrollNavigation";

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

  if (slug !== "afes" && slug !== "conference-de-presse") {
    return <div>Not found</div>;
  } else {
    const [isOpen, setIsOpen] = useState(false);
    const programPath =
      "/media/eventili/afes/programme-de-l'événement-Algeria-fintech-&-E-commerce-2025.pdf";

    const fullPath = `${programPath}`;

    const data: Event[] = [
      {
        slug: "conference-de-presse",
        title: "Conference de Presse AFES 2025",
        description: `La conférence de presse d'AFES 2025 sera l'occasion d'annoncer les grandes lignes de cet événement majeur, abordant des sujets essentiels concernant l'avenir du fintech et de l'e-commerce.`,
        date: "21 Dec 2024 / 14:30",
        gallery: [
          "/media/eventili/conference-de-presse/1.jpg",
          "/media/eventili/conference-de-presse/2.jpg",
          "/media/eventili/conference-de-presse/3.jpg",
          "/media/eventili/conference-de-presse/4.jpg",
          "/media/eventili/conference-de-presse/5.jpg",
          "/media/eventili/conference-de-presse/6.jpg",
        ],
        info: "Algeria Fintech & E-commerce Summit revient pour sa 3ème édition ! Du 30 janvier au 1er février 2025, au Centre Culturel de la Grande Mosquée d’Alger, cet événement réunira des experts, des entrepreneurs et des investisseurs autour des enjeux clés de la fintech et du e-commerce.",
        location: "Cultural Center of the Great Mosque of Algiers",
        website: "https://algeriafintech.com",
        email: "Contact@algeriafintech.com",
        organizers: ["/media/eventili/logos/algeria-venture-logo.svg"],
        onClick: () => setIsOpen(true),
        hero: "/media/eventili/afes/afes.jpeg",
        showIcon: true,
      },
      {
        slug: "afes",
        title: "Algeria Fintech & E-commerce Summit",
        description: `Algeria Fintech & E-commerce Summit événement réunira des experts, des entrepreneurs et des investisseurs autour des enjeux clés de la fintech et du e-commerce. Préparez-vous à une expérience immersive de conférences, ateliers et réseautage pour découvrir l’avenir de ces secteurs en pleine croissance.`,
        date: "30-31 Jan & 01 Fev",
        gallery: [
          "/media/eventili/afes/14.jpg",
          "/media/eventili/afes/15.jpg",
          "/media/eventili/afes/1.jpg",
          "/media/eventili/afes/2.jpg",
          "/media/eventili/afes/3.jpg",
          "/media/eventili/afes/4.jpg",
          "/media/eventili/afes/5.jpg",
          "/media/eventili/afes/6.jpg",
          "/media/eventili/afes/7.jpg",
          "/media/eventili/afes/8.jpg",
          "/media/eventili/afes/9.jpg",
          "/media/eventili/afes/10.jpg",
          "/media/eventili/afes/11.jpg",
          "/media/eventili/afes/12.jpg",
          "/media/eventili/afes/13.jpg",
        ],
        info: "Algeria Fintech & E-commerce Summit revient pour sa 3ème édition ! Du 30 janvier au 1er février 2025, au Centre Culturel de la Grande Mosquée d'Alger, cet événement réunira des experts, des entrepreneurs et des investisseurs autour des enjeux clés de la fintech et du e-commerce.",
        location: "Cultural Center of the Great Mosque of Algiers",
        website: "https://algeriafintech.com",
        email: "Contact@algeriafintech.com",
        organizers: ["/media/eventili/logos/algeria-venture-logo.svg"],
        onClick: () => navigateAndScroll("tickets#tickets"),
        hero: "/media/eventili/afes/bg.jpg",
        cta: "Réserver un ticket",
        showIcon: true,
        cta2: "Télécharger le programme",
        onClick2: () => window.open(fullPath, "_blank"),
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
