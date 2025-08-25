import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";

export default function Agenda() {
  const [activeDay, setActiveDay] = useState(0);

  const agendaItems = [
    {
      time: "9:30 AM - 10:30 AM",
      location: "Cultural Center of the Great Mosque of Algiers",
      title: "Marketing Matters!",
      description:
        "How you transform your business as technology, consumer, habits industry dynamics change? Find out from those leading the charge.",
      speakers: [
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
      ],
      day: 0,
    },
    {
      time: "11:00 AM - 12:00 PM",
      location: "Conference Room A",
      title: "Digital Transformation Strategies",
      description:
        "Explore cutting-edge strategies for digital transformation and learn how to implement them in your organization.",
      speakers: [
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
      ],
      day: 0,
    },
    {
      time: "2:00 PM - 3:30 PM",
      location: "Main Auditorium",
      title: "AI in Business: Opportunities and Challenges",
      description:
        "Discover the latest applications of AI in business and discuss the ethical considerations and challenges that come with it.",
      speakers: [
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
      ],
      day: 1,
    },
    {
      time: "10:00 AM - 11:30 AM",
      location: "Workshop Room B",
      title: "Sustainable Business Practices",
      description:
        "Learn how to integrate sustainable practices into your business model and create long-term value for all stakeholders.",
      speakers: [
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
      ],
      day: 1,
    },
    {
      time: "1:00 PM - 2:00 PM",
      location: "Networking Lounge",
      title: "Future of Work: Remote and Hybrid Models",
      description:
        "Explore the evolving landscape of work and how organizations can adapt to remote and hybrid work models effectively.",
      speakers: [
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
        "https://media.licdn.com/dms/image/v2/D4E03AQG9g-7j5-E5Bg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731081364193?e=1738800000&v=beta&t=KwaucpmM31YdkMKIcfnfAmN78bSo1f9DJrHMNdR4irQ",
      ],
      day: 2,
    },
  ];

  const days = [
    { date: "30 Jan", label: "First Day" },
    { date: "31 Jan", label: "Second Day" },
    { date: "01 Feb", label: "Third Day" },
  ];

  const filteredAgendaItems = agendaItems.filter(
    (item) => item.day === activeDay
  );

  return (
    <section className="agenda">
      <div className="container">
        <div className="agenda-header">
          <div id="svg-container">
            <Calendar />
          </div>
          <h2>Programme de l'événement</h2>
        </div>
        <div className="agenda-nav">
          {days.map((day, index) => (
            <div
              key={index}
              className={`agenda-nav-item ${
                activeDay === index ? "active" : ""
              }`}
              onClick={() => setActiveDay(index)}
            >
              <p>{day.date}</p>
              <small>{day.label}</small>
            </div>
          ))}
        </div>

        <div id="agenda-coming-soon">
          <img
            src="/media/eventili/illustrations/coming-soon-dark.png"
            alt="Prochainement"
          />
          <p id="coming-soon-description">
            Nous innovons constamment pour améliorer votre expérience. Restez à
            l'écoute pour le lancement de nouvelles fonctionnalités qui rendront
            la gestion de vos événements encore plus performante.
          </p>
        </div>

        {/* <div className="agenda-list">
          {filteredAgendaItems.map((item, index) => (
            <>
              <div key={index} className="agenda-item">
                <div className="agenda-infos">
                  <div id="agenda-time">{item.time}</div>
                  <div id="agenda-location">
                    <MapPin />
                    <p>{item.location}</p>
                  </div>
                </div>

                <div className="agenda-details">
                  <h3 id="agenda-title">{item.title}</h3>
                  <p id="agenda-description">{item.description}</p>
                  <div className="agenda-speakers">
                    {item.speakers.map((speaker, idx) => (
                      <div key={idx} className="agenda-speaker">
                        <img
                          src={speaker}
                          alt="Speaker"
                          width={40}
                          height={40}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {index !== filteredAgendaItems.length - 1 && (
                <div className="agenda-divider"></div>
              )}
            </>
          ))}
        </div> */}
      </div>
    </section>
  );
}
