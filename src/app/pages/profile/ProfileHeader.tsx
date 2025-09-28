import type React from "react";
import { useState } from "react";
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
    <div className="container-fluid px-0 mb-4">
      {/* Main Profile Card */}
      <div className="card shadow border-0 rounded-4 overflow-hidden">
        {/* Header with gradient background */}
        <div className="position-relative bg-primary py-5">
          {/* Profile section with avatar and basic info */}
          <div className="row align-items-center px-4">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center">
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
                    </div>
                  </div>
                </div>

                {/* Name and basic info */}
                <div className="text-white ms-4">
                  <h3 className="fw-bold mb-1 text-white">
                    {user.fname} {user.lname}
                    {user?.roleValues?.name === "super_admin" && (
                      <KTIcon
                        iconName="verify"
                        className="fs-4 text-warning ms-2"
                      />
                    )}
                  </h3>
                  <p className="text-white mb-1">
                    {user?.info?.occupationFound?.label_fr ||
                      user?.info?.occupation ||
                      user.job_title ||
                      "Event Participant"}
                  </p>
                  <p className="text-white mb-0 small">
                    {user?.info?.city && user?.info?.wilaya?.name
                      ? `${user.info.city}, ${user.info.wilaya.name}`
                      : user?.info?.country?.name_fr ||
                        "Location not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right side info cards */}
            <div className="col-12 col-md-6 mt-4 mt-md-0">
              <div className="row g-3">
                {/* Skills/Activity Areas */}
                {user?.activity_areas && user.activity_areas.length > 0 && (
                  <div className="col-12">
                    <div className="bg-white bg-opacity-10 rounded-3 p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-white small">
                          Areas of Interest
                        </span>
                        <KTIcon iconName="star" className="text-white" />
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {user.activity_areas.slice(0, 4).map((area, index) => (
                          <span
                            key={index}
                            className="badge bg-white text-primary px-2 py-1 rounded-pill small"
                          >
                            {area.label_fr || area.name}
                          </span>
                        ))}
                        {user.activity_areas.length > 4 && (
                          <span className="badge bg-white text-primary px-2 py-1 rounded-pill small">
                            +{user.activity_areas.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons section */}
        <div className="bg-white px-4 py-3">
          {is_owner ? (
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="dark"
                className="rounded-pill px-4 fw-semibold"
                as={"a"}
                href="#edit-profile"
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="danger"
                className="rounded-pill px-4 fw-semibold"
              >
                <KTIcon iconName="heart" className="me-2" />
                Follow
              </Button>
              <Button
                variant="primary"
                className="rounded-pill px-4"
                onClick={handleOpenMeetModal}
              >
                Request Meeting
              </Button>
              <Button
                variant="success"
                className="rounded-pill px-4"
                onClick={handleOpenTextModal}
              >
                Send Message
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Information Cards */}
      <div className="row g-4 mt-1">
        {/* About Section */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold text-primary mb-3">About</h5>
              <p className="text-muted mb-4">
                {user.info?.about_you ||
                  "Event participant looking forward to networking and learning opportunities."}
              </p>

              {/* Contact Information */}
              <h6 className="fw-bold text-dark mb-3">Contact Information</h6>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center">
                    <KTIcon iconName="sms" className="me-3 text-primary fs-4" />
                    <div>
                      <small className="text-secondary d-block">Email</small>
                      <span className="text-dark">{user.email}</span>
                    </div>
                  </div>
                </div>
                {user?.info?.phone && (
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="phone"
                        className="me-3 text-success fs-4"
                      />
                      <div>
                        <small className="text-secondary d-block">Phone</small>
                        <span className="text-dark">{user.info.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
                {user?.info?.address && (
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="geolocation"
                        className="me-3 text-info fs-4"
                      />
                      <div>
                        <small className="text-secondary d-block">
                          Address
                        </small>
                        <span className="text-dark">{user.info.address}</span>
                      </div>
                    </div>
                  </div>
                )}
                {user.info?.linkedin_url && (
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center">
                      <KTIcon
                        iconName="linkedin"
                        className="me-3 text-info fs-4"
                      />
                      <div>
                        <small className="text-secondary d-block">
                          LinkedIn
                        </small>
                        <a
                          href={user.info.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-decoration-none"
                        >
                          View LinkedIn Profile
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side Information */}
        <div className="col-12 col-lg-4">
          <div className="row g-4">
            {/* Professional Info */}
            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4">
                  <h6 className="fw-bold text-primary mb-3">
                    Professional Info
                  </h6>
                  <div className="mb-3">
                    <small className="text-secondary d-block">Position</small>
                    <span className="fw-semibold text-dark">
                      {user?.info?.occupationFound?.label_fr ||
                        user?.info?.occupation ||
                        user.job_title ||
                        "Event Participant"}
                    </span>
                  </div>
                  <div className="mb-3">
                    <small className="text-secondary d-block">
                      Organization
                    </small>
                    <span className="text-dark">
                      {user?.info?.company_name ||
                        user?.info?.institution_name ||
                        "Not specified"}
                    </span>
                  </div>
                  {user?.info?.institution_type && (
                    <div>
                      <small className="text-secondary d-block">Type</small>
                      <span className="text-dark">
                        {user.info.institution_type}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Participation Goals */}
            {user?.info?.participation_goals && (
              <div className="col-12">
                <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-primary mb-3">
                      Participation Goals
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {JSON.parse(user.info.participation_goals).map(
                        (goal: string, index: number) => (
                          <span
                            key={index}
                            className="badge bg-primary text-white px-3 py-2 rounded-pill small"
                          >
                            {goal}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
  );
};

export { ProfileHeader };
