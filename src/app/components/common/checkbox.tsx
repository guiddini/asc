import React, { ReactNode } from "react";
import { Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { errorMessage } from "../../helpers/errorMessage";

interface checkboxProps {
  name: string;
  control: Control;
  errors: any;
  children: ReactNode;
  colXS?: number;
  colMD?: number;
  isChecked?: boolean;
}

export const Checkbox: React.FC<checkboxProps> = ({
  name,
  control,
  errors,
  children,
  colMD,
  colXS,
  isChecked,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { name, value, onBlur, onChange, ref, disabled } }) => (
        <>
          <Col
            xs={colXS || "6"}
            md={colMD || "6"}
            className="form-check form-check-custom form-check-solid px-3 pt-2"
          >
            <input
              className="form-check-input"
              type="checkbox"
              onChange={onChange}
              id={name}
              onBlur={onBlur}
              ref={ref}
              disabled={disabled}
              // checked={}
              defaultChecked={isChecked}
            />
            {children}
          </Col>

          {errorMessage(errors, name)}
        </>
      )}
    />
  );
};
