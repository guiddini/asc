import { FC, useEffect } from "react";
import clsx from "clsx";
import { HeaderNotificationsMenu, HeaderUserMenu } from "../../../partials";
import getMediaUrl from "../../../../app/helpers/getMediaUrl";
import { useAuth } from "../../../../app/modules/auth";
import { HeaderFavoritesMenu } from "../../../partials/layout/header-menus/HeaderFavoritesMenu";
import { useLocation } from "react-router-dom";
import HeaderActivitiesMenu from "../../../partials/layout/header-menus/HeaderActivitiesMenu";
import toast from "react-hot-toast";
import { Notification } from "../../../../app/types/notification";
import {
  addNotification,
  loadMoreNotification,
  nextPage,
  prevPage,
} from "../../../../app/features/notificationsSlice";
import { useDispatch, useSelector } from "react-redux";
import Pusher from "pusher-js";
import {
  NotificationsReducer,
  UserResponse,
} from "../../../../app/types/reducers";
import { getAllNotifications } from "../../../../app/apis";
import { useMutation } from "react-query";

const itemClass = "ms-1 ms-lg-3",
  btnClass =
    "btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px",
  userAvatarClass = "symbol-30px symbol-md-40px";

const favbtnClass =
  "btn btn-icon btn-active-color-danger btn-active-light-danger w-30px h-30px w-md-40px h-md-40px";

const Topbar: FC = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const { pathname } = useLocation();

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
    const channel = pusher.subscribe(`${user?.id}-liked-post-channel`);
    const jobOfferChannel = pusher.subscribe(
      `${user?.id}-applies-on-job-offer`
    );

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
      pusher.unsubscribe(`${user?.id}-liked-post-channel`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex align-items-stretch flex-shrink-0">
      {/* NOTIFICATIONS */}
      <div className={clsx("d-flex align-items-center", itemClass)}>
        {/* begin::Menu- wrapper */}
        <div
          className={clsx(btnClass, "position-relative")}
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <i className="bi bi-bell fs-2" />
          {hasUnseenNotification() && (
            <span className="bullet bullet-dot bg-primary h-6px w-6px position-absolute translate-middle top-25 start-25 animation-blink"></span>
          )}
        </div>
        <HeaderNotificationsMenu />
        {/* end::Menu wrapper */}
      </div>

      {/* Favorits */}
      <div className={clsx("d-flex align-items-center", itemClass)}>
        {/* begin::Menu- wrapper */}
        <div
          className={clsx(favbtnClass, "position-relative")}
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <i className="bi bi-heart fs-2" />
        </div>
        <HeaderFavoritesMenu />
        {/* end::Menu wrapper */}
      </div>

      {/* begin::Theme mode */}
      {/* <div className={clsx("d-flex align-items-center", itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={btnClass} />
      </div> */}
      {/* end::Theme mode */}

      {/* begin::User */}
      <div
        className={clsx("d-flex align-items-center", itemClass)}
        id="kt_header_user_menu_toggle"
      >
        {/* begin::Toggle */}
        <div
          className={clsx("cursor-pointer symbol", userAvatarClass)}
          data-kt-menu-trigger="click"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <img src={getMediaUrl(user?.avatar)} alt="metronic" />
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>

      {pathname === "/home" && (
        <div className={clsx("d-flex align-items-center", itemClass)}>
          {/* begin::Menu- wrapper */}
          <div className="d-flex d-lg-none align-items-center justify-content-end">
            <div className="d-flex align-items-center gap-2">
              <div
                className="btn btn-icon btn-active-color-primary w-30px h-30px"
                id="kt_social_start_sidebar_toggle"
              >
                <i className="fa-solid fa-bars fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* end::User */}

      {/* begin::Aside Toggler */}
      {/* {config.header.left === "menu" && (
        <div
          className="d-flex align-items-center d-lg-none ms-2"
          title="Show header menu"
        >
          <div
            className="btn btn-icon btn-active-color-primary w-30px h-30px w-md-40px h-md-40px"
            id="kt_header_menu_mobile_toggle"
          >
            <KTIcon iconName="text-align-left" className="fs-1" />
          </div>
        </div>
      )} */}
    </div>
  );
};

export { Topbar };
