import React from "react";
import { Modal } from "react-bootstrap";

interface SearchProps {
  show: boolean;
  onHide: () => void;
}

const UserTypeComponent: React.FC<SearchProps> = ({ show, onHide }) => {
  const userTypes = ["Visiteur", "Sponsor", "Exposant", "Investisseur", "Media"];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="custom-modal"
      dialogClassName="custom-dialog"
    >
      <Modal.Header closeButton className="border-0 p-3" />

      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          {/* Logo */}
          <img
            src="/media/eventili/logos/logo.svg"
            alt="Event Logo"
            className="logo-image mb-3"
            height="60"
          />

          {/* Phrase après le logo */}
          <p className="text-white text-center mb-4">
            Choisissez votre type d’utilisateur pour continuer
          </p>

          {/* Liste des types */}
          <div className="d-flex flex-column gap-3 w-100">
            {userTypes.map((type, index) => (
              <a
                key={index}
                href="/auth/signup"
                className="type-row text-white text-decoration-none px-4 py-3"
              >
                {type}
              </a>
            ))}
          </div>
        </div>
      </Modal.Body>

      <style>{`
        .custom-dialog {
          max-width: 400px;
        }

        .custom-modal {
          background-color: #002040;
          border-radius: 12px;
        }

        .custom-modal .btn-close {
          filter: invert(1); /* bouton close en blanc */
        }

        .type-row {
          display: block;
          width: 100%;
          border: 2px solid white;
          border-radius: 6px;
          text-align: center;
          transition: background 0.3s;
        }

        .type-row:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </Modal>
  );
};

export default UserTypeComponent;
