import type React from "react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { KTIcon } from "../../../_metronic/helpers";
import clsx from "clsx";
import type { User } from "../../types/user";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Button, Modal, Form } from "react-bootstrap";
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

  const participationGoals = [
    "Networking with professionals",
    "Learning new technologies",
    "Finding investors",
    "Showcasing my startup",
    "Collaborating on projects",
  ];

  const updateAvatarMutation = useMutation(
    (formData: FormData) => updateUserLogo(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", user.id]);
        toast.success("Profile picture updated successfully!");
      },
      onError: () => {
        toast.error("An error occurred while updating the profile picture.");
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
    toast.success(`Message sent to ${user.fname}: "${textMessage}"`);
    handleCloseTextModal();
  };
  console.log("Rendering ProfileHeader for user:", user);
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body py-4 px-4 text-center">
        {/* Avatar centré + Nom */}
        <div className="d-flex flex-column align-items-center mb-4">
          <div className="position-relative mb-3">
            <div
              className={clsx(
                "symbol symbol-100px symbol-fixed position-relative",
                {
                  "border border-3 border-warning":
                    user?.roleValues?.name === "super_admin",
                }
              )}
            >
              <img
                src={getMediaUrl(user.avatar) || "/placeholder.svg"}
                alt={`Profile photo of ${user?.fname}`}
                className="object-fit-cover rounded-circle border shadow-sm"
                style={{ width: "100px", height: "100px" }}
              />
              {is_owner && (
                <div
                  className="position-absolute top-0 end-0 p-1 bg-white bg-opacity-75 rounded-circle cursor-pointer"
                  onClick={handleIconClick}
                >
                  <KTIcon iconName="pencil" className="fs-5 text-primary" />
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

          <h4 className="fw-bold text-dark mb-1">
            {user.fname} {user.lname}
            {user?.roleValues?.name === "super_admin" && (
              <KTIcon iconName="verify" className="fs-3 text-primary ms-2" />
            )}
          </h4>
          <span className="text-muted small">
            {user.job_title || "Full Stack Developer"}
          </span>
        </div>

        {/* Actions (si non owner) */}
        {!is_owner && (
          <div className="d-flex gap-2 flex-wrap justify-content-center mb-4">
            <Button variant="danger" className="d-flex align-items-center px-3">
              <KTIcon iconName="heart" className="me-2 fs-4" />
              Follow
            </Button>
            <Button variant="primary" onClick={handleOpenMeetModal}>
              Request Meeting
            </Button>
            <Button variant="success" onClick={handleOpenTextModal}>
              Send a Message
            </Button>
          </div>
        )}

        {/* Divider */}
        <hr className="my-4" />

        {/* Extra Info */}
        <div
          className="card shadow-sm border-0 rounded-4 p-4 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          {/* About me */}
          <div className="text-center mb-4">
            <h6 className="fw-bold text-dark mb-3">About me</h6>
            <p className="text-muted small mb-0 px-2">
              {user.info?.about_you ||
                "Passionate developer with experience in fintech and web apps."}
            </p>
          </div>
          <div className="text-center mb-4">
            <h6 className="fw-bold text-dark mb-3">LinkedIn</h6>
            <p className="text-muted small mb-0 px-2">
              {user.info?.linkedin_url ? (
                <a
                  href={user.info.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.info.linkedin_url}
                </a>
              ) : (
                "No LinkedIn profile available."
              )}
            </p>
          </div>

          {/* Professional Info */}
          <h5 className="fw-bold text-primary mb-4 text-center">
            Professional Information
          </h5>
          <ul className="list-unstyled small text-muted mb-4">
            <li className="mb-3 d-flex justify-content-center align-items-center">
              <KTIcon iconName="briefcase" className="me-2 text-info fs-5" />
              <span className="fw-semibold text-dark">
                {user?.info?.job_title || "Full Stack Developer"} at{" "}
                {user?.info?.company_name || "Guiddini - Fintech Solutions"}
              </span>
            </li>

            <li className="mb-3 d-flex justify-content-center align-items-center">
              <KTIcon iconName="sms" className="me-2 text-primary fs-5" />
              <span>{user.email}</span>
            </li>
            <li className="d-flex justify-content-center align-items-center">
              <KTIcon iconName="phone" className="me-2 text-success fs-5" />
              <span>{user?.info?.phone}</span>
            </li>
            <li className="d-flex justify-content-center align-items-center gap-2">
              <span>{user?.info?.country?.name_fr}</span>
            </li>
          </ul>

          {/* Participation Goals */}
          <div className="border-top pt-4">
            <h6 className="fw-bold text-dark mb-3 text-center">
              Participation Goals
            </h6>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              {user?.info?.participation_goals &&
                JSON.parse(user.info.participation_goals).map(
                  (goal: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-light border rounded-pill small text-dark fw-semibold shadow-sm"
                    >
                      {goal}
                    </span>
                  )
                )}
            </div>
          </div>
          <div className="border-top pt-4 mt-4">
            <h6 className="fw-bold text-dark mb-3 text-center">
              Industry Sectors
            </h6>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              {user?.activity_areas &&
                user.activity_areas.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-light border rounded-pill small text-dark fw-semibold shadow-sm"
                  >
                    {area.label_fr || area.name}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Meeting Booking Modal */}
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
            <Modal.Title>Send a message to {user.fname}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="textMessage">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your message..."
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTextModal}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleSendText}
              disabled={!textMessage.trim()}
            >
              Send
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export { ProfileHeader };
