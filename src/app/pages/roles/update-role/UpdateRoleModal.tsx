import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { KTIcon } from "../../../../_metronic/helpers";
import { useMutation } from "react-query";
import { Role } from "../../../types/roles";
import { usePermissions } from "../../../hooks";
import { assignPermissionsToRole } from "../../../apis";
import toast from "react-hot-toast";
import UserPermissions from "../../../components/common/user-permissions";
import { errorResponse } from "../../../types/responses";
import { Can } from "../../../utils/ability-context";

interface CreateRoleModalProps {
  role: Role;
  setRole: (any) => void;
  refetch: () => void;
}

export type CustomPermission = {
  id: string | number;
  name: string;
};

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  role,
  setRole,
  refetch,
}) => {
  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      permissions: [],
    },
  });

  const { PERMISIONS, isLoading: isLoadingPermissions } = usePermissions();

  const { isLoading, mutate } = useMutation({
    mutationKey: ["update-role"],
    mutationFn: (permissions: string[]) =>
      assignPermissionsToRole({
        role_id: role.id,
        permissions: permissions,
      }),
  });

  const selectedPermissions: CustomPermission[] = watch("permissions");

  const closeModal = () => setRole(null);

  const updateRoleFn = (data: { permissions: CustomPermission[] }) => {
    const permissionsIDS = data?.permissions?.map((permission) =>
      String(permission.id)
    );
    mutate(permissionsIDS, {
      onSuccess(data) {
        toast.success(
          `Role ${role.display_name} has been updated successfully !`
        );
        refetch();
      },
      onError(error: errorResponse) {
        toast.error(
          `Error updating role ${role.display_name} : ${error?.response?.data}`
        );
      },
    });
  };

  useEffect(() => {
    if (role) {
      const oldPermissions = role?.permissions?.map((per) => {
        return {
          id: per.id,
          name: per.name,
        };
      });
      setValue("permissions", oldPermissions);
    }
  }, [role]);

  const selectAll = () => {
    if (PERMISIONS?.length === selectedPermissions?.length) {
      setValue("permissions", []);
    } else {
      const res = PERMISIONS?.map((per) => {
        return {
          id: per?.id,
          name: per?.name,
        };
      });
      setValue("permissions", res);
    }
  };

  return (
    <Modal
      show={role !== null ? true : false}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <Can I="update" a="roles">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Update Role : {role?.display_name}</h2>

            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              style={{ cursor: "pointer" }}
              onClick={closeModal}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>
          <Modal.Body className="p-12">
            <form id="kt_modal_add_role_form" className="form" action="#">
              <div
                className="d-flex flex-column scroll-y me-n7 pe-7"
                id="kt_modal_add_role_scroll"
                data-kt-scroll="true"
                data-kt-scroll-activate="{default: false, lg: true}"
                data-kt-scroll-max-height="auto"
                data-kt-scroll-dependencies="#kt_modal_add_role_header"
                data-kt-scroll-wrappers="#kt_modal_add_role_scroll"
                data-kt-scroll-offset="300px"
              >
                <div className="fv-row mb-10">
                  <label className="fs-5 fw-bold form-label mb-2">
                    <span className="required">Role name</span>
                  </label>
                  <input
                    className="form-control form-control-solid"
                    value={role?.display_name}
                    name="role_name"
                    disabled
                  />
                </div>
                <div className="fv-row">
                  <label className="fs-5 fw-bold form-label mb-2">
                    Role Permissions
                  </label>
                  <div className="table-responsive">
                    <table className="table align-middle table-row-dashed fs-6 gy-5">
                      <tbody className="text-gray-600 fw-semibold">
                        <tr>
                          <td className="text-gray-800">
                            Administrator Access
                            <span
                              className="ms-2"
                              data-bs-toggle="popover"
                              data-bs-trigger="hover"
                              data-bs-html="true"
                              data-bs-content="Allows a full access to the system"
                            >
                              <i className="ki-outline ki-information fs-7"></i>
                            </span>
                          </td>
                          <td>
                            <label className="form-check form-check-custom form-check-solid me-9">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  PERMISIONS?.length ===
                                  selectedPermissions?.length
                                }
                                id="kt_roles_select_all"
                                onChange={selectAll}
                              />
                              <span
                                className="form-check-label"
                                // for="kt_roles_select_all"
                              >
                                Select all
                              </span>
                            </label>
                          </td>
                        </tr>

                        <UserPermissions
                          selectedPermissions={selectedPermissions}
                          setValue={setValue}
                        />
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer className="w-100">
            <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-6">
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-custom-blue-dark text-white"
                onClick={closeModal}
              >
                <span className="indicator-label">Retour</span>
              </button>
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-custom-purple-dark text-white"
                disabled={isLoading}
                onClick={handleSubmit(updateRoleFn)}
              >
                {!isLoading && <span className="indicator-label">Update</span>}
                {isLoading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </Modal.Footer>
        </div>
      </Can>
    </Modal>
  );
};

export default CreateRoleModal;
