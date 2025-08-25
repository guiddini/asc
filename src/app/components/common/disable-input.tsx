import React from "react";
import { Controller, Control } from "react-hook-form";
import { Col } from "react-bootstrap";

type inputProps = {
  name: string;
  control: Control;
  label: string;
  defaultValue?: string;
  className?: string;
  colXS?: number;
  colMD?: number;
};

export const DisableInput: React.FC<inputProps> = ({
  control,
  name,
  label,
  defaultValue,
  className,
  colXS,
  colMD,
}) => {
  return (
    <Controller
      defaultValue={defaultValue || ""}
      name={name}
      disabled={true}
      control={control}
      render={({ field: { onChange, value, onBlur, ref, name } }) => {
        return (
          <Col xs={colXS || "6"} md={colMD || "6"} className={className}>
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold`}>{label}</span>
            </label>
            <input
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              name={name}
              className="form-control bg-transparent disabled"
              autoComplete="off"
              value={value}
              disabled={true}
            />
          </Col>
        );
      }}
    />
  );
};
