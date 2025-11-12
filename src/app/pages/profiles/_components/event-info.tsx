import {
  MapPin,
  LinkIcon,
  Mail,
  CalendarDays,
  LogOut,
  LogIn,
} from "lucide-react";
import { SideEvent } from "../../../types/side-event";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { format, parseISO } from "date-fns";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserResponse } from "../../../types/reducers";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  checkIfUserJoinedSideEvent,
  joinSideEvent,
  leaveSideEvent,
} from "../../../apis/side-event";
import toast from "react-hot-toast";

export default function EventCard({ event }: { event: SideEvent }) {
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();
  const isAuthenticated = user !== null;
  const queryClient = useQueryClient();

  const {
    data: joinStatus,
    isLoading: isJoinStatusLoading,
    refetch: refetchJoinStatus,
  } = useQuery(
    ["side-event-joined", event?.id],
    () => checkIfUserJoinedSideEvent(String(event?.id)),
    {
      enabled: isAuthenticated && Boolean(event?.id),
    }
  );

  const joinMutation = useMutation(() => joinSideEvent(String(event?.id)), {
    onSuccess: () => {
      queryClient.invalidateQueries(["side-event-joined", event?.id]);
      refetchJoinStatus();
      toast.success(`Joined ${event?.name || "side event"}`);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || `Failed to join ${event?.name || "side event"}`
      );
    },
  });

  const leaveMutation = useMutation(() => leaveSideEvent(String(event?.id)), {
    onSuccess: () => {
      queryClient.invalidateQueries(["side-event-joined", event?.id]);
      refetchJoinStatus();
      toast.success(`Left ${event?.name || "side event"}`);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || `Failed to leave ${event?.name || "side event"}`
      );
    },
  });
  const getFormattedDate = (date?: string) => {
    if (!date) return "TBA";
    try {
      const parsed = parseISO(date);
      return format(parsed, "PPP"); // e.g., Dec 7, 2025
    } catch (e) {
      const fallback = new Date(date as any);
      if (!isNaN(fallback.getTime())) {
        return format(fallback, "PPP");
      }
      return date;
    }
  };
  return (
    <div className="event-card">
      <div className="event-card-header">
        <img
          src={getMediaUrl(event?.logo)}
          alt={event?.name}
          className="event-card-logo"
        />
        <div className="event-card-name-container">
          <h1 className="event-card-name">{event?.name}</h1>
        </div>
      </div>

      <div className="date-container">
        <div className="date-icon">
          <CalendarDays />
        </div>
        <div>
          <h2 className="event-title">Event Date</h2>
          <p className="event-date">{getFormattedDate(event?.date)}</p>
        </div>
      </div>

      <p className="description">{event?.description}</p>

      <div className="info-item">
        <MapPin className="info-icon" size={20} />
        <span>{event?.location}</span>
      </div>

      <div className="info-item">
        <Mail className="info-icon" size={20} />
        <a href={`mailto:${event?.email}`}>{event?.email}</a>
      </div>

      <div className="info-item">
        <LinkIcon className="info-icon" size={20} />
        {event?.website ? (
          <a href={event.website} target="_blank" rel="noopener noreferrer">
            {event.website}
          </a>
        ) : (
          <span>Website not available</span>
        )}
      </div>
      {/* CTA: Join / Leave Side Event */}
      {!isAuthenticated ? (
        <div className="mt-3">
          <div
            className="alert alert-info d-flex align-items-center"
            role="alert"
          >
            <LogIn size={18} className="me-2" />
            <span>
              Please sign in to join {event?.name}. You’ll be able to register
              and receive updates.
            </span>
          </div>
          <Button
            onClick={() => navigate("/auth/login")}
            variant="primary"
            className="w-100 d-flex align-items-center justify-content-center"
          >
            <LogIn size={18} className="me-2" />
            Login or create an account to join {event?.name}
          </Button>
        </div>
      ) : (
        <div className="mt-3 d-grid">
          {joinStatus?.joined ? (
            <Button
              className="w-100 d-flex align-items-center justify-content-center"
              variant="secondary"
              onClick={() => leaveMutation.mutate()}
              disabled={leaveMutation.isLoading}
            >
              <LogOut size={18} className="me-2" />
              {leaveMutation.isLoading ? "Leaving..." : `Leave`}
            </Button>
          ) : (
            <Button
              className="w-100"
              variant="primary"
              onClick={() => joinMutation.mutate()}
              disabled={joinMutation.isLoading || isJoinStatusLoading}
            >
              {joinMutation.isLoading ? "Joining..." : `Join `}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
