import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  Image,
  Spinner,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { getUsersPerRole, UsersResponse } from "../../../apis";
import { addSpeakerToConference } from "../../../apis/conference";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface AddSpeakerToConferenceModalProps {
  conferenceId: string;
  show: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const ROLE_SPEAKER_ID = "10";

const AddSpeakerToConferenceModal: React.FC<
  AddSpeakerToConferenceModalProps
> = ({ conferenceId, show, onClose, onAdded }) => {
  const queryClient = useQueryClient();

  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users with role "speaker" (role id "10")
  const { data, isLoading, isError, refetch } = useQuery<UsersResponse>(
    ["usersPerRole", ROLE_SPEAKER_ID, page, searchTerm],
    () => getUsersPerRole(ROLE_SPEAKER_ID, page, searchTerm),
    {
      enabled: show,
      keepPreviousData: true,
      retry: 1,
    }
  );

  // Mutation to add speaker to conference
  const { mutate, isLoading: isAssigning } = useMutation(
    (userId: string) => addSpeakerToConference(conferenceId, userId),
    {
      onSuccess: () => {
        toast.success("Conférencier ajouté avec succès");
        queryClient.invalidateQueries(["conferences", conferenceId]);
        onAdded();
      },
      onError: () => {
        toast.error("Erreur lors de l'ajout du conférencier");
      },
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleAssignClick = (userId: string) => {
    if (isAssigning) return;
    mutate(userId);
  };

  // Pagination items
  const renderPagination = () => {
    if (!data || data.last_page <= 1) return null;

    const items = [];

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(data.last_page, page + 2);

    if (data.prev_page_url) {
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        />
      );
    } else {
      items.push(<Pagination.Prev key="prev" disabled />);
    }

    for (let p = startPage; p <= endPage; p++) {
      items.push(
        <Pagination.Item key={p} active={p === page} onClick={() => setPage(p)}>
          {p}
        </Pagination.Item>
      );
    }

    if (data.next_page_url) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => setPage((p) => Math.min(p + 1, data.last_page))}
        />
      );
    } else {
      items.push(<Pagination.Next key="next" disabled />);
    }

    return <Pagination>{items}</Pagination>;
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      scrollable
      centered
      aria-labelledby="add-speaker-modal-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="add-speaker-modal-title">
          Ajouter un conférencier
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputGroup
          className="mb-3"
          role="search"
          aria-label="Recherche de conférenciers"
        >
          <FormControl
            placeholder="Rechercher par nom, prénom ou email"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={isLoading}
          />
        </InputGroup>

        {isLoading && (
          <div
            className="d-flex justify-content-center py-4"
            aria-live="polite"
            aria-busy="true"
          >
            <Spinner animation="border" role="status" aria-hidden="true" />
            <span className="visually-hidden">
              Chargement des utilisateurs...
            </span>
          </div>
        )}

        {isError && (
          <p className="text-danger" role="alert">
            Erreur lors du chargement des utilisateurs.
          </p>
        )}

        {!isLoading && data && data.data.length === 0 && (
          <p className="text-center">
            Aucun conférencier trouvé correspondant à la recherche.
          </p>
        )}

        {!isLoading && data && data.data.length > 0 && (
          <>
            <ListGroup as="ul" className="flex-column" role="list">
              {data.data.map((user) => (
                <ListGroup.Item
                  as="li"
                  key={user.id}
                  className="d-flex align-items-center justify-content-between flex-wrap"
                >
                  <Row className="align-items-center w-100 g-2">
                    <Col xs="auto" className="pe-0 me-3">
                      <Image
                        src={getMediaUrl(user?.avatar)}
                        roundedCircle
                        width={50}
                        height={50}
                        alt={`Avatar de ${user.fname} ${user.lname}`}
                      />
                    </Col>
                    <Col xs className="mb-1 mb-sm-0">
                      <div className="fw-semibold">
                        {user.fname} {user.lname}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {user.email}
                      </div>
                    </Col>
                    <Col xs="auto">
                      <Button
                        size="sm"
                        onClick={() => handleAssignClick(user.id)}
                        disabled={isAssigning}
                        aria-label={`Ajouter ${user.fname} ${user.lname} comme conférencier`}
                      >
                        {isAssigning ? "Ajout..." : "Ajouter"}
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div
              className="d-flex justify-content-center mt-3"
              aria-label="Pagination des conférenciers"
            >
              {renderPagination()}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isAssigning}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSpeakerToConferenceModal;
