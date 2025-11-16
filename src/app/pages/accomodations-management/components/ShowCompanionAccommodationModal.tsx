import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { showCompanionAccommodation } from "../../../apis/accommodations";
import moment from "moment";
import getMediaUrl from "../../../helpers/getMediaUrl";

export const ShowCompanionAccommodationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  accommodationId: string;
}> = ({ isOpen, onClose, userId, accommodationId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["show-companion-accommodation", userId, accommodationId],
    queryFn: () => showCompanionAccommodation(userId, accommodationId),
    enabled: isOpen && !!userId && !!accommodationId,
  });

  const acc = (data as any)?.data || data || {};

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Companion Accommodation Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <img
                src={getMediaUrl(acc?.hotel?.logo)}
                alt={acc?.hotel?.name || "Hotel"}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
              <div>
                <div className="fw-bold">
                  {acc?.hotel?.name || acc?.hotel_id || "Hotel"}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {acc?.room || acc?.room_type || ""}
                </div>
              </div>
            </div>
            <div>
              <div>
                <span className="fw-semibold">Check In:</span>{" "}
                {acc?.check_in
                  ? moment(acc.check_in).format("YYYY-MM-DD")
                  : "-"}
              </div>
              <div>
                <span className="fw-semibold">Check Out:</span>{" "}
                {acc?.check_out
                  ? moment(acc.check_out).format("YYYY-MM-DD")
                  : "-"}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
