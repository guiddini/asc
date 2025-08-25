import React from "react";
import { Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";

interface RoleSelectProps {
  roleValue: string;
  display_name: string;
  control: Control;
  colXS?: number;
  colMD?: number;
  disabled?: boolean;
  withSeparator?: boolean;
}

const RoleSelect: React.FC<RoleSelectProps> = ({
  colMD,
  colXS,
  control,
  roleValue,
  disabled,
  display_name,
  withSeparator = true,
}) => {
  return (
    <Controller
      name="role_name"
      disabled={disabled}
      control={control}
      render={({ field: { onChange, value, onBlur, ref } }) => {
        return (
          <Col xs={colXS || "6"} md={colMD || "6"}>
            <div className="d-flex fv-row">
              {/* begin::Radio */}
              <div className="form-check form-check-custom form-check-solid">
                {/* begin::Input */}
                <input
                  className="form-check-input me-3"
                  name="role"
                  type="radio"
                  value={roleValue}
                  id="kt_modal_update_role_option_0"
                  checked={roleValue === value}
                  onBlur={onBlur}
                  ref={ref}
                  onChange={() => {
                    onChange(roleValue);
                  }}
                />

                {/* end::Input */}
                {/* begin::Label */}
                <label
                  className="form-check-label"
                  htmlFor="kt_modal_update_role_option_0"
                >
                  <div className="fw-bolder text-gray-800">{display_name}</div>
                  <div className="text-gray-600">
                    Best for business owners and company administrators
                  </div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {withSeparator && (
              <div className="separator separator-dashed my-5"></div>
            )}
          </Col>
        );
      }}
    />
  );
};

export default RoleSelect;
