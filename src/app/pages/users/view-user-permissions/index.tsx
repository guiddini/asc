import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useForm } from "react-hook-form";
import {
  assignPermissionToUserApi,
  getUserPermissionsApi,
} from "../../../apis";
import { User } from "../../../types/user";
import { useMutation } from "react-query";
import UserPermissions from "../../../components/common/user-permissions";
import { Permission } from "../../../types/resources";
import toast from "react-hot-toast";

interface ViewModalProps {
  setIsOpen: (user: User) => void;
  user: User;
  refetch: () => void;
}

const ViewUserPermissions: React.FC<ViewModalProps> = ({
  user,
  setIsOpen,
  refetch,
}) => {
  const closeModal = () => setIsOpen(null);

  const { isLoading, mutate } = useMutation({
    mutationFn: (id: string) => getUserPermissionsApi(id),
    mutationKey: ["get-user-permissions", user?.id],
  });

  const {
    isLoading: assignationPermission,
    mutate: assignPermissionToUserMutate,
  } = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: number[] }) =>
      assignPermissionToUserApi({
        permissions: permissions,
        user_id: id,
      }),
    mutationKey: ["assign-user-permissions"],
  });

  const { watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      permissions: [],
    },
  });

  const selectedPermissions = watch("permissions");

  useEffect(() => {
    if (user?.id) {
      mutate(user?.id, {
        onSuccess(data, variables, context) {
          const userPermissions = data?.data as Permission[];

          const permissions = userPermissions?.map((per) => {
            return {
              id: per.id,
              name: per.name,
            };
          });
          setValue("permissions", permissions);
        },
      });
    }
  }, [user?.id]);

  const assignPermissionToUser = async (params: {
    permissions: { id: number; name: string }[];
  }) => {
    const permissions = params?.permissions?.map((per) => per.id);
    assignPermissionToUserMutate(
      {
        id: user?.id,
        permissions: permissions,
      },
      {
        onSuccess(data, variables, context) {
          toast.success("Permission granted to user");
        },
        onError(data, variables, context) {
          toast.error("Error while assigning permission to user");
        },
      }
    );
  };

  return (
    <Modal
      show={user !== null ? true : false}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">
            Assign permission to {user?.fname} {user?.lname}:{" "}
          </h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="">
          {isLoading ? (
            <></>
          ) : (
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
                            // checked={
                            //   PERMISIONS?.length === selectedPermissions?.length
                            // }
                            id="kt_roles_select_all"
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
          )}
          <Modal.Footer className="w-100">
            <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-6">
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-primary"
                onClick={closeModal}
              >
                <span className="indicator-label">Retour</span>
              </button>
              <div>
                <button
                  type="button"
                  id="kt_sign_in_submit"
                  className="btn btn-success"
                  disabled={assignationPermission}
                  onClick={handleSubmit(assignPermissionToUser)}
                >
                  {!assignationPermission && (
                    <span className="indicator-label">Assign</span>
                  )}
                  {assignationPermission && (
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
            </div>
          </Modal.Footer>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ViewUserPermissions;
