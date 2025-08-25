import { Bell, X } from "lucide-react";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
} from "../../../../_metronic/partials";
import clsx from "clsx";
import { useMutation } from "react-query";
import { getAllNotifications } from "../../../apis";
import { useDispatch, useSelector } from "react-redux";
import { NotificationsReducer, UserResponse } from "../../../types/reducers";
import { useEffect } from "react";
import Pusher from "pusher-js";
import toast from "react-hot-toast";
import { Notification } from "../../../types/notification";
import {
  addNotification,
  loadMoreNotification,
  nextPage,
  prevPage,
} from "../../../features/notificationsSlice";

const EventManagementNav = () => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const { mutate: getNotifications, isLoading: isPending } = useMutation({
    mutationFn: async ({ offset }: { offset: string | number }) =>
      await getAllNotifications({ offset: offset }),
  });

  const { notifications, currentPage } = useSelector(
    (state: NotificationsReducer) => state.notifications
  );

  function hasUnseenNotification() {
    return notifications.some(
      (notification) => notification.seen === "Not seen"
    );
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const pusher = new Pusher(
      import.meta.env.VITE_APP_PUSHER_APP_KEY as string,
      {
        cluster: import.meta.env.VITE_APP_PUSHER_HOST as string,
      }
    );
    const channel = pusher.subscribe(`${user.id}-liked-post-channel`);
    const jobOfferChannel = pusher.subscribe(`${user.id}-applies-on-job-offer`);

    channel.bind("liked-post-channel", (data: Notification) => {
      toast.success(`${data?.fname} ${data?.lname} a aimé votre publication`);
      dispatch(addNotification(data));
    });

    jobOfferChannel.bind("applies-on-job-offer", (data: Notification) => {
      toast.success(`${data?.fname} ${data?.lname} a postulé à votre offre`);
      dispatch(addNotification(data));
    });

    if (currentPage === 0) {
      getNotifications(
        { offset: 0 },
        {
          onSuccess(data) {
            const newNotifications = data?.data;

            if (newNotifications.length > 0) {
              dispatch(loadMoreNotification(newNotifications)); // Dispatch with new notifications
              dispatch(nextPage());
            }
          },
          onError(error) {
            dispatch(prevPage());
          },
        }
      );
    }

    return () => {
      pusher.unsubscribe(`${user.id}-liked-post-channel`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            src={getMediaUrl(user.avatar)}
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
