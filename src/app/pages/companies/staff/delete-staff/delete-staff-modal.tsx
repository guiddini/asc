import React from "react";
import { Staff } from "../../../../types/user";
import { useMutation } from "react-query";
import { removeStaffCompanyApi } from "../../../../apis";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../../../_metronic/helpers";
import toast from "react-hot-toast";
import { errorResponse } from "../../../../types/responses";

interface DeleteStaffModalProps {
  isOpen: boolean;
  setIsOpen: (any) => void;
  refetch: () => void;
  staff: Staff;
  company_id: string;
}

const DeleteStaffModal: React.FC<DeleteStaffModalProps> = ({
  staff,
  isOpen,
  setIsOpen,
  refetch,
  company_id,
}) => {
  const { mutate, isLoading, isError, error } = useMutation({
    mutationKey: ["create-staff"],
    mutationFn: async (data: { company_id: string; user_id: string }) =>
      await removeStaffCompanyApi(data),
  });

  const deleteStaff = async () => {
    mutate(
      {
        company_id: company_id,
        user_id: staff.user_id,
      },
      {
        onSuccess(data, variables, context) {
          toast.success("Staff deleted successfully");
          refetch();
          closeModal();
        },
        onError(error: errorResponse) {
          toast.error(
            `Error while deleting staff : ${error?.response?.data?.error}`
          );
        },
      }
    );
  };

  const closeModal = () => setIsOpen(null);
  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Delete Staff</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12 pb-5">
          <p className="fs-2">Do you really wanna delete </p>
        </Modal.Body>

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
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-danger"
              disabled={isLoading}
              onClick={deleteStaff}
            >
              {!isLoading && <span className="indicator-label">Delete</span>}
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
    </Modal>
  );
};

export default DeleteStaffModal;
