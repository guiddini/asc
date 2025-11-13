import type React from "react";
import { KTIcon } from "../../../_metronic/helpers";
import clsx from "clsx";
import type { User } from "../../types/user";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../types/reducers";
import toast from "react-hot-toast";
import { MeetingBookingModal } from "./components/meeting/meeting-booking-modal";
import {
  checkUserConnectionStatus,
  sendUserConnectionRequest,
} from "../../apis/user-connection";
import type { UserConnectionStatus } from "../../types/user-connection";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  UserPlus,
  UserCheck,
  Clock,
  Calendar,
  MessageSquare,
  Handshake,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";

interface ProfileHeaderProps {
  user: User;
}

function decodeUnicode(str: string) {
  return str.replace(/\\u[\dA-F]{4}/gi, (match) =>
    String.fromCharCode(parseInt(match.replace("\\u", ""), 16))
  );
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );
  const is_owner = currentUser?.id === user.id;
  const queryClient = useQueryClient();

  // Connection status via React Query
  const { data: connectionStatus = "none", isLoading: isConnectionLoading } =
    useQuery<UserConnectionStatus>({
      queryKey: ["user-connection-status", user.id],
      queryFn: async () => {
        const response = await checkUserConnectionStatus(user.id);
        return response.status as UserConnectionStatus;
      },
      enabled: !is_owner && Boolean(user.id),
      retry: 1,
      staleTime: 1000 * 60,
    });

  // Connect mutation
  const sendConnectionMutation = useMutation({
    mutationFn: async () => sendUserConnectionRequest(user.id),
    onSuccess: () => {
      queryClient.setQueryData(
        ["user-connection-status", user.id],
        "pending" as UserConnectionStatus
      );
      toast.success(`Connection request sent to ${user.fname}`);
    },
    onError: (error: unknown) => {
      console.error("Error sending connection request:", error);
      toast.error("Failed to send connection request. Please try again.");
    },
  });

  const handleConnect = () => {
    if (connectionStatus !== "none") return;
    sendConnectionMutation.mutate();
  };

  // Manage modal visibility via React Query cache (no local state)
  const { data: showMeetModal = false } = useQuery<boolean>({
    queryKey: ["profileHeader", "showMeetModal", user.id],
    queryFn: async () => false,
    initialData: false,
  });

  const { data: showTextModal = false } = useQuery<boolean>({
    queryKey: ["profileHeader", "showTextModal", user.id],
    queryFn: async () => false,
    initialData: false,
  });

  const { data: textMessage = "" } = useQuery<string>({
    queryKey: ["profileHeader", "textMessage", user.id],
    queryFn: async () => "",
    initialData: "",
  });

  const handleOpenMeetModal = () =>
    queryClient.setQueryData(["profileHeader", "showMeetModal", user.id], true);
  const handleCloseMeetModal = () =>
    queryClient.setQueryData(
      ["profileHeader", "showMeetModal", user.id],
      false
    );

  const handleOpenTextModal = () =>
    queryClient.setQueryData(["profileHeader", "showTextModal", user.id], true);
  const handleCloseTextModal = () => {
    queryClient.setQueryData(
      ["profileHeader", "showTextModal", user.id],
      false
    );
    queryClient.setQueryData(["profileHeader", "textMessage", user.id], "");
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    queryClient.setQueryData(
      ["profileHeader", "textMessage", user.id],
      e.target.value
    );
  };

  const handleSendText = () => {
    const message =
      (queryClient.getQueryData([
        "profileHeader",
        "textMessage",
        user.id,
      ]) as string) || "";
    toast.success(`Message sent to ${user.fname}: "${message}"`);
    handleCloseTextModal();
  };
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
                    <a
                      href="#edit-profile"
                      className={clsx(
                        "symbol symbol-100px symbol-fixed position-relative",
                        {
                          "border border-3 border-warning":
                            user?.roleValues?.name === "super_admin",
                        }
                      )}
                    >
                      <img
                        src={getMediaUrl(user?.avatar) || "/placeholder.svg"}
                        alt={`Profile photo of ${user?.fname}`}
                        className="object-fit-cover rounded-circle border shadow-sm"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </a>
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
                  <p className="text-white mb-0 small d-inline-flex align-items-center">
                    {user?.info?.city && user?.info?.wilaya?.name
                      ? `${user.info.city}, ${user.info.wilaya.name}`
                      : user?.info?.country?.name_fr ||
                        "Location not specified"}
                    {user?.info?.country?.code && (
                      <ReactCountryFlag
                        countryCode={user.info.country.code}
                        svg
                        title={
                          user.info.country.name_fr || user.info.country.name_en
                        }
                        aria-label={
                          user.info.country.name_en || user.info.country.name_fr
                        }
                        style={{
                          width: "1.2em",
                          height: "1.2em",
                          marginLeft: "0.5rem",
                          display: "inline-block",
                        }}
                      />
                    )}
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
              <Button variant="dark" as={"a"} href="#edit-profile">
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2 flex-wrap">
              {connectionStatus === "none" && (
                <Button
                  variant="outline-dark"
                  className="rounded-pill px-4 fw-semibold"
                  onClick={handleConnect}
                  disabled={sendConnectionMutation.isLoading}
                >
                  {sendConnectionMutation.isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} className="me-2" />
                      Connect
                    </>
                  )}
                </Button>
              )}

              {connectionStatus === "pending" && (
                <Button
                  variant="outline-secondary"
                  className="rounded-pill px-4 fw-semibold"
                  disabled
                >
                  <Clock size={18} className="me-2" />
                  Pending
                </Button>
              )}

              {connectionStatus === "accepted" && (
                <Button
                  variant="outline-success"
                  className="rounded-pill px-4 fw-semibold"
                  disabled
                >
                  <UserCheck size={18} className="me-2" />
                  Connected
                </Button>
              )}

              <Button
                variant="outline-primary"
                className="rounded-pill px-4 fw-semibold"
                onClick={handleOpenMeetModal}
              >
                <Calendar size={18} className="me-2" />
                Request Meeting
              </Button>
              <Button
                variant="outline-warning"
                className="rounded-pill px-4 fw-semibold"
                disabled
                title="Deal Room coming soon"
              >
                <Handshake size={18} className="me-2" />
                Deal Room
              </Button>
              <Button
                variant="outline-info"
                className="rounded-pill px-4 fw-semibold"
                onClick={() => navigate(`/chat?to=${user.id}`)}
              >
                <MessageSquare size={18} className="me-2" />
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
              <p
                className="text-muted mb-4"
                dangerouslySetInnerHTML={{
                  __html: decodeUnicode(user.info?.about_you || ""),
                }}
              />

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
                      {user?.info?.job_title}
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
              onChange={handleTextChange}
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
