import PublicEventCard from "./public-event-card";

export default function EventsSection() {
  const events = [
    {
      title: "Conférence de Presse AFES 2025",
      description:
        "La conférence de presse d'AFES 2025 sera l'occasion d'annoncer les grandes lignes de cet événement majeur, abordant des sujets essentiels concernant l'avenir du fintech et de l'e-commerce.",
      date: "21 Dec 2024 / 14:30",
      location: "Salle polyvalente centre culturel",
      image: "/media/eventili/conference-de-presse/afes.jpeg",
      url: "/profiles/conference-de-presse",
      hasPassed: true,
    },
    {
      title: "Algeria Fintech & E-commerce Summit",
      description:
        "AFES 2025 veut être un espace incontournable pour un débat constructif autour des sujets d’actualité relatifs à cet événement.",
      date: "30-31 Jan & 01 Fév",
      location: "Centre Culturel Mohammédia",
      image: "/media/eventili/afes/bg.jpg",
      url: "/profiles/afes",
      hasPassed: false,
    },
    {
      title: "Algeria 2.0",
      description:
        "5 days of innovation, networking, and learning, connecting Algeria’s brightest minds to shape the digital future.",
      date: "5 days",
      location: "Algeria",
      image: "/algeria20.avif",
      url: "/profiles/algeria-2-0",
      hasPassed: false,
    },
  ];

  return (
    <section id="events-section">
      <span id="events-label">TOUS LES ÉVÉNEMENTS</span>
      <h2 id="events-title">
        Découvrez les événements qui
        <br /> façonnent <span id="events-section-highlight">l'avenir</span>
      </h2>
      <p id="events-description">
        accédez à des événements qui stimulent votre innovation, boostent votre
        croissance et ouvrent la voie au succès.
      </p>

      <div id="public-events-grid">
        {events.map((event, index) => (
          <PublicEventCard
            key={index}
            title={event.title}
            description={event.description}
            date={event.date}
            location={event.location}
            image={event.image}
            url={event.url}
            hasPassed={event.hasPassed}
          />
        ))}
      </div>
    </section>
  );
}
