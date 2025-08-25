import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import UpdateShareLinkSuccess from "./update-share-link-success";
import UpdateShareLinkForm from "./update-share-link-form";

interface TicketType {
  id: string;
  name: string;
  slug: string;
  price: string;
}

interface TicketData {
  id: number;
  user_id: string;
  ticket_id: string;
  gifted_to_user_id: string | null;
  role_slug: string;
  is_used: number;
  is_assigned: number;
  source: string;
  created_at: string;
  updated_at: string;
  transaction_id: string | null;
  type: TicketType;
}

interface UpdateShareLinkModalProps {
  show: boolean;
  onHide: () => void;
  currentData: {
    title: string;
    roleSlug: string;
    quantity: number;
    link: string;
  };
}

const UpdateShareLinkModal: React.FC<UpdateShareLinkModalProps> = ({
  show,
  onHide,
  currentData,
}) => {
  const [updatedLink, setUpdatedLink] = useState<string | null>(null);

  const handleUpdateSuccess = (link: string) => {
    setUpdatedLink(link);
  };

  return (
    <div id="update-share-link-modal">
      <Modal
        show={show}
        onHide={onHide}
        centered
        dialogClassName="modal-dialog modal-dialog-centered mw-900px"
      >
        <div id="update-share-link-modal-content">
          <Modal.Header closeButton>
            <div id="share-link-modal-title">Modifier le lien de partage</div>
          </Modal.Header>

          <Modal.Body>
            {updatedLink ? (
              <UpdateShareLinkSuccess link={updatedLink} />
            ) : (
              <UpdateShareLinkForm
                onUpdateSuccess={handleUpdateSuccess}
                currentData={currentData}
              />
            )}
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateShareLinkModal;
