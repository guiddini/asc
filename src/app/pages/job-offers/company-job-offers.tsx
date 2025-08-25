import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCompanyActiveJobOffersApi,
  getCompanyInactiveJobOffersApi,
} from "../../apis";
import { TableComponent } from "../../components";
import CompanyJoboffersActionColumn from "./components/company-joboffers-action-column";
import { PageTitle } from "../../../_metronic/layout/core";
import clsx from "clsx";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { useCompanyRedirect } from "../../hooks/useCompanyRedirect";

export const CompanyJobOffers = () => {
  const { companyID } = useParams();
  const { user } = useSelector((state: UserResponse) => state.user);
  const { isCompanyEditor } = useCompanyRedirect({
    companyId: companyID,
    restrictForStaff: true,
  });

  if (isCompanyEditor) {
    const { data: activeJobs, isLoading: loadingActiveJobs } = useQuery({
      queryFn: async () => await getCompanyActiveJobOffersApi(companyID),
      queryKey: ["company-job-active-offers", companyID],
    });

    const { data: inactiveJobs, isLoading: loadingInactiveJobs } = useQuery({
      queryFn: async () => await getCompanyInactiveJobOffersApi(companyID),
      queryKey: ["company-job-inactive-offers", companyID],
    });

    const activejobOffers = activeJobs?.data;
    const inactivejobOffers = inactiveJobs?.data;

    const columns = [
      {
        name: "Position",
        selector: (row) => row?.name,
        sortable: true,
      },
      {
        name: "Type de lieu",
        selector: (row) => row?.workplace_type,
        sortable: true,
      },
      {
        name: "Type d'emploi",
        selector: (row) => row?.work_type,
        sortable: true,
      },
      {
        name: "Actions",
        selector: (row) => <CompanyJoboffersActionColumn {...row} />,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        omit: !isCompanyEditor,
      },
    ];

    const navigate = useNavigate();

    const [selectedType, setSelectedType] = useState<string>("active");

    return (
      <>
        <PageTitle>Offre d'emploi</PageTitle>
        <div className="mx-auto d-flex flex-row align-items-center justify-content-center">
          <div
            className="nav-group nav-group-outline bg-white my-4 d-flex flex-row align-items-center justify-content-center p-3"
            style={{
              width: "250px",
            }}
            data-kt-buttons="true"
          >
            <button
              className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
                " btn-active btn-custom-purple-dark text-white":
                  selectedType === "active",
              })}
              onClick={(e) => {
                e.preventDefault();
                setSelectedType("active");
              }}
            >
              Actives
            </button>
            <button
              className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
                " btn-active btn-custom-purple-dark text-white":
                  selectedType === "inactive",
              })}
              onClick={(e) => {
                e.preventDefault();
                setSelectedType("inactive");
              }}
            >
              Inactives
            </button>
          </div>
        </div>
        <TableComponent
          columns={columns as any}
          data={selectedType === "active" ? activejobOffers : inactivejobOffers}
          placeholder=""
          customPlaceholder="Ajouter"
          canI={null}
          showSearch={false}
          showCreate={isCompanyEditor}
          onAddClick={() => {
            if (isCompanyEditor) navigate(`/job-offers/create/${companyID}`);
          }}
          isLoading={
            selectedType === "active" ? loadingActiveJobs : loadingInactiveJobs
          }
        />
      </>
    );
  } else {
    return (
      <div className="card">
        <div
          className="card-body d-flex flex-column align-items-center justify-content-center"
          style={{
            minHeight: "75vh",
          }}
        >
          <img
            src={toAbsoluteUrl("/media/auth/404-error.png")}
            className="mw-100 mh-300px theme-light-show"
            alt=""
          />
          <h1>Vous n'avez pas accès à cette page</h1>
        </div>
      </div>
    );
  }
};
