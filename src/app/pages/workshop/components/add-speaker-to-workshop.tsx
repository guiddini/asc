// AddSpeakerToWorkshopModal component
import React, { useState } from "react";
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
import { getAllSpeakers, SpeakersResponse } from "../../../apis/speaker";
import { addSpeakerToWorkshop } from "../../../apis/workshop";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface AddSpeakerToWorkshopModalProps {
  workshopId: string;
  show: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const AddSpeakerToWorkshopModal: React.FC<AddSpeakerToWorkshopModalProps> = ({
  workshopId,
  show,
  onClose,
  onAdded,
}) => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useQuery<SpeakersResponse>(
    ["speakers", page],
    () => getAllSpeakers(page),
    {
      enabled: show,
      keepPreviousData: true,
      retry: 1,
    }
  );

  const { mutate, isLoading: isAssigning } = useMutation(
    (userId: string) => addSpeakerToWorkshop(workshopId, userId),
    {
      onSuccess: () => {
        toast.success("Speaker added successfully");
        queryClient.invalidateQueries(["show-workshop", workshopId]);
        onAdded();
      },
      onError: () => {
        toast.error("Error adding the speaker");
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

  const filteredSpeakers =
    !isLoading && data
      ? data.data.filter((s) => {
          const q = searchTerm.trim().toLowerCase();
          if (!q) return true;
          return (
            s.fname.toLowerCase().includes(q) ||
            s.lname.toLowerCase().includes(q)
          );
        })
      : [];

  return (
    <Modal show={show} onHide={onClose} size="lg" scrollable centered>
      <Modal.Header closeButton>
        <Modal.Title>Add a speaker</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputGroup className="mb-3" role="search" aria-label="Search speakers">
          <FormControl
            placeholder="Search by first or last name"
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
            <span className="visually-hidden">Loading speakers...</span>
          </div>
        )}

        {isError && (
          <p className="text-danger" role="alert">
            Error loading speakers.
          </p>
        )}

        {!isLoading && data && filteredSpeakers.length === 0 && (
          <p className="text-center">No speakers found for your search.</p>
        )}

        {!isLoading && data && filteredSpeakers.length > 0 && (
          <>
            <ListGroup as="ul" className="flex-column" role="list">
              {filteredSpeakers.map((speaker) => (
                <ListGroup.Item
                  as="li"
                  key={speaker.id}
                  className="d-flex align-items-center justify-content-between flex-wrap"
                >
                  <Row className="align-items-center w-100 g-2">
                    <Col xs="auto" className="pe-0 me-3">
                      <Image
                        src={getMediaUrl(speaker?.avatar ?? "")}
                        roundedCircle
                        width={50}
                        height={50}
                        alt={`Avatar of ${speaker.fname} ${speaker.lname}`}
                      />
                    </Col>
                    <Col xs className="mb-1 mb-sm-0">
                      <div className="fw-semibold">
                        {speaker.fname} {speaker.lname}
                      </div>
                    </Col>
                    <Col xs="auto">
                      <Button
                        size="sm"
                        onClick={() => handleAssignClick(speaker.id)}
                        disabled={isAssigning}
                        aria-label={`Add ${speaker.fname} ${speaker.lname} as speaker`}
                      >
                        {isAssigning ? "Adding..." : "Add"}
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div
              className="d-flex justify-content-center mt-3"
              aria-label="Speakers pagination"
            >
              {renderPagination()}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isAssigning}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSpeakerToWorkshopModal;
