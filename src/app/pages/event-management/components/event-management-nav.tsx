import { Bell, X } from "lucide-react";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
} from "../../../../_metronic/partials";
import clsx from "clsx";

import { useSelector } from "react-redux";
import { NotificationsReducer, UserResponse } from "../../../types/reducers";

const EventManagementNav = () => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const { notifications, currentPage } = useSelector(
    (state: NotificationsReducer) => state.notifications
  );

  function hasUnseenNotification() {
    return notifications.some(
      (notification) => notification.seen === "Not seen"
    );
  }

  return (
    <nav id="event-management-nav">
      <Link to="/home" id="event-management-nav-close">
        <X size={24} />
      </Link>
      <img
        src="/media/eventili/logos/logo-bg.svg"
        alt="African Startup Conference"
        id="event-management-nav-logo"
      />
      <div id="event-management-nav-actions">
        <div className={clsx("d-flex align-items-center")}>
          {/* begin::Menu- wrapper */}
          <div
            className={clsx("position-relative")}
            data-kt-menu-trigger="click"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
          >
            <span className="event-management-nav-icon-button">
              <Bell size={20} />
              {hasUnseenNotification() && (
                <span className="bullet bullet-dot bg-primary h-6px w-6px position-absolute translate-middle top-25 start-25 animation-blink"></span>
              )}
            </span>
          </div>
          <HeaderNotificationsMenu />
        </div>

        <div
          className={clsx("cursor-pointer symbol")}
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <img
            src={getMediaUrl(user?.avatar)}
            alt="Profile"
            // id="event-management-nav-profile"
            id="event-management-nav-profile"
          />
        </div>
        <HeaderUserMenu />
      </div>
    </nav>
  );
};

export default EventManagementNav;
