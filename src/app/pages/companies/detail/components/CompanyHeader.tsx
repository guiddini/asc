import React, { useMemo } from "react";
import clsx from "clsx";
import getMediaUrl from "../../../../helpers/getMediaUrl";
import { KTIcon, toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CompanyDetailProps } from "../../../../types/company";

interface CompanyHeaderProps {
  company: CompanyDetailProps;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({ company }) => {
  const logo_image = useMemo(() => {
    if (company?.logo) {
      return getMediaUrl(company.logo as unknown as string);
    }
    return undefined;
  }, [company?.logo, company?.id]);

  const header_image = useMemo(() => {
    if (company?.header_image) {
      return getMediaUrl(company.header_image as unknown as string);
    }
    return toAbsoluteUrl("/media/stock/1600x800/img-1.jpg");
  }, [company?.header_image]);

  return (
    <div className="mb-18">
      <div className="mb-10">
        <div className="text-center mb-15">
          <div className="card-title m-0">
            <div className="symbol symbol-100px w-100px bg-light overlay">
              <img src={logo_image} alt={`${company?.name}-logo`} className="p-3" />
            </div>
          </div>
          <h3 className={clsx("fs-2hx text-dark mb-5")}>{company?.name}</h3>
          <div className="d-flex flex-wrap flex-row align-items-center justify-content-center fw-bold fs-6 mb-4 pe-2">
            <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
              <KTIcon iconName="profile-circle" className="fs-4 me-1" />
              {company?.legal_status}
            </span>
            {company?.address && (
              <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                <KTIcon iconName="geolocation" className="fs-4 me-1" />
                {company?.address}
              </span>
            )}
            <span className="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
              <KTIcon iconName="sms" className="fs-4 me-1" />
              <span>{company?.email}</span>
            </span>
            {company?.phone_1 && (
              <span className="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                <KTIcon iconName="phone" className="fs-4 me-1" />
                <span>{company?.phone_1}</span>
              </span>
            )}
          </div>
          <div className={clsx("fs-5 text-muted fw-semibold p-2")}>{company?.header_text}</div>
        </div>
        <div className="overlay d-flex flex-row align-items-center justify-content-center">
          <img
            className="card-rounded mx-auto w-100"
            src={header_image}
            alt=""
            style={{ minHeight: "50vh", maxHeight: "70vh", objectFit: "cover", aspectRatio: "16/9" }}
          />
          <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
            <a href="#products" className="btn btn-primary">
              Products
            </a>
            <OverlayTrigger placement="top-start" delay={{ show: 250, hide: 400 }} overlay={<Tooltip>Coming soon!</Tooltip>}>
              <span className="btn btn-light-primary ms-3">Join us</span>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
