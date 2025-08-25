import React from "react";
import { Col } from "react-bootstrap";

type ReadonlyInputProps = {
  label: string;
  value?: string;
  className?: string;
  colXS?: number;
  colMD?: number;
};

export const ReadonlyInput: React.FC<ReadonlyInputProps> = ({
  label,
  value,
  className,
  colXS,
  colMD,
}) => {
  return (
    <Col xs={colXS || "6"} md={colMD || "6"} className={className}>
      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
        <span className={`fw-bold`}>{label}</span>
      </label>
      <input
        className="form-control bg-transparent disabled"
        autoComplete="off"
        value={value}
        disabled={true}
      />
    </Col>
  );
};
