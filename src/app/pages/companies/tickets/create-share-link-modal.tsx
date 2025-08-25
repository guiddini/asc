import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import CreateShareLinkForm from "./create-share-link-form";
import CreateShareLinkSuccess from "./create-share-link-success";

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

interface CreateShareLinkModalProps {
  show: boolean;
  onHide: () => void;
  pricingData: TicketData[];
}

const CreateShareLinkModal: React.FC<CreateShareLinkModalProps> = ({
  show,
  onHide,
  pricingData,
}) => {
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const handleSubmitSuccess = (link: string) => {
    setCreatedLink(link);
  };

  return (
    <div id="share-link-modal">
      <Modal
        show={show}
        onHide={onHide}
        centered
        dialogClassName="modal-dialog modal-dialog-centered mw-900px"
      >
        <div id="share-link-modal-content">
          <Modal.Header closeButton>
            <div id="share-link-modal-title">Lien de partage</div>
          </Modal.Header>

          <Modal.Body>
            {createdLink ? (
              <CreateShareLinkSuccess link={createdLink} />
            ) : (
              <CreateShareLinkForm
                pricingData={pricingData}
                onSubmitSuccess={handleSubmitSuccess}
              />
            )}
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default CreateShareLinkModal;
