import clsx from "clsx";
import React from "react";
import { Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { errorMessage, isError } from "../../helpers/errorMessage";

type textAreaProps = {
  name: string;
  control: Control;
  errors: any;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  colXS?: number;
  colMD?: number;
};

export const TextAreaComponent: React.FC<textAreaProps> = ({
  control,
  name,
  label,
  errors,
  placeholder,
  defaultValue,
  className,
  required,
  colXS,
  colMD,
}) => {
  return (
    <Controller
      defaultValue={defaultValue || ""}
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur, ref, name } }) => {
        return (
          <Col xs={colXS || "6"} md={colMD || "6"} className={className}>
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold ${required && "required "}`}>
                {label}
              </span>
            </label>
            <textarea
              placeholder={placeholder}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              name={name}
              autoComplete="off"
              value={value}
              className={clsx("form-control bg-transparent", {
                "is-invalid": isError(errors, name),
              })}
            />
            {errorMessage(errors, name)}
          </Col>
        );
      }}
    />
  );
};
