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
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";
import { kycManagementRoles } from "../../../utils/roles";
import KycReviewModal from "./kyc-review-modal";
import { GuestAccommodationsModal } from "../../accomodations-management/components/GuestAccommodationsModal";
import { CompanionAccommodationsModal } from "../../accomodations-management/components/CompanionAccommodationsModal";
import { ShowCompanionAccommodationModal } from "../../accomodations-management/components/ShowCompanionAccommodationModal";

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
      await forgetPasswordApi({ email: data.email });
    },
  });

  const [openAddNewTicket, setOpenAddNewTicket] = useState<User | null>(null);
  const [openAssignTicket, setOpenAssignTicket] = useState(false);
  const [openViewBadge, setOpenViewBadge] = useState(false);
  const [openAddNewStaff, setOpenAddNewStaff] = useState(false);
  const [openGiftTicketToOtherUser, setOpenGiftTicketToOtherUser] =
    useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [showUserQrCode, setShowUserQrCode] = useState(false);
  const [openAssignRoleModal, setOpenAssignRoleModal] = useState(false);
  const [openRemoveRoleModal, setOpenRemoveRoleModal] = useState(false);

  const currentUser = useSelector(selectUser);
  const isKycManager =
    (currentUser?.roles || []).some((r: any) =>
      kycManagementRoles.includes(String(r?.name || ""))
    ) ||
    kycManagementRoles.includes(String(currentUser?.roleValues?.name || ""));

  const [openKycReviewModal, setOpenKycReviewModal] = useState(false);

  const [openGuestAccommodations, setOpenGuestAccommodations] = useState(false);
  const [openCompanionAccommodations, setOpenCompanionAccommodations] =
    useState(false);
  const [openCompanionDetail, setOpenCompanionDetail] = useState<string | null>(
    null
  );

  return (
    <>
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
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold m-0 px-5 py-3"
          >
            <KTIcon iconName="eye" className="fs-1 m-0 text-success" />
            <span className="text-muted ms-2">View QR Code</span>
          </Dropdown.Item>

          {isKycManager && (
            <Dropdown.Item
              onClick={() => setOpenKycReviewModal(true)}
              disabled={!props?.has_kyc}
              className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info fw-bold m-0 px-5 py-3"
            >
              <KTIcon
                iconName="shield-search"
                className="fs-1 m-0 text-primary"
              />
              <span className="text-muted ms-2">Review KYC</span>
            </Dropdown.Item>
          )}

          <Dropdown.Item
            onClick={() => setOpenAssignRoleModal(true)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
          >
            <KTIcon iconName="shield-check" className="fs-1 m-0 text-primary" />
            <span className="text-muted ms-2">Assign Role</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => setOpenRemoveRoleModal(true)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
          >
            <KTIcon iconName="shield-cross" className="fs-1 m-0 text-danger" />
            <span className="text-muted ms-2">Remove Role</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => setOpenResetPasswordModal(true)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
          >
            <KTIcon iconName="lock" className="fs-1 m-0 text-success" />
            <span className="text-muted ms-2">Reset User password</span>
          </Dropdown.Item>

          {props?.user_has_ticket_id !== null && (
            <Dropdown.Item
              onClick={() => setOpenViewBadge(true)}
              className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
            >
              <KTIcon iconName="printer" className="fs-1 m-0 text-primary" />
              <span className="text-muted ms-2">Visualiser le badge</span>
            </Dropdown.Item>
          )}

          <Dropdown.Item
            onClick={openViewModal}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
          >
            <KTIcon iconName="eye" className="fs-1 m-0 text-success" />
            <span className="text-muted ms-2">View</span>
          </Dropdown.Item>

          {props?.has_password === "0" ? (
            <Dropdown.Item
              onClick={() =>
                mutate(props.email, {
                  onSuccess() {
                    toast.success("Invitation envoyée");
                  },
                  onError() {
                    toast.error("Erreur lors de l'envoi");
                  },
                })
              }
              className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
            >
              <KTIcon iconName="sms" className="fs-1 m-0 text-primary" />
              <span className="text-muted ms-2">Renvoyer l'invitation</span>
            </Dropdown.Item>
          ) : (
            <Dropdown.Item
              onClick={() =>
                resetPasswordMutate(
                  { email: props.email },
                  {
                    onSuccess() {
                      toast.success(`Lien envoyé à ${props.email}`);
                    },
                    onError() {
                      toast.error("Erreur lors de l'envoi");
                    },
                  }
                )
              }
              className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
            >
              <KTIcon iconName="lock" className="fs-1 m-0 text-warning" />
              <span className="text-muted ms-2">
                Réinitialiser le mot de passe
              </span>
            </Dropdown.Item>
          )}

          <Dropdown.Item
            onClick={() => setOpenGuestAccommodations(true)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
          >
            <KTIcon iconName="home-2" className="fs-1 m-0 text-info" />
            <span className="text-muted ms-2">Guest Accommodations</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => setOpenCompanionAccommodations(true)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 fw-bold m-0 px-5 py-3"
          >
            <KTIcon iconName="home" className="fs-1 m-0 text-primary" />
            <span className="text-muted ms-2">Companion Accommodations</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <AddNewTicketToUserModal
        isOpen={!!openAddNewTicket}
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
          userID={props.id}
          key={String(openViewBadge)}
          userName={props.fname + " " + props.lname}
        />
      )}
      {openAddNewStaff && (
        <AddStaffModal
          userId={props.id}
          userName={props.fname + " " + props.lname}
          isOpen={openAddNewStaff}
          setIsOpen={setOpenAddNewStaff}
        />
      )}
      {openResetPasswordModal && (
        <ResetPasswordModal
          userId={props.id}
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
          userId={props.id}
          userName={props.fname + " " + props.lname}
        />
      )}
      {isKycManager && (
        <KycReviewModal
          isOpen={openKycReviewModal}
          setIsOpen={setOpenKycReviewModal}
          userId={props.id}
          userName={props.fname + " " + props.lname}
          currentStatus={(props?.info?.kyc_status as any) || ""}
          onStatusChange={(status) => toast.success(`KYC updated to ${status}`)}
        />
      )}
      {openAssignRoleModal && (
        <AssignRoleModal
          isOpen={openAssignRoleModal}
          setIsOpen={setOpenAssignRoleModal}
          userId={props.id}
          userName={props.fname + " " + props.lname}
          userRoles={props.roles || []}
        />
      )}
      {openRemoveRoleModal && (
        <RemoveRoleModal
          isOpen={openRemoveRoleModal}
          setIsOpen={setOpenRemoveRoleModal}
          userId={props.id}
          userName={props.fname + " " + props.lname}
          userRoles={props.roles || []}
        />
      )}
      {openGuestAccommodations && (
        <GuestAccommodationsModal
          isOpen={openGuestAccommodations}
          onClose={() => setOpenGuestAccommodations(false)}
          userId={String(props.id)}
        />
      )}
      {openCompanionAccommodations && (
        <CompanionAccommodationsModal
          isOpen={openCompanionAccommodations}
          onClose={() => setOpenCompanionAccommodations(false)}
          userId={String(props.id)}
          onOpenAccommodation={(id) => setOpenCompanionDetail(String(id))}
        />
      )}
      {openCompanionDetail && (
        <ShowCompanionAccommodationModal
          isOpen={!!openCompanionDetail}
          onClose={() => setOpenCompanionDetail(null)}
          userId={String(props.id)}
          accommodationId={openCompanionDetail}
        />
      )}
    </>
  );
};

export default UserActionColumn;
