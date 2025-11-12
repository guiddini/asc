import { useParams } from "react-router-dom";
import Hero from "./_components/hero";
import EventInfo from "./_components/event-info";
import Gallery from "./_components/gallery";
import Description from "./_components/description";
import { useQuery } from "react-query";
import { showSideEventBySlug } from "../../apis/side-event";
import { getPublicProgramSchedule } from "../../apis/slot";
import type { PublicSlot, PublicSlotType } from "../../types/slot";
import { format, parseISO } from "date-fns";
import { Spinner, Placeholder } from "react-bootstrap";
import { useState } from "react";
import { getThreeDayRange } from "../meetings/utils/scheduleUtils";
import "../program/ProgramPage.css";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../types/reducers";
import { useMutation, useQueryClient } from "react-query";
import {
  checkWorkshopAttendance,
  joinWorkshop,
  leaveWorkshop,
} from "../../apis/workshop";
import {
  checkConferenceAttendance,
  joinConference,
  leaveConference,
} from "../../apis/conference";
import { getAuth } from "../../modules/auth";
import toast from "react-hot-toast";

export interface Event {
  slug: string;
  title: string;
  description: string;
  date: string;
  gallery: string[];
  info: string;
  hero: string;
  location: string;
  website: string;
  email: string;
  cta?: string;
  organizers: string[];
  onClick: () => void;
  showIcon?: boolean;
  cta2?: string;
  onClick2?: () => void;
  logo?: string;
}

const EntityProfilePage = () => {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryFn: () => showSideEventBySlug(slug as string),
    enabled: !!slug,
    queryKey: ["showSideEventBySlug", slug],
  });

  // Program timeline state (same behavior as Program page)
  const threeDays = getThreeDayRange();
  const [activeDay, setActiveDay] = useState<string>(threeDays[0].date);
  const [activeType, setActiveType] = useState<PublicSlotType | undefined>(
    undefined
  );

  const eventTypes: { label: string; value: PublicSlotType | undefined }[] = [
    { label: "All Events", value: undefined },
    { label: "Conferences", value: "conference" },
    { label: "Workshops", value: "workshop" },
  ];

  const { data: events, isLoading: scheduleLoading } = useQuery({
    queryKey: ["profile-program", slug, activeType, activeDay],
    queryFn: () =>
      getPublicProgramSchedule(activeType, activeDay, undefined, slug),
    enabled: !!slug,
  });

  // Timeline event card copied to match Program page UI
  const TimelineEventCard: React.FC<{ event: PublicSlot }> = ({ event }) => {
    const formatTime = (timeString: string) => {
      return format(parseISO(timeString), "h:mm a");
    };

    const getEventColor = (type: string) => {
      switch (type) {
        case "conference":
          return "conference";
        case "workshop":
          return "workshop";
        default:
          return "general";
      }
    };

    const getEventLabel = (type: string) => {
      switch (type) {
        case "conference":
          return "Conference";
        case "workshop":
          return "Workshop";
        default:
          return "General Event";
      }
    };

    const { user } = useSelector((state: UserResponse) => state.user);
    const isAuthenticated = Boolean(user);
    const queryClient = useQueryClient();
    const token = getAuth();

    const { data: attendanceConference } = useQuery(
      ["event-attendance", event.id, "conference"],
      () => checkConferenceAttendance(String(event.id)),
      {
        enabled:
          isAuthenticated && event.type === "conference" && Boolean(token),
      }
    );

    const { data: attendanceWorkshop } = useQuery(
      ["event-attendance", event.id, "workshop"],
      () => checkWorkshopAttendance(String(event.id)),
      {
        enabled: isAuthenticated && event.type === "workshop",
      }
    );

    const joinConferenceMutation = useMutation(
      () => joinConference(String(event.id)),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "event-attendance",
            event.id,
            "conference",
          ]);
          toast.success("Joined conference");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to join conference"
          );
        },
      }
    );
    const leaveConferenceMutation = useMutation(
      () => leaveConference(String(event.id)),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "event-attendance",
            event.id,
            "conference",
          ]);
          toast.success("Left conference");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to leave conference"
          );
        },
      }
    );

    const joinWorkshopMutation = useMutation(
      () => joinWorkshop(String(event.id)),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "event-attendance",
            event.id,
            "workshop",
          ]);
          toast.success("Joined workshop");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to join workshop"
          );
        },
      }
    );
    const leaveWorkshopMutation = useMutation(
      () => leaveWorkshop(String(event.id)),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "event-attendance",
            event.id,
            "workshop",
          ]);
          toast.success("Left workshop");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to leave workshop"
          );
        },
      }
    );

    return (
      <div id={`event-card-${event.id}`} className="timeline-event-item">
        <div className="timeline-event-time">
          <div className="timeline-event-time-content">
            <span className="timeline-start-time">
              {formatTime(event.start_time)}
            </span>
            <span className="timeline-separator">-</span>
            <span className="timeline-end-time">
              {formatTime(event.end_time)}
            </span>
          </div>
        </div>

        <div className="timeline-event-marker">
          <div
            className={`timeline-dot timeline-dot-${getEventColor(event.type)}`}
          ></div>
          <div className="timeline-line"></div>
        </div>

        <div className="timeline-event-content">
          <div
            className={`timeline-event-card timeline-event-card-${getEventColor(
              event.type
            )}`}
          >
            <div className="timeline-event-header">
              <span
                className={`timeline-event-badge timeline-event-badge-${getEventColor(
                  event.type
                )}`}
              >
                {getEventLabel(event.type)}
              </span>
            </div>

            <h3 className="timeline-event-title">
              {event.title || "Untitled Event"}
            </h3>

            {event.location && (
              <div className="timeline-event-location">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{event.location}</span>
              </div>
            )}

            {event.speakers && event.speakers.length > 0 && (
              <div className="d-flex align-items-center mt-3">
                {event.speakers.slice(0, 8).map((speaker, index) => (
                  <img
                    key={speaker.id}
                    src={speaker?.avatar as any}
                    alt={speaker.name}
                    title={speaker.name}
                    className="rounded-circle border border-white"
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      marginLeft: index === 0 ? 0 : -10,
                      zIndex: 10 - index,
                    }}
                  />
                ))}
                {event.speakers.length > 8 && (
                  <div
                    className="d-flex justify-content-center align-items-center rounded-circle bg-secondary text-white border border-white"
                    style={{
                      width: 40,
                      height: 40,
                      marginLeft: -10,
                      fontSize: 14,
                      zIndex: 1,
                    }}
                  >
                    +{event.speakers.length - 8}
                  </div>
                )}
              </div>
            )}

            {/* Actions: Connect / Join / Leave */}
            {event.type !== "general_event" && (
              <div className="mt-3 d-flex">
                {!isAuthenticated ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => (window.location.href = "/auth/login")}
                  >
                    Connect to join
                  </button>
                ) : event.type === "conference" ? (
                  attendanceConference?.attending ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={leaveConferenceMutation.isLoading}
                      onClick={() => leaveConferenceMutation.mutate()}
                    >
                      {leaveConferenceMutation.isLoading
                        ? "Leaving..."
                        : "Leave"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={joinConferenceMutation.isLoading}
                      onClick={() => joinConferenceMutation.mutate()}
                    >
                      {joinConferenceMutation.isLoading ? "Joining..." : "Join"}
                    </button>
                  )
                ) : event.type === "workshop" ? (
                  attendanceWorkshop?.attending ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={leaveWorkshopMutation.isLoading}
                      onClick={() => leaveWorkshopMutation.mutate()}
                    >
                      {leaveWorkshopMutation.isLoading ? "Leaving..." : "Leave"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={joinWorkshopMutation.isLoading}
                      onClick={() => joinWorkshopMutation.mutate()}
                    >
                      {joinWorkshopMutation.isLoading ? "Joining..." : "Join"}
                    </button>
                  )
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Skeleton while profile data is loading
  const LoadingSkeleton = () => (
    <div className="w-100 h-100">
      <section
        className="hero"
        style={{ backgroundImage: "none", backgroundColor: "#f5f7f9" }}
      >
        <div className="container py-10">
          <div className="placeholder-glow">
            <Placeholder as="div" animation="glow">
              <Placeholder xs={2} />
            </Placeholder>
          </div>
        </div>
      </section>

      <div className="profile-container">
        <div id="page-content">
          <div className="mb-6">
            <Placeholder as="h2" animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} />
              <Placeholder xs={10} />
              <Placeholder xs={8} />
            </Placeholder>
          </div>

          <div className="gallery-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`gallery-item ${
                  i % 6 === 0 || i % 6 === 3 ? "large" : "small"
                }`}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#eef1f4",
                    borderRadius: 12,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sticky-container">
          <div className="event-card">
            <div className="logo" style={{ background: "#eef1f4" }} />
            <div className="mt-4">
              <Placeholder as="div" animation="glow">
                <Placeholder xs={5} />
              </Placeholder>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={7} />
              </Placeholder>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-100 h-100">
      <Hero event={data} />
      <div className="profile-container">
        <div id="page-content">
          <Description event={data} />
          {/* <Agenda /> */}
          <Gallery event={data} />
        </div>
        <div className="sticky-container">
          <EventInfo event={data} />
        </div>
      </div>

      {/* Program timeline (filtered by side_event_slug) */}
      <div id="program-page-container" className="mt-10">
        <div id="program-page-header">
          <h2 id="program-page-title">Program Schedule</h2>
          <p id="program-page-subtitle">
            Explore conferences, workshops and general events
          </p>
        </div>

        {/* Day Tabs */}
        <div id="program-day-tabs">
          {threeDays.map((day, index) => (
            <button
              key={day.date}
              id={`program-day-tab-${index}`}
              className={`program-day-tab ${
                activeDay === day.date ? "program-day-tab-active" : ""
              }`}
              onClick={() => setActiveDay(day.date)}
            >
              <span className="program-day-tab-label">Day {index + 1}</span>
              <span className="program-day-tab-date">
                {format(day.fullDate, "MMM d")}
              </span>
            </button>
          ))}
        </div>

        {/* Event Type Filter */}
        <div id="program-filter-tabs">
          {eventTypes.map((type) => (
            <button
              key={type.value || "all"}
              id={`program-filter-${type.value || "all"}`}
              className={`program-filter-btn ${
                activeType === type.value ? "program-filter-btn-active" : ""
              }`}
              onClick={() => setActiveType(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Timeline Events */}
        {scheduleLoading ? (
          <div id="program-loading">
            <Spinner animation="border" style={{ color: "#00c4c4" }} />
            <p>Loading events...</p>
          </div>
        ) : events && events.length > 0 ? (
          <div id="program-timeline">
            {events.map((event: PublicSlot) => (
              <TimelineEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div id="program-empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <h3>No events scheduled</h3>
            <p>There are no events scheduled for this day and category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { EntityProfilePage };
