import { Dropdown } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useMutation } from "react-query";
import { forgetPasswordApi, resendEmailToUserApi } from "../../../apis";
import { User } from "../../../types/user";
import toast from "react-hot-toast";
import { useState } from "react";
import AddNewTicketToUserModal from "./add-new-ticket-to-user-modal";
import AssignTicketToUser from "./assign-ticket-to-user";
import ViewUserBadge from "./view-user-badge";
import AddStaffModal from "./add-user-to-staff";
import ResetPasswordModal from "./ResetPasswordModal";
import GiftTicketToOtherUserModal from "./gift-ticket-to-other-user-modal";
import ShowUserQrCodeModal from "./show-user-qr-code";
import AssignRoleModal from "./assign-role-modal";
import RemoveRoleModal from "./remove-role-modal";

const UserActionColumn = ({
  openViewModal,
  props,
}: {
  openViewModal: (any) => any;
  props: User;
}) => {
  const { mutate } = useMutation({
    mutationKey: ["resend-email-to-user"],
    mutationFn: async (email: string) => await resendEmailToUserApi(email),
  });

  const { mutate: resetPasswordMutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: { email: string }) => {
      await forgetPasswordApi({
        email: data.email,
      });
    },
  });

  const [openAddNewTicket, setOpenAddNewTicket] = useState<User | null>(null);
  const [openAssignTicket, setOpenAssignTicket] = useState<boolean>(false);
  const [openViewBadge, setOpenViewBadge] = useState<boolean>(false);
  const [openAddNewStaff, setOpenAddNewStaff] = useState<boolean>(false);
  const [openGiftTicketToOtherUser, setOpenGiftTicketToOtherUser] =
    useState<boolean>(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] =
    useState<boolean>(false);
  const [showUserQrCode, setShowUserQrCode] = useState<boolean>(false);
  const [openAssignRoleModal, setOpenAssignRoleModal] =
    useState<boolean>(false);
  const [openRemoveRoleModal, setOpenRemoveRoleModal] =
    useState<boolean>(false);

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
        <Dropdown.Item
          onClick={() => setShowUserQrCode(true)}
          className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
        >
          <div className="cursor-pointer d-flex flex-row align-items-center">
            <KTIcon
              iconName="eye"
              className="fs-1 cursor-pointer m-0 text-success"
            />
            <span className="text-muted ms-2">View QR Code</span>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={() => setOpenAddNewStaff(true)}
          className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
        >
          <div className="cursor-pointer d-flex flex-row align-items-center">
            <KTIcon
              iconName="plus"
              className="fs-1 cursor-pointer m-0 text-success"
            />
            <span className="text-muted ms-2">Ajouter comme un staff</span>
          </div>
        </Dropdown.Item>

        {/* New Role Management Options */}
        <Dropdown.Item
          onClick={() => setOpenAssignRoleModal(true)}
          className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
        >
          <div className="cursor-pointer d-flex flex-row align-items-center">
            <KTIcon
              iconName="shield-check"
              className="fs-1 cursor-pointer m-0 text-primary"
            />
            <span className="text-muted ms-2">Assign Role</span>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={() => setOpenRemoveRoleModal(true)}
          className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
        >
          <div className="cursor-pointer d-flex flex-row align-items-center">
            <KTIcon
              iconName="shield-cross"
              className="fs-1 cursor-pointer m-0 text-danger"
            />
            <span className="text-muted ms-2">Remove Role</span>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={() => setOpenResetPasswordModal(true)}
          className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
        >
          <div className="cursor-pointer d-flex flex-row align-items-center">
            <KTIcon
              iconName="lock"
              className="fs-1 cursor-pointer m-0 text-success"
            />
            <span className="text-muted ms-2">Reset User password</span>
          </div>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={(e) => {
            e.preventDefault();
            setOpenGiftTicketToOtherUser(true);
          }}
          className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
        >
          <div className="cursor-pointer d-flex flex-row align-items-center">
            <KTIcon
              iconName="receipt-square"
              className="fs-1 cursor-pointer m-0 text-warning"
            />
            <span className="text-muted ms-2">Gift ticket to other user</span>
          </div>
        </Dropdown.Item>

        <div className="p-2">
          <Dropdown.Item
            onClick={() => {
              setOpenAddNewTicket(props);
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <i className="fa-solid fa-ticket fs-2 text-custom-purple-dark me-1"></i>
              <span className="text-muted ms-2">Ajouter des tickets</span>
            </div>
          </Dropdown.Item>

          {/* print badge && assign ticket */}
          {props?.user_has_ticket_id === null ? (
            <Dropdown.Item
              onClick={(e) => {
                e.preventDefault();
                setOpenAssignTicket(true);
              }}
              className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
            >
              <div className="cursor-pointer d-flex flex-row align-items-center">
                <KTIcon
                  iconName="receipt-square"
                  className="fs-1 cursor-pointer m-0 text-warning"
                />
                <span className="text-muted ms-2">Assigner un ticket</span>
              </div>
            </Dropdown.Item>
          ) : (
            <>
              <Dropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  setOpenViewBadge(true);
                }}
                className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
              >
                <div className="cursor-pointer d-flex flex-row align-items-center">
                  <KTIcon
                    iconName="printer"
                    className="fs-1 cursor-pointer m-0 text-primary"
                  />
                  <span className="text-muted ms-2">Visualiser le badge</span>
                </div>
              </Dropdown.Item>
            </>
          )}

          {/* resend email */}
          <Dropdown.Item
            onClick={openViewModal}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="eye"
                className="fs-1 cursor-pointer m-0 text-success"
              />
              <span className="text-muted ms-2">View</span>
            </div>
          </Dropdown.Item>

          {props?.has_password === "0" ? (
            <>
              {/* resend email */}
              <Dropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  mutate(props.email, {
                    onSuccess(data, variables, context) {
                      toast.success("L'invitation à été envoyé !");
                    },
                    onError(error, variables, context) {
                      toast.error("Erreur lors du renvoi de l'invitation !");
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
            </>
          ) : (
            <>
              {/* RESET PASSWORD */}
              <Dropdown.Item
                onClick={(e) => {
                  e.preventDefault();
                  resetPasswordMutate(
                    {
                      email: props.email,
                    },
                    {
                      onSuccess(data, variables, context) {
                        toast.success(
                          `Le lien de réinitialisation du mot de passe a été envoyé à ${props.email}`
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
            </>
          )}
        </div>
      </Dropdown.Menu>

      {/* All existing modals */}
      <AddNewTicketToUserModal
        isOpen={openAddNewTicket === null ? false : true}
        setIsOpen={setOpenAddNewTicket}
        user={openAddNewTicket}
      />
      {openAssignTicket && (
        <AssignTicketToUser
          isOpen={openAssignTicket}
          setIsOpen={setOpenAssignTicket}
          user={props}
        />
      )}
      {openViewBadge && (
        <ViewUserBadge
          isOpen={openViewBadge}
          setIsOpen={setOpenViewBadge}
          userID={props?.id}
          key={String(openViewBadge)}
          userName={props?.fname + " " + props.lname}
        />
      )}
      {openAddNewStaff && (
        <AddStaffModal
          userId={props?.id}
          userName={props?.fname + " " + props?.lname}
          isOpen={openAddNewStaff}
          setIsOpen={setOpenAddNewStaff}
        />
      )}
      {openResetPasswordModal && (
        <ResetPasswordModal
          userId={props?.id}
          isOpen={openResetPasswordModal}
          setIsOpen={setOpenResetPasswordModal}
        />
      )}
      {openGiftTicketToOtherUser && (
        <GiftTicketToOtherUserModal
          isOpen={openGiftTicketToOtherUser}
          setIsOpen={setOpenGiftTicketToOtherUser}
          user={props}
        />
      )}
      {showUserQrCode && (
        <ShowUserQrCodeModal
          isOpen={showUserQrCode}
          setIsOpen={setShowUserQrCode}
          userId={props?.id}
          userName={props?.fname + " " + props?.lname}
        />
      )}

      {/* New Role Management Modals */}
      {openAssignRoleModal && (
        <AssignRoleModal
          isOpen={openAssignRoleModal}
          setIsOpen={setOpenAssignRoleModal}
          userId={props?.id}
          userName={props?.fname + " " + props?.lname}
          userRoles={props?.roles || []} // Pass user's current roles
        />
      )}
      {openRemoveRoleModal && (
        <RemoveRoleModal
          isOpen={openRemoveRoleModal}
          setIsOpen={setOpenRemoveRoleModal}
          userId={props?.id}
          userName={props?.fname + " " + props?.lname}
          userRoles={props?.roles || []} // Pass user's current roles
        />
      )}
    </Dropdown>
  );
};

export default UserActionColumn;
