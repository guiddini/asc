import { ReactNode } from "react";
import { Col } from "react-bootstrap";

const Collapse = ({
  label,
  children,
  colXS,
  colMD,
  colLG,
}: {
  label: string;
  children: ReactNode;
  colXS?: number;
  colMD?: number;
  colLG?: number;
}) => {
  return (
    <Col
      xs={colXS || "12"}
      md={colMD || "6"}
      lg={colLG || "6"}
      className="my-4"
    >
      <div
        className="d-flex align-items-center collapsible py-3 toggle mb-0 collapsed"
        data-bs-toggle="collapse"
        data-bs-target={`#${label
          ?.replace(/\s/g, "")
          .replace(/"/g, "")
          .replace(/'/g, "")}`}
        aria-expanded="true"
      >
        <div className="btn btn-sm btn-icon mw-20px btn-active-color-primary me-5">
          <i className="ki-duotone ki-minus-square toggle-on text-primary fs-1">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
          <i className="ki-duotone ki-plus-square toggle-off fs-1 text-primary">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </i>
        </div>

        <h4 className="text-gray-700 fw-bold cursor-pointer mb-0">{label}</h4>
      </div>

      <div
        id={label?.replace(/\s/g, "").replace(/"/g, "").replace(/'/g, "")}
        className="fs-6 ms-1 collapse show"
      >
        {children}
      </div>
    </Col>
  );
};

export default Collapse;
