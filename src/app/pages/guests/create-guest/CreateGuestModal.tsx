import { KTIcon } from "../../../../_metronic/helpers";
import CreateGuestForm from "../components/CreateGuestForm";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { createGuest } from "../../../apis";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "react-bootstrap";
import { Notice } from "../../../components";

const CreateGuestSchema = Yup.object().shape({
  fname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Prénom is required"),
  lname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Nom is required"),
  code: Yup.string().required("Code is required please generate one"),
  ticket_name: Yup.object()
    .required("Ticket is required")
    .typeError("Ticket is required"),
});

type CreateGuestProps = {
  fname: string;
  lname: string;
  code: string;
  ticket_name: any;
};

interface CreateGuestModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}

export const CreateGuestModal: React.FC<CreateGuestModalProps> = ({
  isOpen,
  setIsOpen,
  refetch,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    resolver: yupResolver(CreateGuestSchema),
  });

  const { mutate, isLoading, isError, error } = useMutation({
    mutationKey: ["create-guest"],
    mutationFn: async (data: CreateGuestProps) => await createGuest(data),
  });

  const closeModal = () => setIsOpen(false);

  const createGuestFN = async (data: CreateGuestProps) => {
    const req = {
      fname: data?.fname,
      lname: data?.lname,
      code: data?.code,
      ticket_name: data?.ticket_name?.value,
    };
    mutate(req, {
      onSuccess() {
        refetch();
        closeModal();
      },
      onError(error, variables, context) {},
    });
  };

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
          <h2 className="fw-bolder">Add Guest</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12 pb-5">
          <CreateGuestForm
            control={control as any}
            errors={errors}
            setValue={setValue}
          />
          {isError && (
            <Notice
              description={
                (error as { response?: { data?: { error?: string } } })
                  ?.response?.data?.error
              }
              containerClassName="bg-danger my-3"
            />
          )}
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
              onClick={handleSubmit(createGuestFN)}
            >
              {!isLoading && <span className="indicator-label">Create</span>}
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
