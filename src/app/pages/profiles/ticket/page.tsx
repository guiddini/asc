import Footer from "../../landing/_components/footer";
import Description from "../_components/description";
import Hero from "../_components/hero";
import Navbar from "../_components/navbar";
import EventInfo from "../_components/event-info";
import { PricingCard } from "./_components/pricing-card";
import TicketSection from "./ticket-payment-results/_components/ticket-section";
import { Event } from "../page";
import { useNavigate, useParams } from "react-router-dom";
import { Ticket } from "lucide-react";

const TicketsPage = () => {
  const { slug } = useParams();

  const navigate = useNavigate();

  if (slug !== "afes") {
    return <div>Not found</div>;
  }
  const data: Event[] = [
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
      organizers: ["/media/eventili/logos/guiddini.svg"],
      onClick: () => navigate("/profiles/afes"),
      hero: "/media/eventili/afes/bg.jpg",
      cta: "Retour",
      showIcon: false,
    },
  ];
  const event = data?.find((e) => e.slug === slug);

  return (
    <div className="w-100 h-100">
      <Navbar />
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
          <h2>Ticket d'événement</h2>
        </div>
        <TicketSection />
      </div>

      <Footer />
    </div>
  );
};

export default TicketsPage;
