import { useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import { useQuery } from "react-query";
import { getAllSponsors } from "../../apis/sponsor";
import type { Sponsor } from "../../types/sponsor";
import clsx from "clsx";
import getMediaUrl from "../../helpers/getMediaUrl";
import CreateSponsorModal from "./components/create-sponsor-modal";
import EditSponsorModal from "./components/edit-sponsor-modal";
import DeleteSponsorModal from "./components/delete-sponsor-modal";

const SponsorsManagementPage = () => {
  const [typeFilter, setTypeFilter] = useState<"sponsor" | "partner">(
    "sponsor"
  );

  const { isLoading, data } = useQuery({
    queryFn: () => getAllSponsors({ type: typeFilter }),
    queryKey: ["sponsors", typeFilter],
    keepPreviousData: true,
  });

  const list: Sponsor[] = (data as Sponsor[]) || [];

  const typeOptions: ("sponsor" | "partner")[] = ["sponsor", "partner"];

  // Modals state
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<Sponsor | null>(null);

  const columns = [
    {
      name: "Actions",
      minWidth: "140px",
      wrap: true,
      cell: (row: Sponsor) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelected(row);
              setShowEdit(true);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              setSelected(row);
              setShowDelete(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
    {
      name: "Logo",
      minWidth: "100px",
      wrap: true,
      cell: (row: Sponsor) => (
        <div className="d-flex align-items-center">
          <img
            src={getMediaUrl(row.logo)}
            alt={row.name}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "contain",
            }}
          />
        </div>
      ),
    },
    {
      name: "Name",
      selector: (row: Sponsor) => row.name,
      sortable: true,
      minWidth: "200px",
      wrap: true,
      cell: (row: Sponsor) => <div className="fw-semibold">{row.name}</div>,
    },
    {
      name: "Website",
      selector: (row: Sponsor) => row.website || "-",
      sortable: true,
      minWidth: "220px",
      wrap: true,
      cell: (row: Sponsor) =>
        row.website ? (
          <a href={row.website} target="_blank" rel="noreferrer">
            {row.website}
          </a>
        ) : (
          <span>-</span>
        ),
    },
    {
      name: "Type",
      selector: (row: Sponsor) => row.type,
      sortable: true,
      minWidth: "140px",
      wrap: true,
      cell: (row: Sponsor) => (
        <span className="text-capitalize fw-medium">{row.type}</span>
      ),
    },
    {
      name: "Created",
      selector: (row: Sponsor) => row.created_at || "",
      sortable: true,
      minWidth: "160px",
      wrap: true,
      cell: (row: Sponsor) => (
        <div>
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <PageTitle>Sponsors Management</PageTitle>

      {/* Type tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {typeOptions.map((type) => (
          <button
            key={type}
            className={clsx(
              "btn btn-sm fw-semibold text-capitalize px-4 py-2 border",
              typeFilter === type
                ? "btn-custom-purple-dark text-white"
                : "btn-light"
            )}
            onClick={() => setTypeFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <TableComponent
        columns={columns}
        data={list}
        isLoading={isLoading}
        pagination
        showCreate={true}
        onAddClick={() => setShowCreate(true)}
        showExport={true}
        showSearch={true}
        searchKeys={["name", "website", "type"]}
        placeholder={typeFilter}
      />

      {/* Modals */}
      <CreateSponsorModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        defaultType={typeFilter}
      />
      <EditSponsorModal
        show={showEdit}
        sponsor={selected}
        onClose={() => setShowEdit(false)}
      />
      <DeleteSponsorModal
        show={showDelete}
        sponsor={selected}
        onClose={() => setShowDelete(false)}
      />
    </div>
  );
};

export default SponsorsManagementPage;
