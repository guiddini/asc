import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { useDispatch } from "react-redux";
import { getCompanyActiveJobOffersApi, getWillayasApi } from "../../../../apis";
import { initJobs } from "../../../../features/jobsSlice";
import { Willaya } from "../../../../types/resources";
import { JobOffer } from "../../../../types/company";
import { KTIcon } from "../../../../../_metronic/helpers";
import getMediaUrl from "../../../../helpers/getMediaUrl";

const formatter = buildFormatter(frenchStrings);

interface CompanyJobsProps {
  companyId: string;
  logo_image: string;
  companyName: string;
}

const CompanyJobs: React.FC<CompanyJobsProps> = ({
  companyId,
  logo_image,
  companyName,
}) => {
  const dispatch = useDispatch();

  const { data: activeJobs, isLoading: loadingActiveJobs } = useQuery({
    queryFn: async () =>
      await getCompanyActiveJobOffersApi(companyId).then((res) => {
        dispatch(initJobs(res?.data));
        return res;
      }),
    queryKey: ["company-job-active-offers", companyId],
  });

  const { data: willayas } = useQuery({
    queryKey: ["willayas"],
    queryFn: getWillayasApi,
  });

  const WILLAYAS = useMemo(
    () =>
      willayas?.data?.map((willaya: Willaya) => ({
        label: willaya.name,
        value: willaya.id,
      })),
    [willayas]
  );

  const getWillaya = (id: string) => {
    const defaultWillaya = WILLAYAS?.find(
      (willaya) => Number(willaya?.value) === Number(id)
    );
    return defaultWillaya?.label;
  };

  const jobOffers: JobOffer[] = activeJobs?.data || [];

  if (loadingActiveJobs) {
    return (
      <div
        style={{
          height: "80vh",
        }}
        className="w-100 d-flex flex-column justify-content-center align-items-center bg-light"
      >
        <Spinner animation="border" color="#000" />
        <span className="mt-3">Chargement d'offres</span>
      </div>
    );
  }

  return (
    <>
      {jobOffers?.length > 0 && (
        <div className="mb-18">
          <div className="text-center mb-12">
            <h3 className="fs-2hx text-dark mb-5">Offre d'emplois</h3>
          </div>
          <Row>
            {jobOffers?.map((res) => (
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
                  to={`/job-offers/${companyId}/detail/${res?.id}`}
                  className="card w-100 border rounded-3 border-hover-custom-blue-dark hover-border-5 cursor-pointer"
                >
                  <div className="card-body p-5 pb-2 w-100 d-flex flex-row align-items-start justify-content-between">
                    <div className="">
                      <p className="fs-3 fw-bold">{res?.name}</p>
                      <p>Type d'emploi : {res?.work_type}</p>
                      <p>Position de travail : {res?.work_position}</p>
                    </div>
                    <img
                      src={getMediaUrl(logo_image)}
                      alt={`${companyName}-logo`}
                      className="w-50px"
                    />
                  </div>
                  <div className="card-footer d-flex flex-column align-items-start p-5 pb-1">
                    <p>
                      <KTIcon
                        iconName="brifecase-timer"
                        className="fs-4 m-0 me-1"
                      />
                      <TimeAgo date={res?.updated_at} formatter={formatter} />
                    </p>
                    <p>
                      <KTIcon iconName="geolocation" className="fs-4 me-1" />
                      {getWillaya(res?.workplace_wilaya_id)} /{" "}
                      {res?.workplace_address}
                    </p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default CompanyJobs;
