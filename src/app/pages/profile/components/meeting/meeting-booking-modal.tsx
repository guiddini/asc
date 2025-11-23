import React, { useState } from "react";
import { Modal, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { User } from "../../../../types/user";
import { UserResponse } from "../../../../types/reducers";
import {
  TimeSlot,
  formatMeetingDateTime,
  getThreeDayRange,
  isSlotAvailable,
  timeSlots,
} from "../../../meetings/utils/scheduleUtils";
import { getBookedUserSlot } from "../../../../apis/slot";
import { createMeeting } from "../../../../apis/meetings";
import { Slot } from "../../../../types/slot";

interface MeetingBookingModalProps {
  targetUser: User;
  isOpen: boolean;
  onClose: () => void;
}

const MeetingBookingModal: React.FC<MeetingBookingModalProps> = ({
  targetUser,
  isOpen,
  onClose,
}) => {
  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );
  const queryClient = useQueryClient();

  // Modal state
  const [topic, setTopic] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const threeDayRange = getThreeDayRange();

  // Fetch booked slots for the target user
  const { data: receiverBookedSlots = [] } = useQuery<Slot[]>(
    ["bookedSlots", targetUser.id],
    () => getBookedUserSlot(targetUser.id),
    {
      enabled: !!targetUser.id && isOpen,
    }
  );

  // Fetch booked slots for current user
  const { data: currentUserBookedSlots = [] } = useQuery<Slot[]>(
    ["bookedSlots", currentUser?.id],
    () => getBookedUserSlot(currentUser?.id || ""),
    {
      enabled: !!currentUser?.id && isOpen,
    }
  );

  // Combine both users' booked slots
  const allBookedSlots = [...receiverBookedSlots, ...currentUserBookedSlots];

  const createMeetingMutation = useMutation(createMeeting, {
    onSuccess: () => {
      queryClient.invalidateQueries("meetings");
      queryClient.invalidateQueries(["bookedSlots", targetUser.id]);
      queryClient.invalidateQueries(["bookedSlots", currentUser?.id]);
      toast.success(`Meeting request sent to ${targetUser.fname}!`);
      handleCloseModal();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create meeting request";
      toast.error(errorMessage);
    },
  });

  const handleCloseModal = () => {
    onClose();
    setTopic("");
    setSelectedDate("");
    setSelectedTimeSlot(null);
    setSelectedLocation("");
  };

  const handleConfirmMeeting = () => {
    if (!topic || !selectedDate || !selectedTimeSlot || !selectedLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDateTime = `${selectedDate} ${selectedTimeSlot.start}:00`;
    const endDateTime = `${selectedDate} ${selectedTimeSlot.end}:00`;

    if (!isSlotAvailable(startDateTime, endDateTime, allBookedSlots)) {
      toast.error(
        "This time slot is not available for one or both participants. Please select another time."
      );
      return;
    }

    const meetingData = {
      receiver_id: targetUser.id,
      topic: topic,
      start_time: `${selectedDate}T${selectedTimeSlot.start}:00`,
      end_time: `${selectedDate}T${selectedTimeSlot.end}:00`,
      location: selectedLocation,
    };

    createMeetingMutation.mutate(meetingData);
  };

  // Helper function to check if a time slot is booked
  const isTimeSlotBooked = (date: string, slot: TimeSlot): boolean => {
    if (!date || !allBookedSlots.length) return false;
    const slotStartTime = `${date} ${slot.start}:00`;
    const slotEndTime = `${date} ${slot.end}:00`;
    return !isSlotAvailable(slotStartTime, slotEndTime, allBookedSlots);
  };

  // Helper function to get available slots count
  const getAvailableSlotsCount = (date: string): number => {
    return timeSlots.filter((slot) => !isTimeSlotBooked(date, slot)).length;
  };

  return (
    <Modal show={isOpen} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-calendar-plus me-2"></i>
          Request Meeting with {targetUser.fname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-4">
          {/* Topic Field */}
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
                      minWidth: 140,
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

          {/* Time Slot Selection */}
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
                    <OverlayTrigger
                      key={slot.start}
                      placement="top"
                      overlay={
                        isBooked ? (
                          <Tooltip id={`tooltip-${slot.start}`}>
                            This slot is already booked
                          </Tooltip>
                        ) : (
                          <></>
                        )
                      }
                    >
                      <Button
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
                          minWidth: 120,
                          fontSize: "0.85rem",
                          opacity: isBooked ? 0.5 : 1,
                          position: "relative",
                        }}
                      >
                        {slot.display}
                        {isBooked && (
                          <div
                            style={{
                              fontSize: "0.7rem",
                              marginTop: "2px",
                              color: "red",
                            }}
                          >
                            <i className="bi bi-lock-fill"></i> Booked
                          </div>
                        )}
                      </Button>
                    </OverlayTrigger>
                  );
                })}
              </div>
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Each slot is 30 minutes. Disabled slots are booked by you or{" "}
                {targetUser.fname}.
              </small>
            </div>
          )}

          {/* Location Selection */}
          <div className="col-12">
            <Form.Group>
              <Form.Label className="fw-bold">
                <i className="bi bi-geo-alt me-2"></i>
                Location <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location (e.g., VIP Lounge, Main Hall B)"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                required
              />
            </Form.Group>
          </div>

          {/* Meeting Summary */}
          {topic && selectedDate && selectedTimeSlot && selectedLocation && (
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
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirmMeeting}
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
  );
};

export { MeetingBookingModal };
