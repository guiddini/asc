import clsx from "clsx";
import { Col, Row } from "react-bootstrap";
import getMediaUrl from "../../../../helpers/getMediaUrl";
import { CompanyJobApplication } from "../../company-job-applications";

export const CustomInput = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => {
  return (
    <Row
      xs={12}
      md={6}
      className={clsx(
        "d-flex flex-row align-items-center text-nowrap justify-content-start w-100 gap-5",
        className
      )}
    >
      <label className="fw-semibold text-muted">{label}</label>

      <span className="fw-bold fs-6 text-gray-800 w-auto px-0">{value}</span>
    </Row>
  );
};

const ApplicantDetailComponent = (jobApplication: CompanyJobApplication) => {
  const user = jobApplication?.userFound;
  const job = jobApplication?.jobOfferFound;
  return (
    <Row>
      <Col
        xs={3}
        md={3}
        className="d-flex flex-row align-items-start align-items-lg-center justify-content-start"
      >
        <div
          className={clsx("symbol w-100 h-100 symbol-fixed position-relative")}
        >
          <img
            src={getMediaUrl(user?.avatar)}
            alt={`Photo de profile de ${user?.fname}`}
            className="object-fit-cover w-100 h-100"
          />
        </div>
      </Col>
      <Col
        xs={9}
        md={9}
        className="d-flex flex-column align-items-start justify-content-between gap-1"
      >
        <CustomInput label="Nom" value={`${user?.fname} ${user?.lname}`} />
        <CustomInput label="Position" value={job?.name} />

        <button
          onClick={() => {
            const pdfLink = getMediaUrl(jobApplication?.user_cv);
            window.open(pdfLink, "_blank");
          }}
          className="btn btn-sm text-white w-100"
          style={{
            background: "rgba(125, 0, 255, 0.7)",
          }}
        >
          <i className="ki-duotone ki-document fs-2 text-white">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>{" "}
          Télécharger le CV
        </button>
      </Col>
      <Col
        xs={9}
        md={9}
        className="d-flex flex-row align-items-start align-items-lg-center justify-content-start px-0 mt-2"
      ></Col>
    </Row>
  );
};

export default ApplicantDetailComponent;
