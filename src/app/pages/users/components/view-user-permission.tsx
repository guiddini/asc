// ViewUserPermissionsModal.tsx
import React from "react";
import { Modal, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { useQuery } from "react-query";
import {
  getUserPermissions,
  getUserRoles,
  getHighestRole,
} from "../../../apis/permission";
import { KTIcon } from "../../../../_metronic/helpers";

interface ViewUserPermissionsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
  userName: string;
}

const ViewUserPermissionsModal: React.FC<ViewUserPermissionsModalProps> = ({
  isOpen,
  setIsOpen,
  userId,
  userName,
}) => {
  const { data: permissionsData, isLoading: loadingPermissions } = useQuery(
    ["user-permissions", userId],
    () => getUserPermissions(userId),
    {
      enabled: isOpen,
    }
  );

  const { data: rolesData, isLoading: loadingRoles } = useQuery(
    ["user-roles", userId],
    () => getUserRoles(userId),
    {
      enabled: isOpen,
    }
  );

  const { data: highestRoleData, isLoading: loadingHighestRole } = useQuery(
    ["highest-role", userId],
    () => getHighestRole(userId),
    {
      enabled: isOpen,
    }
  );

  const isLoading = loadingPermissions || loadingRoles || loadingHighestRole;
  const permissions = permissionsData?.permissions || {};
  const roles = rolesData?.roles || [];
  const highestRole = highestRoleData?.highest_role;

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <KTIcon iconName="shield-search" className="fs-2 me-2" />
          User Permissions & Roles
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5 className="fw-bold mb-2">{userName}</h5>
          <p className="text-muted mb-0">
            View all roles and permissions assigned to this user
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3 text-muted">Loading permissions...</p>
          </div>
        ) : (
          <>
            {/* Roles Section */}
            <div className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <KTIcon
                  iconName="profile-user"
                  className="fs-2 text-primary me-2"
                />
                <h6 className="fw-bold mb-0">User Roles</h6>
              </div>
              {roles.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {roles.map((role, index) => (
                    <Badge key={index} bg="primary" className="px-3 py-2 fs-7">
                      {role}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Alert variant="light" className="mb-0">
                  No roles assigned
                </Alert>
              )}
            </div>

            {/* Highest Role Section */}
            <div className="mb-5">
              <div className="d-flex align-items-center mb-3">
                <KTIcon iconName="crown" className="fs-2 text-warning me-2" />
                <h6 className="fw-bold mb-0">Highest Role</h6>
              </div>
              {highestRole ? (
                <Badge bg="warning" className="px-3 py-2 fs-6 text-dark">
                  <KTIcon iconName="star" className="fs-4 me-1" />
                  {highestRole}
                </Badge>
              ) : (
                <Alert variant="light" className="mb-0">
                  No highest role determined
                </Alert>
              )}
            </div>

            {/* Permissions Section */}
            <div>
              <div className="d-flex align-items-center mb-3">
                <KTIcon iconName="key" className="fs-2 text-success me-2" />
                <h6 className="fw-bold mb-0">Permissions</h6>
              </div>
              {Object.keys(permissions).length > 0 ? (
                <div className="border rounded p-4 bg-light">
                  <div className="row g-3">
                    {Object.entries(permissions).map(([key, value], index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-start">
                          <KTIcon
                            iconName="check-circle"
                            className="fs-3 text-success me-2 mt-1"
                          />
                          <div>
                            <div className="fw-bold text-gray-800">{key}</div>
                            <small className="text-muted">{value}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert variant="light" className="mb-0">
                  No permissions assigned
                </Alert>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewUserPermissionsModal;
