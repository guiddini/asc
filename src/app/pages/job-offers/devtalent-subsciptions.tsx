import React from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { CompanyJobApplication } from "..";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Link } from "react-router-dom";
import moment from "moment";
import DevTalentDayColumn from "./components/dev-talent-day-column";

export const DevTalentSubsciptions = () => {
  const columns = [
    {
      name: "Utilisateur",
      selector: (row) => row.fname,
      sortable: true,
      cell: (row: CompanyJobApplication) => {
        return (
          <div className="d-flex flex-row align-items-center my-2">
            <div className="symbol symbol-circle symbol-55px overflow-hidden me-3">
              <div className="symbol-label">
                <img
                  alt={row?.userFound?.fname}
                  src={getMediaUrl(row?.userFound?.avatar)}
                  className="w-100"
                />
              </div>
            </div>
            <div>
              <Link
                to={`/profile/${row?.userFound?.id}`}
                className="fs-5 fw-bold text-black text-hover-primary"
              >
                {row?.userFound?.fname} {row?.userFound?.lname}
              </Link>
            </div>
          </div>
        );
      },
      minWidth: "200px",
    },
    {
      name: "Position",
      selector: (row: CompanyJobApplication) => row.jobOfferFound?.name,
      sortable: true,
      cell: (row: CompanyJobApplication) => {
        return (
          <Link
            to={`/job-offers/${row?.jobOfferFound?.company_id}/detail/${row?.company_exact_offer_id}`}
            className="fs-5 fw-bold text-black text-hover-primary"
          >
            {row?.jobOfferFound?.name}
          </Link>
        );
      },
      minWidth: "200px",
      center: true,
    },
    {
      name: "Postulé à",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row: CompanyJobApplication) => <DevTalentDayColumn {...row} />,
      center: true,
    },
  ];

  return (
    <>
      <PageTitle>Dev & talent day candidats</PageTitle>
    </>
  );
};
