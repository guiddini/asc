import { useQuery } from "react-query";
import { getUserJobApplicationsApi } from "../../apis";
import { PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import moment from "moment";
import { Link } from "react-router-dom";
import getMediaUrl from "../../helpers/getMediaUrl";

export type JobApplication = {
  id: number;
  company_job_offer_id: string;
  user_id: string;
  user_expected_meetup_date: string;
  user_expected_meetup_timeframe: string;
  user_website: string;
  user_cv: string;
  company_exact_meetup_date: string | null;
  company_exact_meetup_timeframeframe: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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
  companyFound: {
    id: string;
    logo: string;
    name: string;
    legal_status: string;
    address: string;
    email: string;
    header_text: string | null;
    header_image: string | null;
    description: string | null;
    quote_text: string | null;
    quote_author: string | null;
    team_text: string | null;
    country_id: string;
    wilaya_id: string | null;
    commune_id: string | null;
    phone_1: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  };
};

export const UserJobApplications = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-job-application"],
    queryFn: getUserJobApplicationsApi,
  });

  const columns = [
    {
      name: "Entreprise",
      selector: (row) => row.fname,
      sortable: true,
      cell: (row: JobApplication) => {
        return (
          <>
            <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
              <div className="symbol-label">
                <img
                  alt={row?.companyFound?.name}
                  src={getMediaUrl(row?.companyFound?.logo)}
                  className="w-100"
                />
              </div>
            </div>
            <Link
              to={`/company/${row?.companyFound?.id}`}
              className="fs-5 fw-bold"
            >
              {row?.companyFound?.name}
            </Link>
          </>
        );
      },
    },
    {
      name: "Position",
      selector: (row: JobApplication) => row.jobOfferFound?.name,
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row) => row.status,
      cell: (row: JobApplication) => (
        <span className="badge badge-light-success fw-bolder">
          {row.status || "En attente"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Rendez-vous à",
      cell: (row: JobApplication) => (
        <span className="badge badge-light-primary fw-bolder">
          {row.company_exact_meetup_date
            ? row.company_exact_meetup_date +
              row.company_exact_meetup_timeframeframe
            : "En attente"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Envoyé à",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    // {
    //   name: "",
    //   selector: (row) => (
    //     <ActionCollumn
    //       openEditModal={() => {
    //         if (row.status !== "Pending") {
    //           toast.error(
    //             "The guest has already accepted the invitation , you can't update"
    //           );
    //         } else {
    //           setUpdateGuest(row);
    //         }
    //       }}
    //       openViewModal={() => {
    //         setGuest(row);
    //       }}
    //       disableUpdate={row.status === "Pending" ? false : true}
    //     />
    //   ),
    //   sortable: true,
    // },
  ];

  const JobApplications: JobApplication[] = data?.data;

  return (
    <>
      <PageTitle>Mes condidatures</PageTitle>
      <TableComponent
        columns={columns}
        data={JobApplications}
        showCreate={false}
        showExport={false}
        showSearch={false}
        isLoading={isLoading}
      />
    </>
  );
};
