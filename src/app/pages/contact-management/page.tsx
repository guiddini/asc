import { useQuery } from "react-query";
import moment from "moment";
import { TableComponent } from "../../components/table/TableComponent";
import { ContactRequest } from "../../types/contact";
import { getContactRequests } from "../../apis/contact";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function ContactManagementPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState<ContactRequest | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["contact-requests", "contact"],
    queryFn: () => getContactRequests({ type: "contact" }),
    keepPreviousData: true,
    retry: 1,
  });

  const requests: ContactRequest[] = data?.data ?? [];

  const columns = [
    {
      name: "Name",
      selector: (row: ContactRequest) => `${row.fname} ${row.lname}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: ContactRequest) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: ContactRequest) => row.phone ?? "-",
      sortable: true,
    },
    {
      name: "Company",
      selector: (row: ContactRequest) => row.company_name ?? "-",
      sortable: true,
    },
    {
      name: "Position",
      selector: (row: ContactRequest) => row.position ?? "-",
      sortable: true,
    },
    {
      name: "Message",
      selector: (row: ContactRequest) => row.message ?? "-",
      sortable: false,
      grow: 2,
    },
    {
      name: "Created At",
      selector: (row: ContactRequest) =>
        row.created_at
          ? moment(row.created_at).format("DD/MM/YYYY HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row: ContactRequest) =>
        row.updated_at
          ? moment(row.updated_at).format("DD/MM/YYYY HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: ContactRequest) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setSelected(row);
            setShowDetails(true);
          }}
        >
          View Details
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  return (
    <>
      <TableComponent
        columns={columns as any}
        data={requests}
        placeholder="Contact Request"
        showCreate={false}
        showExport={true}
        isLoading={isLoading}
        pagination={true}
        searchKeys={[
          "fname",
          "lname",
          "email",
          "phone",
          "company_name",
          "position",
          "message",
          "type",
          "created_at",
          "updated_at",
        ]}
      />

      <Modal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected ? (
            <div className="container-fluid">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-bold">Name</div>
                  <div>
                    {selected.fname} {selected.lname}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="fw-bold">Email</div>
                  <div>{selected.email}</div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-bold">Phone</div>
                  <div>{selected.phone ?? "-"}</div>
                </div>
                <div className="col-md-6">
                  <div className="fw-bold">Type</div>
                  <div className="badge bg-light text-dark border">
                    {selected.type}
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="fw-bold">Company</div>
                  <div>{selected.company_name ?? "-"}</div>
                </div>
                <div className="col-md-6">
                  <div className="fw-bold">Position</div>
                  <div>{selected.position ?? "-"}</div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <div className="fw-bold">Message</div>
                  <div
                    className="p-3 border rounded bg-light"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {selected.message ?? "-"}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="fw-bold">Created At</div>
                  <div>
                    {selected.created_at
                      ? moment(selected.created_at).format("DD/MM/YYYY HH:mm")
                      : "-"}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="fw-bold">Updated At</div>
                  <div>
                    {selected.updated_at
                      ? moment(selected.updated_at).format("DD/MM/YYYY HH:mm")
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>No request selected.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
