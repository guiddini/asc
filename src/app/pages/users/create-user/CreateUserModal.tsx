import { KTIcon } from "../../../../_metronic/helpers";
import CreateUserForm from "../components/CreateUserForm";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { createUserApi } from "../../../apis";
import { Modal } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserSchema } from "../validation/userValidation";
import { errorResponse } from "../../../types/responses";
import backendErrorHandler from "../../../utils/backend-error-handler";
import toast from "react-hot-toast";

type formdataProps = {
  fname: string;
  lname: string;
  email: string;
  code: string;
  tickets: {
    ticket_type: {
      label: string;
      value: string;
    };
    ticket_role: {
      label: string;
      value: string;
    };
    quantity: number;
  }[];
  password: string;
};

interface CreateUserModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  setIsOpen,
  refetch,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<any>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      tickets: [
        {
          quantity: 0,
          ticket_type: null,
        },
      ],
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationKey: ["create-guest"],
    mutationFn: async (data: FormData) => await createUserApi(data),
  });

  const closeModal = () => setIsOpen(false);

  const createUserFN = async (data: formdataProps) => {
    if (data?.tickets?.length === 0) {
      toast.error("Vous devez assigner un ticket !");
    } else {
      const formdata = new FormData();
      formdata.append("fname", data.fname);
      formdata.append("lname", data.lname);
      formdata.append("email", data.email);
      formdata.append("role_slug", "participant");
      formdata.append("password", data.password);
      data?.tickets?.forEach((ticket, index) => {
        formdata.append(
          `tickets[${index}][ticket_type]`,
          ticket?.ticket_type?.value
        );
        formdata.append(
          `tickets[${index}][quantity]`,
          String(ticket?.quantity)
        );
      });

      mutate(formdata, {
        onSuccess() {
          toast.success("L'utilisateur a été créé avec succès");
          reset();
          refetch();
          closeModal();
        },
        onError(error: errorResponse) {
          backendErrorHandler(setError, error);

          toast.error(
            `Error while creating user : ${error.response?.data?.error}`
          );
        },
      });
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-75"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Add User</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12 pb-4">
          <CreateUserForm
            control={control as any}
            errors={errors}
            setValue={setValue}
          />
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
              onClick={handleSubmit(createUserFN)}
            >
              {!isLoading && <span className="indicator-label">Crée</span>}
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
