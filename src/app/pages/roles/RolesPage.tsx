import { useMemo, useState } from "react";
import RoleCard from "./components/role-card";
import { Col, Row, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { getAllRolesApi } from "../../apis";
import { Role } from "../../types/roles";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import UpdateRoleModal from "./update-role/UpdateRoleModal";
import { Can } from "../../utils/ability-context";

const RolesPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRolesApi,
  });

  const ROLES = useMemo(() => data?.data, [data]);

  const [role, setRole] = useState<null | Role>(null);

  return (
    <Row xs={12} md={12} lg={12}>
      <Can I="list" a="roles">
        {isLoading ? (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {ROLES?.map((role: Role, index: number) => (
              <RoleCard role={role} setRole={setRole} key={index} />
            ))}
          </>
        )}
        <Col xs={12} md={6} lg={6} xl={4}>
          <div className="card h-md-100">
            <div className="card-body d-flex flex-center">
              <button
                type="button"
                className="btn btn-clear d-flex flex-column flex-center"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_add_role"
              >
                <img
                  src={toAbsoluteUrl("media/illustrations/sketchy-1/4.png")}
                  alt=""
                  className="mw-100 mh-150px mb-7"
                />
                <div className="fw-bold fs-3 text-gray-600 text-hover-primary">
                  Add New Role
                </div>
              </button>
            </div>
          </div>
        </Col>
        <Can I="update" a="roles">
          <UpdateRoleModal role={role} setRole={setRole} refetch={refetch} />
        </Can>
      </Can>
    </Row>
  );
};

export { RolesPage };
