import clsx from "clsx";
import React, { HTMLInputTypeAttribute } from "react";
import { Controller, Control } from "react-hook-form";
import { errorMessage, isError } from "../../helpers/errorMessage";
import { Col } from "react-bootstrap";

type inputProps = {
  name: string;
  control: Control;
  type: HTMLInputTypeAttribute;
  errors: any;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  colXS?: number;
  colMD?: number;
  disabled?: boolean;
};

export const InvitCodeInput: React.FC<inputProps> = ({
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
}) => {
  const formatCode = (code) => {
    // Format the code by inserting a hyphen after every two characters
    return code?.match(/.{1,2}/g)?.join("-");
  };

  return (
    <Controller
      defaultValue={defaultValue || ""}
      name={name}
      disabled={disabled}
      control={control}
      render={({ field: { onChange, value, onBlur, ref, name } }) => {
        const handleChange = (e) => {
          const inputValue = e.target.value;
          let formattedCode = inputValue.replace(/-/g, ""); // Remove existing hyphens

          // Insert hyphen after every two characters
          if (formattedCode.length > 2) {
            formattedCode = formattedCode.match(/.{1,2}/g).join("-");
          }

          onChange(formattedCode);
        };

        return (
          <Col xs={colXS || "6"} md={colMD || "6"} className={className}>
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold ${required && "required "}`}>
                {label}
              </span>
            </label>
            <input
              placeholder={placeholder}
              onChange={handleChange}
              onBlur={onBlur}
              ref={ref}
              type={type}
              name={name}
              autoComplete="off"
              value={value}
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
            {errorMessage(errors, name)}
          </Col>
        );
      }}
    />
  );
};
