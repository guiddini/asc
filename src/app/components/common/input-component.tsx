import clsx from "clsx";
import React, { HTMLInputTypeAttribute } from "react";
import { Controller, Control } from "react-hook-form";
import { errorMessage, isError } from "../../helpers/errorMessage";
import { Col, Row } from "react-bootstrap";

type inputProps = {
  name: string;
  control: Control;
  type: HTMLInputTypeAttribute;
  errors: any;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  colXS?: number;
  colMD?: number;
  disabled?: boolean;
  description?: string;
  error?: string;
};

export const InputComponent: React.FC<inputProps> = ({
  control,
  name,
  label,
  errors,
  type,
  placeholder,
  defaultValue,
  className,
  required,
  colXS,
  colMD,
  disabled = false,
  description,
  error,
}) => {
  return (
    <Controller
      defaultValue={defaultValue || ""}
      name={name}
      disabled={disabled}
      control={control}
      render={({ field: { onChange, value, onBlur, ref, name } }) => {
        return (
          <Col xs={colXS || "6"} md={colMD || "6"} className={className}>
            {label && (
              <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                <span className={`fw-bold ${required && "required "}`}>
                  {label}
                </span>
              </label>
            )}
            <input
              placeholder={placeholder}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              type={type}
              name={name}
              autoComplete="off"
              value={disabled ? defaultValue : value}
              disabled={disabled}
              className={clsx(
                "form-control bg-transparent",
                {
                  "is-invalid": isError(errors, name),
                },
                {
                  "bg-secondary": disabled,
                }
              )}
            />
            {description && (
              <div className="text-muted fs-7">{description}</div>
            )}
            {errorMessage(errors, error || name)}
          </Col>
        );
      }}
    />
  );
};
