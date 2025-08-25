import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Phone, X } from "lucide-react";

interface ContactPerson {
  image: string;
  department: string;
  phone: string;
  email: string;
}

interface ContactModalProps {
  show: boolean;
  onHide: () => void;
}

const contactTeam: ContactPerson[] = [
  {
    image: "/media/eventili/staff/mourad.svg",
    department: "SPONSORING ET PARTENARIATS",
    phone: "+213 550 54 52 99",
    email: "mourad@guiddini.com",
  },
  {
    image: "/media/eventili/staff/nayla.svg",
    department: "EXPOSANTS",
    phone: "+213 799 17 49 17",
    email: "nayla@guiddini.com",
  },
  {
    image: "/media/eventili/staff/reyma.svg",
    department: "EXPOSANTS",
    phone: "+213 770 77 49 99",
    email: "ryma@guiddini.com",
  },
];

const ContactModal: React.FC<ContactModalProps> = ({ show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="modal-dialog modal-dialog-centered mw-600px"
    >
      <Modal.Body>
        <div id="modal-header">
          <h2 id="modal-title">Besoin d'aide ? Contactez notre équipe</h2>
          <button id="close-button" onClick={onHide}>
            <X size={24} />
          </button>
        </div>

        <div id="modal-body">
          {contactTeam.map((person, index) => (
            <div key={index} id="contact-person">
              <div id="avatar-wrapper">
                <img
                  src={person.image}
                  alt={`${person.department} contact`}
                  id="contact-avatar"
                />
              </div>
              <div id="contact-details">
                <h3 id="contact-department">{person.department}</h3>
                <p id="contact-phone">{person.phone}</p>
                <a id="contact-email" href={`mailto:${person.email}`}>
                  {person.email}
                </a>
              </div>
            </div>
          ))}

          <p id="contact-description">
            Notre équipe dédiée est là pour vous aider à répondre à toutes vos
            questions ou préoccupations concernant votre réservation ou votre
            choix de stand.
          </p>

          <a
            href="https://algeriafintech.com/contacts/"
            target="_blank"
            id="contact-button"
          >
            <Phone size={20} />
            Contactez-Nous
          </a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ContactModal;
