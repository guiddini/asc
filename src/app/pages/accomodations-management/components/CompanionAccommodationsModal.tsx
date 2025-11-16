import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { getCompanionAccommodations } from "../../../apis/accommodations";
import moment from "moment";
import getMediaUrl from "../../../helpers/getMediaUrl";

export const CompanionAccommodationsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onOpenAccommodation?: (accommodationId: string) => void;
}> = ({ isOpen, onClose, userId, onOpenAccommodation }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["companion-accommodations", userId],
    queryFn: () => getCompanionAccommodations(userId),
    enabled: isOpen && !!userId,
  });

  const list = Array.isArray(data) ? data : (data as any)?.data || [];

  return (
    <Modal show={isOpen} onHide={onClose} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Companion Accommodations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" size="sm" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-muted">No accommodations found.</div>
        ) : (
          <table className="table align-middle table-row-dashed">
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row: any) => (
                <tr key={String(row?.id)}>
                  <td className="d-flex align-items-center gap-3">
                    <img
                      src={getMediaUrl(row?.hotel?.logo)}
                      alt={row?.hotel?.name || "Hotel"}
                      style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }}
                    />
                    <span>{row?.hotel?.name || row?.hotel_id}</span>
                  </td>
                  <td>{moment(row?.check_in).format("YYYY-MM-DD")}</td>
                  <td>{moment(row?.check_out).format("YYYY-MM-DD")}</td>
                  <td>
                    <button
                      className="btn btn-light-primary btn-sm"
                      onClick={() => onOpenAccommodation && onOpenAccommodation(String(row?.id))}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal.Body>
    </Modal>
  );
};