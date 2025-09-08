import { useMemo } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import { Col, Row, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { getAllActiveJobOffers, getWillayasApi } from "../../apis";
import { Link } from "react-router-dom";
import { Willaya } from "../../types/resources";
import getMediaUrl from "../../helpers/getMediaUrl";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(frenchStrings);

interface JobOffer {
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
}

export const AllJobOffers = () => {
  const { data: willayas } = useQuery({
    queryKey: ["willayas"],
    queryFn: getWillayasApi,
  });

  const WILLAYAS = useMemo(
    () =>
      willayas?.data?.map((willaya: Willaya, index: number) => {
        return {
          label: willaya.name,
          value: willaya.id,
        };
      }),
    [willayas]
  );

  const getWillaya = (id: string) => {
    const defaultWillaya = WILLAYAS?.find(
      (willaya) => Number(willaya?.value) === Number(id)
    );
    return defaultWillaya?.label;
  };

  const { data, isLoading } = useQuery({
    queryFn: getAllActiveJobOffers,
    queryKey: ["get-all-job-offers"],
  });

  const JOBS: JobOffer[] = data?.data;

  return (
    <>
      <PageTitle>Offres d'emploi</PageTitle>
      <Row>
        {isLoading ? (
          <div
            style={{
              minHeight: "70vh",
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <Spinner animation="border" color="#000" />
          </div>
        ) : (
          <>
            {JOBS?.length > 0 ? (
              <>
                {JOBS?.map((res) => (
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={4}
                    xl={3}
                    xxl={3}
                    className="mt-4"
                  >
                    <Link
                      to={`/job-offers/${res?.company_id}/detail/${res?.id}`}
                      className="card w-100 border rounded-3 cursor-pointer"
                    >
                      <div className="card-body p-5 pb-2">
                        <div className="w-100 d-flex flex-row align-items-center mb-2">
                          <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
                            <div className="symbol-label">
                              <img
                                alt={res?.companyFound?.name}
                                src={getMediaUrl(res?.companyFound?.logo)}
                                className="w-100"
                              />
                            </div>
                          </div>
                          <div className="d-flex flex-column">
                            <h2 className="my-0">{res?.companyFound?.name}</h2>
                          </div>
                        </div>
                        <p className="fs-3 fw-bold">{res?.name}</p>
                        <p>Type d'emploi : {res?.work_type}</p>
                        <p>
                          <KTIcon
                            iconName="brifecase-timer"
                            className="fs-4 m-0 me-1"
                          />
                          <TimeAgo
                            date={res?.updated_at}
                            formatter={formatter}
                          />
                        </p>
                      </div>
                      <div className="card-footer d-flex flex-row align-items-center gap-2 p-5 pb-2">
                        <p>
                          <KTIcon
                            iconName="geolocation"
                            className="fs-4 me-1"
                          />
                          {getWillaya(res?.workplace_wilaya_id)} /{" "}
                          {res?.workplace_address}
                        </p>
                      </div>
                    </Link>
                  </Col>
                ))}
              </>
            ) : (
              <div
                style={{
                  height: "70vh",
                }}
                className="d-flex flex-column justify-content-center align-items-center bg-white rounded-3"
              >
                <img src={toAbsoluteUrl("/media/afes/job-offer.png")} alt="" />
                <h1>No offer available</h1>
              </div>
            )}
          </>
        )}
      </Row>
    </>
  );
};
