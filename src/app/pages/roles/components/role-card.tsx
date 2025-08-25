import { Col } from "react-bootstrap";
import { Permission, Role } from "../../../types/roles";
import { Can } from "../../../utils/ability-context";

type RoleCardProps = {
  setRole: (role: Role) => void;
  role: Role;
};

const RoleCard = (props: RoleCardProps) => {
  return (
    <Col xs={12} md={6} lg={6} xl={4} className="my-2">
      <div className="card card-flush h-md-100">
        <div className="card-header">
          <div className="card-title">
            <h2>{props.role.display_name}</h2>
          </div>
        </div>

        <Can I="list" a="permissions">
          <div className="card-body pt-1">
            <div className="d-flex flex-column text-gray-600">
              {props?.role?.permissions?.length > 0 ? (
                <>
                  {props?.role?.permissions
                    ?.slice(0, 10)
                    ?.map((permission: Permission) => (
                      <div className="d-flex align-items-center py-2">
                        <span className="bullet bg-primary me-3"></span>
                        {permission.display_name}
                      </div>
                    ))}
                </>
              ) : (
                <div className="d-flex align-items-center py-2">
                  <span className="bullet bg-primary me-3"></span>
                  <em>No Permission has been assigned yet</em>
                </div>
              )}
            </div>
          </div>
        </Can>

        <div className="card-footer flex-wrap pt-0">
          <Can I="update" a="roles">
            <button
              type="button"
              className="btn btn-light btn-active-light-primary my-1"
              onClick={() => {
                props.setRole({
                  ...props.role,
                  permissions: props?.role?.permissions,
                });
              }}
            >
              Edit Role
            </button>
          </Can>
        </div>
      </div>
    </Col>
  );
};

export default RoleCard;
