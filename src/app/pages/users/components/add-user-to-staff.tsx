import { Modal, Button } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useMutation } from "react-query";
import { addUserToStaffApi } from "../../../apis";
import toast from "react-hot-toast";

const AddStaffModal = ({ isOpen, setIsOpen, userName, userId }) => {
  const closeModal = () => setIsOpen(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: () => addUserToStaffApi(userId),
    mutationKey: ["add-user-to-staff", userId],
    onSuccess(data, variables, context) {
      toast.success("User added to staff successfully !");
      setIsOpen(false);
    },
    onError(error: any) {
      toast.error(
        `Error while adding user to staff : ${error?.response?.data?.error}`
      );
    },
  });

  const onConfirm = () => {
    mutate();
  };

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_add_staff"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-650px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Ajouter comme staff</h2>
          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body>
          <p>
            Êtes-vous sûr de vouloir ajouter {userName} en tant que membre du
            staff ?
          </p>
          <p>
            Cette action donnera à l'utilisateur des privilèges supplémentaires.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={closeModal}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              closeModal();
            }}
          >
            Confirmer
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddStaffModal;
