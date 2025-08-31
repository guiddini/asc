import type React from "react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { KTIcon } from "../../../_metronic/helpers";
import clsx from "clsx";
import type { User } from "../../types/user";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Button, OverlayTrigger, Tooltip, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../types/reducers";
import { updateUserLogo } from "../../apis";
import { createMeeting } from "../../apis/meetings";
import toast from "react-hot-toast";
import {
  formatMeetingDateTime,
  getThreeDayRange,
  locations,
  timeSlots,
  isSlotAvailable,
  TimeSlot,
} from "../meetings/utils/scheduleUtils";
import { getBookedUserSlot } from "../../apis/slot";

interface ProfileHeaderProps {
  user: User;
}

interface BookedSlot {
  id: string;
  user_id: string;
  topic: string;
  start_time: string;
  end_time: string;
  slotable_type: string;
  slotable_id: string;
  created_at: string;
  updated_at: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );
  const is_owner = currentUser?.id === user.id;
  const user_company = user?.company;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Meeting modal states - Updated for new API
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [topic, setTopic] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Text modal states
  const [showTextModal, setShowTextModal] = useState(false);
  const [textMessage, setTextMessage] = useState<string>("");

  // Use shared utility
  const threeDayRange = getThreeDayRange();

  // Fetch booked slots for the profile user (receiver) - Always fetch, not conditional
  const { data: receiverBookedSlots = [] } = useQuery<BookedSlot[]>(
    ["bookedSlots", user.id],
    () => getBookedUserSlot(user.id),
    {
      enabled: !!user.id,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch booked slots for current user - Always fetch, not conditional
  const { data: currentUserBookedSlots = [] } = useQuery<BookedSlot[]>(
    ["bookedSlots", currentUser?.id],
    () => getBookedUserSlot(currentUser?.id || ""),
    {
      enabled: !!currentUser?.id,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Combine both users' booked slots
  const allBookedSlots = [...receiverBookedSlots, ...currentUserBookedSlots];

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

  // Updated mutation with proper error handling
  const createMeetingMutation = useMutation(createMeeting, {
    onSuccess: () => {
      queryClient.invalidateQueries("meetings");
      queryClient.invalidateQueries(["bookedSlots", user.id]);
      queryClient.invalidateQueries(["bookedSlots", currentUser?.id]);
      toast.success(`Meeting request sent to ${user.fname}!`);
      handleCloseMeetModal();
    },
    onError: (error: any) => {
      // Extract the error message from the API response
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create meeting request";
      toast.error(errorMessage);
    },
  });

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

  const handleCloseMeetModal = () => {
    setShowMeetModal(false);
    setTopic("");
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setSelectedLocation("");
  };

  // Updated handler for new API structure
  const handleConfirmMeet = () => {
    if (!topic || !selectedDate || !selectedTimeSlot || !selectedLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if the selected time slot is available for both users
    const startDateTime = `${selectedDate} ${selectedTimeSlot.start}:00`;
    const endDateTime = `${selectedDate} ${selectedTimeSlot.end}:00`;

    if (!isSlotAvailable(startDateTime, endDateTime, allBookedSlots)) {
      toast.error(
        "This time slot is not available for one or both participants. Please select another time."
      );
      return;
    }

    const meetingData = {
      receiver_id: user.id,
      topic: topic,
      start_time: `${selectedDate}T${selectedTimeSlot.start}:00`,
      end_time: `${selectedDate}T${selectedTimeSlot.end}:00`,
      location: selectedLocation,
    };

    createMeetingMutation.mutate(meetingData);
  };

  const handleOpenTextModal = () => setShowTextModal(true);

  const handleCloseTextModal = () => {
    setShowTextModal(false);
    setTextMessage("");
  };

  const handleSendText = () => {
    toast.success(`Message envoyé à ${user.fname}: "${textMessage}"`);
    handleCloseTextModal();
  };

  // Helper function to check if a time slot is booked for either user on a specific date
  const isTimeSlotBooked = (date: string, slot: TimeSlot): boolean => {
    if (!date || !allBookedSlots.length) return false;

    // Create the full datetime strings for comparison
    const slotStartTime = `${date} ${slot.start}:00`;
    const slotEndTime = `${date} ${slot.end}:00`;

    // Use the isSlotAvailable function to check availability
    return !isSlotAvailable(slotStartTime, slotEndTime, allBookedSlots);
  };

  // Helper function to get available slots count for a specific date
  const getAvailableSlotsCount = (date: string): number => {
    return timeSlots.filter((slot) => !isTimeSlotBooked(date, slot)).length;
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
                      Suivre
                    </Button>
                  </OverlayTrigger>
                  <Button variant="primary" onClick={handleOpenMeetModal}>
                    Request Meeting
                  </Button>
                  <Button variant="success" onClick={handleOpenTextModal}>
                    Envoyer un message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meet Modal - Updated for new API */}
        <Modal
          show={showMeetModal}
          onHide={handleCloseMeetModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-calendar-plus me-2"></i>
              Request Meeting with {user.fname}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-4">
              {/* Topic Field - Now with Textarea */}
              <div className="col-12">
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-chat-text me-2"></i>
                    Meeting Topic <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe the meeting topic and agenda..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>

              {/* Date Selection */}
              <div className="col-12">
                <Form.Label className="fw-bold">
                  <i className="bi bi-calendar me-2"></i>
                  Select Date <span className="text-danger">*</span>
                </Form.Label>
                <div className="d-flex gap-2 flex-wrap">
                  {threeDayRange.map((day) => {
                    const availableSlots = getAvailableSlotsCount(day.date);
                    const hasAvailableSlots = availableSlots > 0;

                    return (
                      <div
                        key={day.date}
                        className={`p-3 border rounded cursor-pointer text-center flex-fill ${
                          selectedDate === day.date
                            ? "bg-primary text-white"
                            : hasAvailableSlots
                            ? "bg-light hover:bg-light-primary"
                            : "bg-light-danger text-muted"
                        }`}
                        style={{
                          minWidth: "140px",
                          opacity: hasAvailableSlots ? 1 : 0.6,
                          cursor: hasAvailableSlots ? "pointer" : "not-allowed",
                        }}
                        onClick={() =>
                          hasAvailableSlots && setSelectedDate(day.date)
                        }
                      >
                        <div className="fw-bold">{day.display}</div>
                        <small className="d-block mt-1">
                          {availableSlots} slots available
                        </small>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection - 30-minute intervals */}
              {selectedDate && (
                <div className="col-12">
                  <Form.Label className="fw-bold">
                    <i className="bi bi-clock me-2"></i>
                    Select Time Slot (30 minutes){" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {timeSlots.map((slot) => {
                      const isBooked = isTimeSlotBooked(selectedDate, slot);
                      const isSelected = selectedTimeSlot?.start === slot.start;

                      return (
                        <Button
                          key={slot.start}
                          variant={
                            isSelected
                              ? "primary"
                              : isBooked
                              ? "outline-secondary"
                              : "outline-primary"
                          }
                          disabled={isBooked}
                          onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                          className="mb-2"
                          style={{
                            minWidth: "120px",
                            fontSize: "0.85rem",
                            opacity: isBooked ? 0.5 : 1,
                            position: "relative",
                          }}
                        >
                          {slot.display}
                          {isBooked && (
                            <div
                              style={{ fontSize: "0.7rem", marginTop: "2px" }}
                            >
                              <i className="bi bi-lock-fill"></i> Booked
                            </div>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Each slot is 30 minutes. Disabled slots are booked by you or{" "}
                    {user.fname}.
                  </small>
                </div>
              )}

              {/* Location Selection */}
              <div className="col-12">
                <Form.Group>
                  <Form.Label className="fw-bold">
                    <i className="bi bi-geo-alt me-2"></i>
                    Select Location <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    required
                  >
                    <option value="">Choose a location...</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Meeting Summary */}
              {topic &&
                selectedDate &&
                selectedTimeSlot &&
                selectedLocation && (
                  <div className="col-12">
                    <div className="bg-light-primary p-3 rounded">
                      <h6 className="text-primary mb-2">
                        <i className="bi bi-info-circle me-2"></i>
                        Meeting Summary
                      </h6>
                      <p className="mb-1">
                        <strong>Topic:</strong> {topic}
                      </p>
                      <p className="mb-1">
                        <strong>Date:</strong>{" "}
                        {
                          formatMeetingDateTime(
                            selectedDate,
                            selectedTimeSlot.start
                          ).split(",")[0]
                        }
                      </p>
                      <p className="mb-1">
                        <strong>Time:</strong> {selectedTimeSlot.display}
                      </p>
                      <p className="mb-0">
                        <strong>Location:</strong> {selectedLocation}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseMeetModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmMeet}
              disabled={
                !topic ||
                !selectedDate ||
                !selectedTimeSlot ||
                !selectedLocation ||
                createMeetingMutation.isLoading
              }
            >
              {createMeetingMutation.isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Sending Request...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Meeting Request
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Text Message Modal */}
        <Modal show={showTextModal} onHide={handleCloseTextModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Envoyer un message à {user.fname}</Modal.Title>
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
