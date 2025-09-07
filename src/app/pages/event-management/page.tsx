import { useEffect } from "react";
import EventCard from "./components/event-card";
import EventManagementNav from "./components/event-management-nav";

const EventManagement = () => {
  const events = [
    {
      title: "Conférence de Presse ASC 2025",
      description:
        "La conférence de presse d'ASC 2025 sera l'occasion d'annoncer les grandes lignes de cet événement majeur, abordant des sujets essentiels concernant l'avenir du fintech et de l'e-commerce.",
      date: "21 Dec 2024 / 14:30",
      location: "Salle polyvalente centre culturel",
      image: "/media/eventili/conference-de-presse/afes.jpeg",
    },
    {
      title: "Algeria Fintech & E-commerce Summit",
      description:
        "ASC 2025 veut être un espace incontournable pour un débat constructif autour des sujets d’actualité relatifs à cet événement.",
      date: "30-31 Jan & 01 Fév",
      location: "Centre Culturel Mohammédia",
      image: "/media/eventili/afes/bg.jpg",
      href: "/home",
    },
  ];

  useEffect(() => {
    const rootContainer = document.querySelector("#root");

    if (rootContainer) {
      (rootContainer as HTMLElement).style.background = "#191919";
      (rootContainer as HTMLElement).style.height = "100%";
      (rootContainer as HTMLElement).style.display = "flex";
    }

    return () => {
      if (rootContainer) {
        (rootContainer as HTMLElement).style.background = "";
        (rootContainer as HTMLElement).style.height = "";
        (rootContainer as HTMLElement).style.display = "contents";
      }
    };
  }, []);

  return (
    <div id="event-management-page">
      <EventManagementNav />

      <div id="event-management-main">
        <span id="event-management-label">TOUS LES ÉVÉNEMENTS</span>
        <h1 id="event-management-title">Tableau de Bord des Événements</h1>
        <p id="event-management-description">
          Gérez et accédez à vos événements en toute simplicité. Passez d'un
          événement à l'autre, vérifiez les statuts et contrôlez chaque détail à
          partir d'un seul endroit.
        </p>

        <div id="event-management-tabs">
          <button className="event-management-tab active">
            Tous les Événements
          </button>
          <button className="event-management-tab">Événements à Venir</button>
          <button className="event-management-tab">Événements Passés</button>
        </div>

        <div id="event-management-grid">
          {events?.map((event, idx) => (
            <EventCard
              key={idx}
              title={event?.title}
              date={event?.date}
              image={event?.image}
              action={idx === 1 ? "Continue" : "Get Access"}
              isLocked={idx === 1 ? false : true}
              href={event?.href}
            />
          ))}
        </div>

        <button id="event-management-add-button">
          <span>Explorer plus d'événement</span>
        </button>
      </div>
    </div>
  );
};

export default EventManagement;
