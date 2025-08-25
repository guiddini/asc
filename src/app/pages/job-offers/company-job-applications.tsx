import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import getMediaUrl from "../../helpers/getMediaUrl";
import { PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import CompanyJobapplicationsActionColumn from "./components/company-jobapplications/company-jobapplications-action-column";
import { useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import {
  getPendingCompanyJobApplicationsApi,
  getAcceptedCompanyJobApplicationsApi,
  getRefusedCompanyJobApplicationsApi,
} from "../../apis";
import { useSelector } from "react-redux";
import { canEditCompany } from "../../features/userSlice";

export interface CompanyJobApplication {
  id: string;
  company_exact_offer_id: string;
  user_id: string;
  user_expected_meetup_date: string;
  user_expected_meetup_timeframe: string;
  user_website: string;
  user_cv: string;
  company_meetup_date: string | null;
  company_meetup_time: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  userFound: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    avatar: string;
    can_create_company: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    ticket_count: string;
    user_has_ticket_id: string;
    has_password: string;
  };
  jobOfferFound: {
    id: number;
    name: string;
    company_id: string;
    description: string;
    workplace_type: string;
    workplace_wilaya_id: string;
    workplace_commune_id: string;
    workplace_address: string;
    work_position: string;
    work_type: string;
    work_requirements: string[];
    work_roles: string[];
    work_benefits: string[];
    work_skills: string[];
    application_terms: string[];
    application_receipts_emails: string[];
    job_offer_status: string;
    created_at: string;
    updated_at: string;
  };
}

export const CompanyJobApplications = () => {
  const { jobID, companyID } = useParams();
  const isCompanyEditor = useSelector((state) =>
    canEditCompany(state, companyID)
  );
  const navigate = useNavigate();
  if (!isCompanyEditor) navigate("/home");
  const [pendingJobApplications, setPendingJobApplications] = useState([]);
  const [acceptedJobApplications, setAcceptedJobApplications] = useState([]);
  const [refusedJobApplications, setRefusedJobApplications] = useState([]);

  const [pendingLoading, setPendingLoading] = useState(false);
  const [acceptedLoading, setAcceptedLoading] = useState(false);
  const [refusedLoading, setRefusedLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("pending");
  const [error, setError] = useState(null);

  const fetchData = async (apiCall, setter, setLoadingState) => {
    setLoadingState(true);
    try {
      const res = await apiCall(jobID);
      setter(res.data);
    } catch (error) {
      setError(`Error while getting ${selectedType} jobs: ${error.message}`);
    } finally {
      setLoadingState(false);
    }
  };

  const getJobs = (type) => {
    switch (type) {
      case "pending":
        fetchData(
          getPendingCompanyJobApplicationsApi,
          setPendingJobApplications,
          setPendingLoading
        );
        break;
      case "accepted":
        fetchData(
          getAcceptedCompanyJobApplicationsApi,
          setAcceptedJobApplications,
          setAcceptedLoading
        );
        break;
      case "refused":
        fetchData(
          getRefusedCompanyJobApplicationsApi,
          setRefusedJobApplications,
          setRefusedLoading
        );
        break;
      default:
      case "pending":
        fetchData(
          getPendingCompanyJobApplicationsApi,
          setPendingJobApplications,
          setPendingLoading
        );
        break;
    }
  };

  const getLoader = () => {
    switch (selectedType) {
      case "pending":
        return pendingLoading;
      case "accepted":
        return acceptedLoading;
      case "refused":
        return refusedLoading;
      default:
      case "pending":
        return pendingLoading;
    }
  };

  useEffect(() => {
    getJobs(selectedType);
  }, [selectedType]);

  const pendingcolumns = useMemo(
    () => [
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
        cell: (row: CompanyJobApplication) => (
          <CompanyJobapplicationsActionColumn {...row} />
        ),
        center: true,
      },
    ],
    []
  );

  const acceptedcolumns = useMemo(
    () => [
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
        name: "Rendez-vous à",
        cell: (row: CompanyJobApplication) => (
          <span className="badge badge-warning text-white fw-bolder p-3">
            {row.company_meetup_date
              ? row.company_meetup_date + " / " + row.company_meetup_time
              : "N/A"}
          </span>
        ),
        sortable: true,
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
        cell: (row: CompanyJobApplication) => (
          <CompanyJobapplicationsActionColumn {...row} />
        ),
        center: true,
      },
    ],
    []
  );

  const refusedcolumns = useMemo(
    () => [
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
        cell: (row: CompanyJobApplication) => (
          <CompanyJobapplicationsActionColumn {...row} />
        ),
        center: true,
      },
    ],
    []
  );

  const getCurrentColumns = () => {
    switch (selectedType) {
      case "pending":
        return pendingcolumns;
      case "accepted":
        return acceptedcolumns;
      case "refused":
        return refusedcolumns;

      default:
        return pendingcolumns;
    }
  };

  const data = useMemo(() => {
    switch (selectedType) {
      case "pending":
        return pendingJobApplications;
      case "accepted":
        return acceptedJobApplications;
      case "refused":
        return refusedJobApplications;
      default:
        return pendingJobApplications;
    }
  }, [
    selectedType,
    pendingJobApplications,
    acceptedJobApplications,
    refusedJobApplications,
  ]);

  return (
    <>
      <PageTitle>Applications reçu</PageTitle>
      <div className="mx-auto d-flex flex-row align-items-center justify-content-center">
        <div
          className="nav-group nav-group-outline bg-white my-4 d-flex flex-row align-items-center justify-content-center p-3"
          style={{ width: "360px" }}
        >
          <button
            className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
              "btn-active btn-custom-purple-dark text-white":
                selectedType === "pending",
            })}
            onClick={() => setSelectedType("pending")}
          >
            En attente
          </button>
          <button
            className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
              "btn-active btn-success text-white": selectedType === "accepted",
            })}
            onClick={() => setSelectedType("accepted")}
          >
            Accepté
          </button>
          <button
            className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
              "btn-active btn-danger text-white": selectedType === "refused",
            })}
            onClick={() => setSelectedType("refused")}
          >
            refusé
          </button>
        </div>
      </div>
      <TableComponent
        columns={getCurrentColumns()}
        data={data}
        showCreate={false}
        showExport={false}
        showSearch={false}
        isLoading={getLoader()}
      />
    </>
  );
};
