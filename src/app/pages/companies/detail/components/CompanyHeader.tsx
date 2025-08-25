import React, { useMemo } from "react";
import clsx from "clsx";
import getMediaUrl from "../../../../helpers/getMediaUrl";
import { KTIcon, toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CompanyDetailProps } from "../../../../types/company";

interface CompanyHeaderProps {
  company: CompanyDetailProps;
  editable: boolean;
  watch: any;
  setValue: any;
}

const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  company,
  editable,
  watch,
  setValue,
}) => {
  const logo_image = useMemo(() => {
    const watchedImage = watch("logo");
    if (watchedImage) {
      return typeof watchedImage === "string"
        ? getMediaUrl(watchedImage)
        : URL.createObjectURL(watchedImage);
    }
  }, [watch("logo"), company?.id]);

  const watched_header_image = watch("header_image");
  const header_image = useMemo(() => {
    if (watched_header_image) {
      return typeof watched_header_image === "string"
        ? getMediaUrl(watched_header_image)
        : URL.createObjectURL(watched_header_image);
    } else {
      return toAbsoluteUrl("/media/stock/1600x800/img-1.jpg");
    }
  }, [watched_header_image]);

  return (
    <div className="mb-18">
      <div className="mb-10">
        <div className="text-center mb-15">
          <div className="card-title m-0">
            <div className="symbol symbol-100px w-100px bg-light overlay">
              <img
                src={logo_image}
                alt={`${company?.name}-logo`}
                className="p-3"
              />
              {editable && (
                <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                  <label htmlFor="company_logo">
                    <span
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      style={{ padding: "0.5rem" }}
                    >
                      <i className="ki-duotone ki-pencil p-0">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </span>
                    <input
                      type="file"
                      name="file"
                      id="company_logo"
                      accept="image/png, image/jpg, image/jpeg"
                      className="btn btn-primary"
                      onChange={(e) => setValue("logo", e.target.files[0])}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
          <h3
            className={clsx("fs-2hx text-dark mb-5", {
              "border border-primary w-auto": editable,
            })}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onBlur={(e) => setValue("name", e.currentTarget.textContent)}
          >
            {company?.name}
          </h3>
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
              <span
                className={clsx("", { "border border-primary ": editable })}
                contentEditable={editable}
                suppressContentEditableWarning={true}
                onBlur={(e) => setValue("email", e.currentTarget.textContent)}
              >
                {company?.email}
              </span>
            </span>
            {company?.phone_1 && (
              <span className="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                <KTIcon iconName="phone" className="fs-4 me-1" />
                <span
                  className={clsx("", { "border border-primary ": editable })}
                  contentEditable={editable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) =>
                    setValue("phone_1", e.currentTarget.textContent)
                  }
                >
                  {company?.phone_1}
                </span>
              </span>
            )}
          </div>
          <div
            className={clsx("fs-5 text-muted fw-semibold p-2", {
              "border border-primary": editable,
            })}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              const content = e.currentTarget.textContent;
              const truncatedContent = content.slice(0, 255);
              e.preventDefault();
              e.currentTarget.textContent = truncatedContent;
              setValue("header_text", truncatedContent);
            }}
          >
            {watch("header_text")}
          </div>
        </div>
        <div className="overlay d-flex flex-row align-items-center justify-content-center">
          <img
            className="card-rounded mx-auto w-100"
            src={header_image}
            alt=""
            style={{
              minHeight: "50vh",
              maxHeight: "70vh",
              objectFit: "cover",
              aspectRatio: "16/9",
            }}
          />
          {editable ? (
            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
              <label htmlFor="header_image">
                <span
                  className="btn btn-primary d-flex align-items-center justify-content-center"
                  style={{ padding: "1rem" }}
                >
                  <i className="ki-duotone ki-pencil p-0">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </span>
                <input
                  type="file"
                  name="file"
                  id="header_image"
                  accept="image/png, image/jpg, image/jpeg"
                  className="btn btn-primary"
                  onChange={(e) => setValue("header_image", e.target.files[0])}
                />
              </label>
            </div>
          ) : (
            <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
              <a href="#products" className="btn btn-primary">
                Produits
              </a>
              <OverlayTrigger
                placement="top-start"
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>À venir !</Tooltip>}
              >
                <span className="btn btn-light-primary ms-3">
                  Rejoignez-nous
                </span>
              </OverlayTrigger>
            </div>
          )}
        </div>
        {editable && (
          <div className="notice d-flex bg-light-danger rounded border-danger border border-dashed mb-12 p-6 my-6">
            <div className="d-flex flex-stack flex-grow-1 ">
              <div className=" fw-semibold">
                <h4 className="text-gray-900 fw-bold text-center">
                  L'image d'en-tête doit avoir un format d'image 16:9 !
                </h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyHeader;
