import React, { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Badge,
  Alert,
  ListGroup,
  Nav,
  Button,
  Form,
} from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Meeting } from "../../types/meetings";
import {
  getUserMeetings,
  showOneMeeting,
  updateMeeting,
  deleteMeeting,
  respondToMeeting,
} from "../../apis/meetings";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { getThreeDayRange } from "./utils/scheduleUtils";

interface DayMeetings {
  date: string;
  dateDisplay: string;
  dayName: string;
  meetings: Meeting[];
  requests: Meeting[];
}

const MeetingsCalendar: React.FC = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const userId = user?.id;

  const threeDayRange = getThreeDayRange();

  // Display range like "1 to 3 January"
  const displayRange = useMemo(() => {
    const startDay = threeDayRange[0].fullDate.getDate();
    const endDay = threeDayRange[2].fullDate.getDate();
    const month = threeDayRange[0].fullDate.toLocaleDateString("en-US", {
      month: "long",
    });
    return `${startDay} to ${endDay} ${month}`;
  }, [threeDayRange]);

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeDay, setActiveDay] = useState<string>(threeDayRange[0].date);
  const [viewType, setViewType] = useState<"meetings" | "requests">("meetings");
  const [success, setSuccess] = useState<string>("");
  const [editForm, setEditForm] = useState({
    meeting_date: "",
    location: "",
  });

  const queryClient = useQueryClient();

  // React Query for fetching meetings
  const {
    data: meetings = [],
    isLoading,
    error,
  } = useQuery<Meeting[]>("meetings", getUserMeetings, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add debugging
  console.log("All meetings:", meetings);
  console.log("Current userId:", userId);

  // CORRECTED: Separate meetings and requests properly
  const { userMeetings, meetingRequests } = useMemo(() => {
    if (!userId) return { userMeetings: [], meetingRequests: [] };

    return {
      // My meetings: where I'm the requester (I created these meetings) OR receiver with accepted/declined status
      userMeetings: meetings.filter(
        (meeting) =>
          meeting.requester_id === userId ||
          (meeting.receiver_id === userId && meeting.status !== "pending")
      ),
      // Meeting requests: where I'm the receiver and status is pending
      meetingRequests: meetings.filter(
        (meeting) =>
          meeting.receiver_id === userId && meeting.status === "pending"
      ),
    };
  }, [meetings, userId]);

  console.log("User meetings:", userMeetings);
  console.log("Meeting requests:", meetingRequests);

  // Filter by the 3-day range
  const filteredData = useMemo(() => {
    const dateSet = new Set(threeDayRange.map((d) => d.date));

    const filterByDate = (meetingArray: Meeting[]) => {
      return meetingArray.filter((meeting) => {
        const meetingDate = new Date(meeting.meeting_date)
          .toISOString()
          .split("T")[0];
        return dateSet.has(meetingDate);
      });
    };

    return {
      meetings: filterByDate(userMeetings),
      requests: filterByDate(meetingRequests),
    };
  }, [userMeetings, meetingRequests, threeDayRange]);

  // FIXED: Group by date with correct property mapping
  const groupedData: DayMeetings[] = useMemo(() => {
    return threeDayRange.map((day) => ({
      date: day.date,
      dateDisplay: day.display, // Fixed: use 'display' property
      dayName: day.display.split(",")[0], // Extract day name from display
      meetings: filteredData.meetings.filter((meeting) => {
        const meetingDate = new Date(meeting.meeting_date)
          .toISOString()
          .split("T")[0];
        return meetingDate === day.date;
      }),
      requests: filteredData.requests.filter((meeting) => {
        const meetingDate = new Date(meeting.meeting_date)
          .toISOString()
          .split("T")[0];
        return meetingDate === day.date;
      }),
    }));
  }, [filteredData, threeDayRange]);

  // Get active day data
  const activeDayData = useMemo(() => {
    const dayData = groupedData.find((day) => day.date === activeDay);
    return {
      meetings: dayData?.meetings || [],
      requests: dayData?.requests || [],
      info: dayData,
    };
  }, [groupedData, activeDay]);

  // Current display data based on view type
  const currentDisplayData = useMemo(() => {
    return viewType === "meetings"
      ? activeDayData.meetings
      : activeDayData.requests;
  }, [activeDayData, viewType]);

  // Get total count for tabs
  const getTotalCounts = useMemo(() => {
    return {
      meetings: filteredData.meetings.length,
      requests: filteredData.requests.length,
    };
  }, [filteredData]);

  // Get count for each day based on current view
  const getDayCount = (dayData: DayMeetings) => {
    return viewType === "meetings"
      ? dayData.meetings.length
      : dayData.requests.length;
  };

  // Mutations
  const updateMeetingMutation = useMutation(updateMeeting, {
    onSuccess: () => {
      queryClient.invalidateQueries("meetings");
      setSuccess("Meeting updated successfully!");
      setShowEditModal(false);
    },
    onError: () => {
      setSuccess("Failed to update meeting");
    },
  });

  const deleteMeetingMutation = useMutation(deleteMeeting, {
    onSuccess: () => {
      queryClient.invalidateQueries("meetings");
      setSuccess("Meeting deleted successfully!");
      setShowDetailsModal(false);
    },
    onError: () => {
      setSuccess("Failed to delete meeting");
    },
  });

  const respondMeetingMutation = useMutation(respondToMeeting, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries("meetings");
      setSuccess(`Meeting ${variables.status} successfully!`);
      setShowDetailsModal(false);
    },
    onError: () => {
      setSuccess("Failed to respond to meeting");
    },
  });

  // Handle meeting click
  const handleMeetingClick = async (meeting: Meeting) => {
    try {
      const meetingDetails = await showOneMeeting(meeting.id);
      setSelectedMeeting(meetingDetails);
      setEditForm({
        meeting_date: new Date(meetingDetails.meeting_date)
          .toISOString()
          .slice(0, 16),
        location: meetingDetails.location,
      });
      setShowDetailsModal(true);
    } catch (err) {
      console.error("Failed to fetch meeting details:", err);
    }
  };

  // Handle edit meeting
  const handleEditMeeting = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  // Handle update submission
  const handleUpdateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;

    updateMeetingMutation.mutate({
      id: selectedMeeting.id,
      ...editForm,
    });
  };

  // Handle meeting response
  const handleMeetingResponse = (status: "accepted" | "declined") => {
    if (!selectedMeeting) return;
    respondMeetingMutation.mutate({ id: selectedMeeting.id, status });
  };

  // Handle delete meeting
  const handleDeleteMeeting = () => {
    if (!selectedMeeting) return;
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      deleteMeetingMutation.mutate(selectedMeeting.id);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "declined":
        return "danger";
      default:
        return "warning";
    }
  };

  // Check if user is the requester (can edit) vs receiver (can respond)
  const isUserRequester = (meeting: Meeting) => {
    return meeting.requester_id === userId;
  };

  const isUserReceiver = (meeting: Meeting) => {
    return meeting.receiver_id === userId;
  };

  // Add safety check for userId
  if (!userId) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Alert variant="warning">Please log in to view your meetings.</Alert>
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center w-100">
        <Col lg={12}>
          <Card>
            <Card.Header className="text-center">
              <Card.Title className="mb-3">
                <i className="bi bi-calendar-event me-2"></i>
                Meetings Schedule - {displayRange}
              </Card.Title>

              {/* Main Tabs - Meetings vs Requests */}
              <Nav variant="pills" className="justify-content-center">
                <Nav.Item className="d-flex align-items-center justify-content-center">
                  <Nav.Link
                    active={viewType === "meetings"}
                    onClick={() => setViewType("meetings")}
                    className="px-4"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    My Meetings
                    {getTotalCounts.meetings > 0 && (
                      <Badge bg="secondary" className="ms-2">
                        {getTotalCounts.meetings}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="d-flex align-items-center justify-content-center">
                  <Nav.Link
                    active={viewType === "requests"}
                    onClick={() => setViewType("requests")}
                    className="px-4"
                  >
                    <i className="bi bi-inbox me-2"></i>
                    Meeting Requests
                    {getTotalCounts.requests > 0 && (
                      <Badge bg="warning" className="ms-2">
                        {getTotalCounts.requests}
                      </Badge>
                    )}
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body>
              {error && (
                <Alert variant="danger">
                  Failed to load meetings. Please try again.
                </Alert>
              )}

              {success && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccess("")}
                >
                  {success}
                </Alert>
              )}

              {/* Debug Info - Remove this in production */}
              <Alert variant="info" className="mb-3">
                <small>
                  Debug: Total meetings: {meetings.length}, My meetings:{" "}
                  {userMeetings.length}, Requests: {meetingRequests.length}
                </small>
              </Alert>

              {/* Day Filter Tabs */}
              <Nav variant="pills" className="justify-content-center mb-4">
                {groupedData.map((dayData) => (
                  <Nav.Item key={dayData.date}>
                    <Nav.Link
                      active={activeDay === dayData.date}
                      onClick={() => setActiveDay(dayData.date)}
                      className="px-4"
                    >
                      <div className="text-center">
                        <div className="fw-bold">{dayData.dayName}</div>
                        <small className="text-black">
                          {dayData.dateDisplay.split(",")[1]?.trim()}{" "}
                          {/* Show just the date part */}
                        </small>
                        {getDayCount(dayData) > 0 && (
                          <Badge
                            bg="primary"
                            className="ms-2"
                            style={{ fontSize: "0.7em" }}
                          >
                            {getDayCount(dayData)}
                          </Badge>
                        )}
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              {/* Active Day Content */}
              <div className="meeting-list">
                {activeDayData.info && (
                  <div className="text-center mb-3">
                    <h5 className="text-primary">
                      {activeDayData.info.dateDisplay}
                    </h5>
                    <small className="text-muted">
                      {viewType === "meetings"
                        ? "Your meetings"
                        : "Pending meeting requests for you"}
                    </small>
                  </div>
                )}

                {currentDisplayData.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i
                      className={`bi ${
                        viewType === "meetings" ? "bi-calendar-x" : "bi-inbox"
                      } display-4 mb-3`}
                    ></i>
                    <h6>
                      {viewType === "meetings"
                        ? "No meetings scheduled for this day"
                        : "No meeting requests for this day"}
                    </h6>
                    <p className="mb-0">Your schedule is clear!</p>
                  </div>
                ) : (
                  <ListGroup>
                    {currentDisplayData.map((meeting) => (
                      <ListGroup.Item
                        key={meeting.id}
                        action
                        onClick={() => handleMeetingClick(meeting)}
                        className="d-flex justify-content-between align-items-center py-3"
                      >
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <i
                              className={`bi ${
                                viewType === "requests"
                                  ? "bi-inbox"
                                  : "bi-clock"
                              } text-primary fs-4`}
                            ></i>
                          </div>
                          <div>
                            <div className="d-flex align-items-center mb-1">
                              <h6 className="mb-0 me-2">
                                <i className="bi bi-geo-alt me-2"></i>
                                {meeting.location}
                              </h6>
                              {meeting.status && (
                                <Badge
                                  bg={getStatusBadgeVariant(meeting.status)}
                                >
                                  {meeting.status.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <small className="text-muted">
                              {formatTime(meeting.meeting_date)}
                              {viewType === "requests" && (
                                <span className="ms-2">
                                  • Request from user {meeting.requester_id}
                                </span>
                              )}
                            </small>
                          </div>
                        </div>
                        <div>
                          <i className="bi bi-chevron-right text-muted"></i>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Meeting Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>
            <i className="bi bi-info-circle me-2 text-primary"></i>
            Meeting Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedMeeting && (
            <div className="text-center">
              <div className="mb-4">
                <i className="bi bi-calendar-event display-4 text-primary mb-3"></i>
                <h5 className="mb-3">{selectedMeeting.location}</h5>
                <Badge
                  bg={getStatusBadgeVariant(selectedMeeting.status)}
                  className="fs-6"
                >
                  {selectedMeeting.status.toUpperCase()}
                </Badge>
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="bi bi-calendar-check text-primary fs-3 mb-2"></i>
                      <h6 className="mb-1">Date & Time</h6>
                      <small className="text-muted">
                        {formatDateTime(selectedMeeting.meeting_date)}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      <i className="bi bi-geo-alt text-primary fs-3 mb-2"></i>
                      <h6 className="mb-1">Location</h6>
                      <small className="text-muted">
                        {selectedMeeting.location}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <div className="d-flex gap-2 flex-wrap">
            {/* Show Accept/Decline for meeting requests (where user is receiver) */}
            {selectedMeeting &&
              isUserReceiver(selectedMeeting) &&
              selectedMeeting.status === "pending" && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleMeetingResponse("accepted")}
                    disabled={respondMeetingMutation.isLoading}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleMeetingResponse("declined")}
                    disabled={respondMeetingMutation.isLoading}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Decline
                  </Button>
                </>
              )}

            {/* Show Edit for meetings user created (where user is requester) */}
            {selectedMeeting && isUserRequester(selectedMeeting) && (
              <Button variant="primary" size="sm" onClick={handleEditMeeting}>
                <i className="bi bi-pencil me-1"></i>
                Edit
              </Button>
            )}

            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDeleteMeeting}
              disabled={deleteMeetingMutation.isLoading}
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Edit Meeting Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil me-2 text-primary"></i>
            Edit Meeting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateMeeting}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-calendar me-1"></i>
                    Meeting Date & Time
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={editForm.meeting_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, meeting_date: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-geo-alt me-1"></i>
                    Location
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter meeting location"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateMeeting}
            disabled={updateMeetingMutation.isLoading}
          >
            {updateMeetingMutation.isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Update Meeting
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MeetingsCalendar;
