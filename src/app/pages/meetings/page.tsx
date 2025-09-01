import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, Nav, Alert } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Meeting, MeetingDetail } from "../../types/meetings";
import {
  getUserMeetings,
  updateMeeting,
  deleteMeeting,
  respondToMeeting,
} from "../../apis/meetings";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { getThreeDayRange, locations } from "./utils/scheduleUtils";
import DayTabs from "./components/day-tabs";
import MeetingList from "./components/meeting-list";
import MeetingDetailsModal from "./components/meeting-details-modal";
import EditMeetingModal from "./components/edit-meeting-modal";

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

  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetail | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeDay, setActiveDay] = useState<string>(threeDayRange[0].date);
  const [viewType, setViewType] = useState<"meetings" | "requests">("meetings");
  const [success, setSuccess] = useState<string>("");

  const queryClient = useQueryClient();

  const {
    data: meetings = [],
    isLoading,
    error,
  } = useQuery<Meeting[]>("meetings", getUserMeetings, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const { userMeetings, meetingRequests } = useMemo(() => {
    if (!userId) return { userMeetings: [], meetingRequests: [] };

    return {
      userMeetings: meetings.filter(
        (meeting) =>
          meeting.requester_id === userId ||
          (meeting.receiver_id === userId && meeting.status !== "pending")
      ),
      meetingRequests: meetings.filter(
        (meeting) =>
          meeting.receiver_id === userId && meeting.status === "pending"
      ),
    };
  }, [meetings, userId]);

  const filteredData = useMemo(() => {
    const dateSet = new Set(threeDayRange.map((d) => d.date));

    const filterByDate = (arr: Meeting[]) =>
      arr.filter((meeting) =>
        dateSet.has(new Date(meeting.start_time).toISOString().split("T")[0])
      );

    return {
      meetings: filterByDate(userMeetings),
      requests: filterByDate(meetingRequests),
    };
  }, [userMeetings, meetingRequests, threeDayRange]);

  const groupedData = useMemo(() => {
    return threeDayRange.map((day) => ({
      date: day.date,
      dateDisplay: day.display,
      dayName: day.display.split(",")[0],
      meetings: filteredData.meetings.filter(
        (meeting) =>
          new Date(meeting.start_time).toISOString().split("T")[0] === day.date
      ),
      requests: filteredData.requests.filter(
        (meeting) =>
          new Date(meeting.start_time).toISOString().split("T")[0] === day.date
      ),
    }));
  }, [filteredData, threeDayRange]);

  const activeDayData = useMemo(() => {
    const dayData = groupedData.find((day) => day.date === activeDay);
    return {
      meetings: dayData?.meetings || [],
      requests: dayData?.requests || [],
      info: dayData,
    };
  }, [groupedData, activeDay]);

  const currentDisplayData = useMemo(
    () =>
      viewType === "meetings" ? activeDayData.meetings : activeDayData.requests,
    [activeDayData, viewType]
  );

  const getTotalCounts = useMemo(
    () => ({
      meetings: filteredData.meetings.length,
      requests: filteredData.requests.length,
    }),
    [filteredData]
  );

  const getDayCount = (dayData: (typeof groupedData)[0]) =>
    viewType === "meetings" ? dayData.meetings.length : dayData.requests.length;

  // Mutations
  const updateMeetingMutation = useMutation(updateMeeting, {
    onSuccess: () => {
      queryClient.invalidateQueries("meetings");
      setSuccess("Meeting updated successfully!");
      setShowEditModal(false);
    },
    onError: () => setSuccess("Failed to update meeting"),
  });

  const deleteMeetingMutation = useMutation(deleteMeeting, {
    onSuccess: () => {
      queryClient.invalidateQueries("meetings");
      setSuccess("Meeting deleted successfully!");
      setShowDetailsModal(false);
    },
    onError: () => setSuccess("Failed to delete meeting"),
  });

  const respondMeetingMutation = useMutation(respondToMeeting, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries("meetings");
      setSuccess(`Meeting ${variables.status} successfully!`);
      setShowDetailsModal(false);
    },
    onError: () => setSuccess("Failed to respond to meeting"),
  });

  const isUserRequester = (meeting: Meeting) => meeting.requester_id === userId;
  const isUserReceiver = (meeting: Meeting) => meeting.receiver_id === userId;

  const handleMeetingClick = (meeting: MeetingDetail) => {
    setSelectedMeeting(meeting);
    setShowDetailsModal(true);
  };

  const handleEditMeeting = () => {
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleUpdateMeeting = (formData) => {
    if (!selectedMeeting) return;

    updateMeetingMutation.mutate({
      id: selectedMeeting.id,
      ...formData,
    });
  };

  const handleMeetingResponse = (status: "accepted" | "declined") => {
    if (!selectedMeeting) return;
    respondMeetingMutation.mutate({ id: selectedMeeting.id, status });
  };

  const handleDeleteMeeting = () => {
    if (!selectedMeeting) return;
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      deleteMeetingMutation.mutate(selectedMeeting.id);
    }
  };

  if (!userId)
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">Please log in to view your meetings.</Alert>
      </Container>
    );

  if (isLoading)
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center w-100">
        <Col lg={12}>
          <Card>
            <Card.Header className="text-center">
              <Card.Title className="mb-3">
                <i className="bi bi-calendar-event me-2" />
                Meetings Schedule - {displayRange}
              </Card.Title>
            </Card.Header>
            <Nav variant="pills" className="justify-content-center mt-4">
              <DayTabs
                viewType={viewType}
                setViewType={setViewType}
                getTotalCounts={getTotalCounts}
                groupedData={groupedData}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                getDayCount={getDayCount}
              />
            </Nav>
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
              <MeetingList
                currentDisplayData={currentDisplayData}
                viewType={viewType}
                onMeetingClick={handleMeetingClick}
                isUserRequester={isUserRequester}
                isUserReceiver={isUserReceiver}
                formatTimeRange={(s, e) => {
                  const start = new Date(s).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const end = new Date(e).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return `${start} - ${end}`;
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedMeeting && (
        <>
          <MeetingDetailsModal
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            meeting={selectedMeeting}
            isUserReceiver={isUserReceiver}
            isUserRequester={isUserRequester}
            onAccept={() => handleMeetingResponse("accepted")}
            onDecline={() => handleMeetingResponse("declined")}
            onEdit={handleEditMeeting}
            onDelete={handleDeleteMeeting}
            loadingRespond={respondMeetingMutation.isLoading}
            deleting={deleteMeetingMutation.isLoading}
          />
          <EditMeetingModal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            meeting={selectedMeeting}
            onSubmit={handleUpdateMeeting}
            loading={updateMeetingMutation.isLoading}
            locations={locations}
          />
        </>
      )}
    </Container>
  );
};

export default MeetingsCalendar;
