import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Spinner, Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { TableColumn } from "react-data-table-component";
import { getAllHotels, deleteHotel } from "../../apis/hotels";
import { TableComponent } from "../../components";
import { Hotel } from "../../types/hotel";
import { CreateHotelModal } from "./components/CreateHotelModal";
import { UpdateHotelModal } from "./components/UpdateHotelModal";
import getMediaUrl from "../../helpers/getMediaUrl";

const HotelsManagementPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => getAllHotels(),
  });

  const hotels: Hotel[] = Array.isArray(data) ? data : [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<Hotel | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);

  const deleteMutation = useMutation((id: string) => deleteHotel(id), {
    onSuccess: () => {
      toast.success("Hotel deleted successfully");
      queryClient.invalidateQueries("hotels");
      setHotelToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete hotel");
    },
  });

  const columns: TableColumn<Hotel>[] = useMemo(
    () => [
      {
        name: "Logo",
        selector: (row) => row.logo || "",
        cell: (row) =>
          row.logo ? (
            <img
              src={getMediaUrl(row.logo)}
              alt={row.name}
              style={{ height: 42, width: 42, objectFit: "contain" }}
            />
          ) : (
            <span className="text-muted">No logo</span>
          ),
        width: "120px",
      },
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Address",
        selector: (row) => row.address || "",
        sortable: true,
        grow: 2,
      },
      {
        name: "Map",
        selector: (row) => row.map || "",
        cell: (row) =>
          row.map ? (
            <a href={row.map} target="_blank" rel="noreferrer">
              Open Map
            </a>
          ) : (
            <span className="text-muted">No Map Link</span>
          ),
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-light-primary btn-sm"
              onClick={() => setShowUpdateModal(row)}
            >
              Edit
            </button>
            <button
              className="btn btn-light-danger btn-sm"
              onClick={() => setHotelToDelete(row)}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        ),
        width: "200px",
      },
    ],
    [deleteMutation.isLoading]
  );

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-6">
        <h2 className="mb-0">Hotels Management</h2>
      </div>

      <TableComponent
        data={hotels}
        columns={columns}
        placeholder="Hotels"
        onAddClick={() => setShowCreateModal(true)}
        isLoading={isLoading}
        showCreate
        showExport
        pagination
        searchKeys={["name", "address"]}
      />

      {showCreateModal && (
        <CreateHotelModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            queryClient.invalidateQueries(["hotels"]);
          }}
        />
      )}

      {showUpdateModal && (
        <UpdateHotelModal
          hotel={showUpdateModal}
          show={!!showUpdateModal}
          onHide={() => setShowUpdateModal(null)}
          onSuccess={() => {
            setShowUpdateModal(null);
            queryClient.invalidateQueries(["hotels"]);
          }}
        />
      )}

      {hotelToDelete && (
        <Modal
          show={!!hotelToDelete}
          onHide={() => setHotelToDelete(null)}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete “{hotelToDelete?.name}”? This action
            cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setHotelToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                hotelToDelete && deleteMutation.mutate(hotelToDelete.id)
              }
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Delete"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default HotelsManagementPage;
