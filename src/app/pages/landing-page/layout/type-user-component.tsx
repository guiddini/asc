import React from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

interface SearchProps {
  show: boolean;
  onHide: () => void;
}

export const USER_TYPES = [
  { label: "Visitor", value: "visitor" },
  { label: "Exhibitor", value: "exhibitor" },
  { label: "Investor", value: "investor" },
  { label: "Media", value: "media" },
  { label: "Speaker", value: "speaker" },
  { label: "Policy Makers", value: "policy_makers" },
];

const UserTypeComponent: React.FC<SearchProps> = ({ show, onHide }) => {
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
          <img
            src="/media/eventili/logos/logo.svg"
            alt="Event Logo"
            className="logo-image mb-3"
            height="60"
          />

          <p className="text-white text-center mb-4">
            Choose your user type to continue{" "}
          </p>

          <div className="d-flex flex-column gap-3 w-100">
            {USER_TYPES.map((type, index) => (
              <Link
                key={index}
                to={`/auth/signup?type=${type.value}`}
                className="type-row text-white text-decoration-none px-4 py-3"
              >
                {type.label}
              </Link>
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
          filter: invert(1);
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
