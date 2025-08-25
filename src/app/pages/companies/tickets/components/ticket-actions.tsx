import { Dropdown } from "react-bootstrap";
import { KTIcon } from "../../../../../_metronic/helpers";
import { GiftedUserProps } from "../ticket-page";
import { useMutation } from "react-query";
import {
  deleteEmailOfGiftedUser,
  forgetPasswordApi,
  resendEmailToGiftedUser,
} from "../../../../apis";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { errorResponse } from "../../../../types/responses";
const MySwal = withReactContent(Swal);

const TicketActions = ({
  row,
  setUpdate,
  refetch,
}: {
  row: GiftedUserProps;
  setUpdate: any;
  refetch: any;
}) => {
  const is_used = row?.has_password === "1" ? true : false;

  const { mutate } = useMutation({
    mutationKey: ["resend-email-to-gifted-user"],
    mutationFn: async (email: string) => await resendEmailToGiftedUser(email),
  });

  const { mutate: deleteMutate } = useMutation({
    mutationKey: ["delete-email-to-gifted-user"],
    mutationFn: async (email: string) => await deleteEmailOfGiftedUser(email),
  });

  const { mutate: resetPasswordMutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: { email: string }) => {
      await forgetPasswordApi({
        email: data.email,
      });
    },
  });

  const handleDeleteTicket = async (email: string) => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        deleteMutate(email, {
          onSuccess() {
            MySwal.hideLoading();
            refetch();
            toast.success("Le ticket a été supprimé avec succès !");
          },
          onError(error: errorResponse) {
            toast.error(
              `Erreur lors de la suppression d'un ticket : ${error.response?.data?.error}`
            );
          },
        });
      }
    });
  };

  return (
    <Dropdown placement="top-start">
      <Dropdown.Toggle
        variant="transparent"
        color="#fff"
        id="post-dropdown"
        className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
      >
        <i className="ki-duotone ki-dots-square fs-1">
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
          <span className="path4"></span>
        </i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className="p-2">
          {/* RESET PASSWORD */}
          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              resetPasswordMutate(
                {
                  email: row.email,
                },
                {
                  onSuccess(data, variables, context) {
                    toast.success(
                      `Le lien de réinitialisation du mot de passe a été envoyé à ${row.email}`
                    );
                  },
                  onError(error, variables, context) {
                    toast.error(
                      "Erreur lors de l'envoi du lien de réinitialisation du mot de passe"
                    );
                  },
                }
              );
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="lock"
              className={`fs-1 cursor-pointer m-0 text-warning`}
            />
            <span className="text-muted mt-1 ms-2">
              Réinitialiser le mot de passe
            </span>
          </Dropdown.Item>
          {!is_used && (
            <>
              {/* delete user ticket */}
              <Dropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteTicket(row.email);
                }}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
              >
                <KTIcon
                  iconName="trash"
                  className={`fs-1 cursor-pointer m-0 text-danger`}
                />
                <span className="text-muted mt-1 ms-2">Supprimer</span>
              </Dropdown.Item>
              {/* resend email */}
              <Dropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  mutate(row.email, {
                    onSuccess(data, variables, context) {
                      toast.success("L'email à été envoyé !");
                    },
                    onError(error, variables, context) {
                      toast.error("Erreur lors du renvoi de l'e-mail !");
                    },
                  });
                }}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
              >
                <KTIcon
                  iconName="sms"
                  className={`fs-1 cursor-pointer m-0 text-primary`}
                />
                <span className="text-muted mt-1 ms-2">
                  Renvoyer l'invitation
                </span>
              </Dropdown.Item>

              <div className="p-2">
                {/* resend email */}
                <Dropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                    setUpdate(row);
                  }}
                  className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
                >
                  <KTIcon
                    iconName="pencil"
                    className={`fs-1 cursor-pointer m-0 text-primary`}
                  />
                  <span className="text-muted mt-1 ms-2">Modifier</span>
                </Dropdown.Item>
              </div>
            </>
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TicketActions;
