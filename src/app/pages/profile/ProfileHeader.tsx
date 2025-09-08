import type React from "react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { KTIcon } from "../../../_metronic/helpers";
import clsx from "clsx";
import type { User } from "../../types/user";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Button, OverlayTrigger, Tooltip, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../types/reducers";
import { updateUserLogo } from "../../apis";
import toast from "react-hot-toast";
import { MeetingBookingModal } from "./components/meeting/meeting-booking-modal";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );
  const is_owner = currentUser?.id === user.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Modal states
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textMessage, setTextMessage] = useState<string>("");

  const updateAvatarMutation = useMutation(
    (formData: FormData) => updateUserLogo(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", user.id]);
        toast.success("Votre photo de profil a été mise à jour avec succès !");
      },
      onError: () => {
        toast.error(
          "Une erreur est survenue lors de la mise à jour de la photo de profil."
        );
      },
    }
  );

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      updateAvatarMutation.mutate(formData);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpenMeetModal = () => setShowMeetModal(true);
  const handleCloseMeetModal = () => setShowMeetModal(false);

  const handleOpenTextModal = () => setShowTextModal(true);
  const handleCloseTextModal = () => {
    setShowTextModal(false);
    setTextMessage("");
  };

  const handleSendText = () => {
    toast.success(`Message envoyé à ${user.fname}: "${textMessage}"`);
    handleCloseTextModal();
  };

  return (
    <div className="card rounded-0">
      <div className="card-body pt-9 pb-0">
        <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
          <div className="me-7 mb-4">
            <div
              className={clsx(
                "symbol symbol-100px symbol-lg-160px symbol-fixed position-relative",
                {
                  "border border-3 border-warning":
                    user?.roleValues?.name === "super_admin",
                }
              )}
            >
              <img
                src={getMediaUrl(user.avatar) || "/placeholder.svg"}
                alt={`Photo de profile de ${user?.fname}`}
                className="object-fit-cover"
              />
              {is_owner && (
                <div
                  className="position-absolute top-0 end-0 p-2 bg-white bg-opacity-75 rounded-circle cursor-pointer hover:bg-opacity-100 transition-all duration-300"
                  onClick={handleIconClick}
                >
                  <KTIcon iconName="pencil" className="fs-4 text-primary" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <span className="text-gray-800 fs-2 fw-bolder me-1">
                    {user.fname} {user.lname}
                  </span>
                  {user?.roleValues?.name === "super_admin" && (
                    <span>
                      <KTIcon iconName="verify" className="fs-1 text-primary" />
                    </span>
                  )}
                </div>
              </div>

              {!is_owner && (
                <div className="d-flex my-4 gap-2 flex-wrap">
                  <OverlayTrigger
                    placement="top-start"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Bientôt disponible !</Tooltip>}
                  >
                    <Button
                      variant="light"
                      className="opacity-25"
                      onClick={(e) => e.preventDefault()}
                    >
                      Follow
                    </Button>
                  </OverlayTrigger>
                  <Button variant="primary" onClick={handleOpenMeetModal}>
                    Request Meeting
                  </Button>
                  <Button variant="success" onClick={handleOpenTextModal}>
                    Send a message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meeting Booking Modal - Self-contained */}
        {showMeetModal && (
          <MeetingBookingModal
            targetUser={user}
            isOpen={showMeetModal}
            onClose={handleCloseMeetModal}
          />
        )}

        {/* Text Message Modal */}
        <Modal show={showTextModal} onHide={handleCloseTextModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Send a message à {user.fname}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="textMessage">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Écrivez votre message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTextModal}>
              Annuler
            </Button>
            <Button
              variant="success"
              onClick={handleSendText}
              disabled={!textMessage.trim()}
            >
              Envoyer
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export { ProfileHeader };
