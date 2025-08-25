import React from "react";
import { Col } from "react-bootstrap";

export const DisableInputNoform = ({
  colXS,
  label,
  className,
  colMD,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
  className?: string;
  colXS?: number;
  colMD?: number;
}) => {
  return (
    <Col xs={colXS || "6"} md={colMD || "6"} className={className}>
      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
        <span className={`fw-bold`}>{label}</span>
      </label>
      <input
        className="form-control bg-transparent disabled"
        autoComplete="off"
        defaultValue={defaultValue}
        disabled={true}
      />
    </Col>
  );
};
