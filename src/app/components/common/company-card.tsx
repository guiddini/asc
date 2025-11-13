import { Link } from "react-router-dom";
import { companyType } from "../../types/company";
import { KTIcon } from "../../../_metronic/helpers";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Col } from "react-bootstrap";
import ReactCountryFlag from "react-country-flag";

export const CompanyCard = (props: companyType) => {
  return (
    <Col xs={12} md={4}>
      <Link
        to={`/company/${props?.id}`}
        className="card border-hover-primary min-h-200px w-100 h-100"
      >
        <div className="card-header border-0 pt-9">
          <div className="card-title m-0">
            <div className="symbol symbol-100px symbol-md-150px rounded-3">
              <img
                src={getMediaUrl(props?.logo)}
                alt="image"
                className="rounded-3 object-fit-contain"
              />
            </div>
          </div>
        </div>
        <div className="card-body p-9">
          <div className="fs-3 fw-bold text-gray-900 d-inline-flex align-items-center">
            {props?.name}
            {props?.country?.code && (
              <ReactCountryFlag
                countryCode={props.country.code}
                svg
                title={
                  props.country.name_fr || props.country.name_en || "Country"
                }
                aria-label={
                  props.country.name_en || props.country.name_fr || "Country"
                }
                style={{
                  width: "1.2em",
                  height: "1.2em",
                  marginLeft: "0.5rem",
                  display: "inline-block",
                }}
              />
            )}
          </div>

          <div className="d-flex flex-row flex-wrap my-2">
            <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5">
              <KTIcon iconName="geolocation" className="fs-4 me-1" />
              {props?.address}
            </span>
            <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5">
              <KTIcon iconName="phone" className="fs-4 me-1" />
              {props?.phone_1}
            </span>
            <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5">
              <KTIcon iconName="sms" className="fs-4 me-1" />
              {props?.email}
            </span>
          </div>
        </div>
      </Link>
    </Col>
  );
};
