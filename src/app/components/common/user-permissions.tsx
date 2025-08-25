// UserPermissions.tsx
import React from "react";
import { CustomPermission } from "../../pages/roles/update-role/UpdateRoleModal";
import SelectPermission from "../../pages/roles/components/select-permission";
import { usePermissions } from "../../hooks";
import { Row, Spinner } from "react-bootstrap";

interface UserPermissionsProps {
  setValue: any;
  selectedPermissions: CustomPermission[];
}

const UserPermissions: React.FC<UserPermissionsProps> = ({
  setValue,
  selectedPermissions,
}) => {
  const { PERMISIONS, isLoading: isLoadingPermissions } = usePermissions();
  return (
    <>
      {isLoadingPermissions ? (
        <div className="w-100 h-300px d-flex align-items-center justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row xs={12} md={12}>
          {PERMISIONS?.map((permission) => (
            <SelectPermission
              key={permission.id}
              setValue={setValue as any}
              display_name={permission.display_name}
              permissions={selectedPermissions}
              permission={permission}
            />
          ))}
        </Row>
      )}
    </>
  );
};

export default UserPermissions;
