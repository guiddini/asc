import React, { useState } from "react";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Conference } from "../../../types/conference";
import { deleteConference } from "../../../apis/conference";

interface ConferenceActionColumnProps {
  conference: Conference;
  onEdit: () => void;
  onDeleted: () => void;
}

const ConferenceActionColumn: React.FC<ConferenceActionColumnProps> = ({
  conference,
  onEdit,
  onDeleted,
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isLoading } = useMutation(deleteConference, {
    onSuccess: () => {
      toast.success("Conférence supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["conferences"] });
      onDeleted();
      setOpenDeleteModal(false);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la conférence.");
    },
  });

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="transparent"
          id={`dropdown-${conference.id}`}
          className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
        >
          <i className="bi bi-three-dots fs-4" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to={`/conferences/${conference.id}`}
            className="d-flex align-items-center"
          >
            <i className="bi bi-eye text-success me-2" />
            Voir
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onEdit()}
            className="d-flex align-items-center"
          >
            <i className="bi bi-pencil text-primary me-2" />
            Modifier
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setOpenDeleteModal(true)}
            className="d-flex align-items-center"
          >
            <i className="bi bi-trash text-danger me-2" />
            Supprimer
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal
        show={openDeleteModal}
        onHide={() => setOpenDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer la conférence{" "}
          <strong>{conference.title}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setOpenDeleteModal(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutate(conference.id)}
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConferenceActionColumn;
