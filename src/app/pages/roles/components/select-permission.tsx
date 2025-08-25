import React from "react";
import { Col } from "react-bootstrap";
import { UseFormSetValue } from "react-hook-form";

interface SelectPermissionProps {
  permission: { id: string | number; name: string };
  display_name: string;
  permissions: { id: string | number; name: string }[];
  setValue: UseFormSetValue<any>;
}

const SelectPermission: React.FC<SelectPermissionProps> = ({
  permission,
  display_name,
  permissions,
  setValue,
}) => {
  const isChecked = permissions?.some(
    (p) => p?.id === permission?.id && p?.name === permission?.name
  );

  const handlePermissionChange = (value: {
    id: string | number;
    name: string;
  }) => {
    if (isChecked) {
      const res = permissions.filter(
        (e) => e.id !== value.id || e.name !== value.name
      );
      setValue("permissions", res);
    } else {
      setValue("permissions", [...permissions, value]);
    }
  };

  return (
    <Col xs={12} md={6} lg={4}>
      <label className="form-check form-check-custom form-check-solid me-9">
        <input
          className="form-check-input"
          type="checkbox"
          value={permission.id}
          checked={isChecked}
          onChange={() => handlePermissionChange(permission)}
        />
        <span
          className="form-check-label"
          // for="kt_roles_select_all"
        >
          {display_name}
        </span>
      </label>
    </Col>
  );
};

export default SelectPermission;
