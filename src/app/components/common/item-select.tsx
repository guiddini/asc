import { Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";

export const ItemSelect = ({
  control,
  name,
  icon,
  title,
  desc,
  colMD,
  colXS,
  inputName,
  disabled,
  className,
}: {
  control: Control;
  name: string;
  inputName: string;
  icon?: string;
  title: string;
  desc?: string;
  colMD?: number;
  colXS?: number;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <Controller
      name={inputName}
      control={control}
      disabled={disabled}
      render={({ field: { onBlur, value, onChange } }) => {
        return (
          <Col xs={colXS || 12} md={colMD || 6} className={className}>
            <div
              onClick={() => {
                if (!disabled) {
                  onChange(name);
                }
                return;
              }}
              className="w-100 h-100"
            >
              <input
                type="radio"
                className="btn-check w-"
                value={name}
                disabled={disabled}
                checked={value === name}
                id="kt_create_account_form_account_type_personal"
              />
              <label
                className="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center w-100 h-100"
                // for="kt_create_account_form_account_type_personal"
              >
                {icon && (
                  <i className={`ki-duotone ki-${icon} fs-3x me-5`}>
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                    <span className="path5"></span>
                  </i>
                )}
                <span className="d-block fw-semibold text-start">
                  <span className="text-dark fw-bold d-block fs-4 mb-2">
                    {title}
                  </span>
                  <span className="text-muted fw-semibold fs-6">{desc}</span>
                </span>
              </label>
            </div>
          </Col>
        );
      }}
    />
  );
};
