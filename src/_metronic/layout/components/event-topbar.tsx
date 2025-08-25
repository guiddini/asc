import {
  ArrowLeftRight,
  Calendar,
  ChevronRight,
  Menu,
  Ticket,
} from "lucide-react";
import { Button, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { checkExhibitionDemandTransactionApi } from "../../../app/apis/exhibition";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../app/types/reducers";
import { TicketsPrivilege } from "../../../app/components";
import { useState } from "react";
import { HeaderUserMenu } from "../../partials";
import clsx from "clsx";
import getMediaUrl from "../../../app/helpers/getMediaUrl";

const EventTopbar = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();

  const { data: hasDemand, isLoading } = useQuery(
    "checkExhibitionDemand",
    async () => {
      const res = await checkExhibitionDemandTransactionApi();
      return res?.data || false;
    },
    {
      retry: 1,
      onError: (error) => {
        console.error("Error checking exhibition demand:", error);
      },
    }
  );

  const [showTicketPrivileges, setShowTicketPrivileges] = useState(false);

  return (
    <div id="event-top-bar">
      <div className="container-xxl">
        <div id="event-top-bar-content">
          <div id="event-top-bar-left">
            <div title="Show aside menu " className="d-lg-none">
              <div id="kt_aside_mobile_toggle">
                <div
                  style={{
                    border: "1px #59EFB2 solid",
                  }}
                  id="event-top-bar-switch"
                  role="button"
                >
                  <Menu stroke="#59EFB2" />
                </div>
              </div>
            </div>
            <div id="event-top-bar-event-infos">
              <img
                src="/media/eventili/afes/logo.jpg"
                alt="Event logo"
                className="d-none d-md-block"
              />
              <div id="event-top-bar-info">
                <h1>Algeria fintech & E-commerce summit</h1>

                <div
                  id="event-top-bar-info-calendar"
                  className="d-none d-md-flex"
                >
                  <Calendar />
                  30-31 Jan & 01 Fév
                </div>

                <div id="current-ticket-topbar">
                  <span id="current-ticket-topbar-ticket-label">
                    Ticket Utilisé :
                  </span>
                  <Ticket
                    id="current-ticket-topbar-ticket-icon"
                    width={10}
                    height={10}
                  />
                  <span
                    id="current-ticket-topbar-ticket-name"
                    role="button"
                    onClick={() => setShowTicketPrivileges(true)}
                  >
                    {user?.ticket?.name}
                    <ChevronRight id="current-ticket-topbar-ticket-arrow" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div id="event-top-bar-cta-container">
            <div
              id="event-top-bar-switch"
              role="button"
              onClick={() => {
                navigate("/events/manage");
              }}
            >
              <ArrowLeftRight />
            </div>

            <div id="exhibition-topbar-cta-container">
              {isLoading ? (
                <Spinner animation="border" />
              ) : (
                <>
                  {hasDemand ? (
                    <Button
                      onClick={() => {
                        navigate("/company/stand/reservations");
                      }}
                      variant="custom-purple-dark text-white"
                      id="exhibition-request-cta"
                    >
                      Mon entreprise
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate("/exhibition/request");
                      }}
                      variant="custom-purple-dark text-white"
                      id="exhibition-request-cta"
                    >
                      Devenir exposant
                    </Button>
                  )}
                </>
              )}
            </div>

            <div
              className={clsx("cursor-pointer symbol")}
              data-kt-menu-trigger="click"
              data-kt-menu-attach="parent"
              data-kt-menu-placement="bottom-end"
            >
              <img
                src={getMediaUrl(user.avatar)}
                alt="Profile"
                // id="event-management-nav-profile"
                id="event-management-nav-profile"
              />
            </div>
            <HeaderUserMenu />
          </div>
        </div>
      </div>

      <TicketsPrivilege
        ticket={user?.ticket?.slug}
        setIsOpen={() => setShowTicketPrivileges(false)}
        isOpen={showTicketPrivileges}
      />
    </div>
  );
};

export default EventTopbar;
