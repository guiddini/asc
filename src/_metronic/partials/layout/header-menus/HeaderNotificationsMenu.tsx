import { FC, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { NotificationsReducer } from "../../../../app/types/reducers";
import { useMutation } from "react-query";
import {
  getAllNotifications,
  markNotificationAsSeen,
} from "../../../../app/apis";
import {
  initNotification,
  loadMoreNotification,
  nextPage,
  prevPage,
} from "../../../../app/features/notificationsSlice";
import { Spinner } from "react-bootstrap";

const HeaderNotificationsMenu: FC = () => {
  const { notifications, currentPage } = useSelector(
    (state: NotificationsReducer) => state.notifications
  );

  const { mutate: getNotifications, isLoading: isPending } = useMutation({
    mutationFn: async ({ offset }: { offset: string | number }) =>
      await getAllNotifications({ offset: offset }),
  });

  const { mutate } = useMutation({
    mutationFn: async ({ notificiationIDS }: { notificiationIDS: string[] }) =>
      markNotificationAsSeen({
        notificiationIDS,
      }),
    mutationKey: ["mark-notification-as-seen"],
  });

  const dispatch = useDispatch();

  const handleShowMore = async () => {
    getNotifications(
      { offset: currentPage },
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
  };

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleShowMore();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [notifications?.length]);

  const handleMarkAsSeen = async (id: string) => {
    const ids = [id];
    mutate({
      notificiationIDS: ids,
    });
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
      data-kt-menu="true"
    >
      <div
        className="d-flex flex-column bgi-no-repeat rounded-top"
        style={{
          backgroundImage: `url('${toAbsoluteUrl(
            "/media/misc/pattern-1.jpg"
          )}')`,
        }}
      >
        <h3 className="text-white fw-bold px-9 mt-10 mb-6">
          Notifications{" "}
          <span className="fs-8 opacity-75 ps-3">{notifications?.length}</span>
        </h3>
      </div>

      <div id="kt_topbar_notifications_3" role="tabpanel">
        <div className="scroll-y mh-325px my-5 px-8 d-flex flex-column gap-5">
          {notifications?.map((notification) => (
            <div className="d-flex flex-stack py-4">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-35px me-4">
                  <span className="symbol-label bg-light-primary">
                    <KTIcon
                      iconName="like"
                      className="fs-2 cursor-pointer m-0 text-primary"
                    />
                  </span>
                </div>

                <div className="mb-0 me-2">
                  <Link
                    to={`/profile/${notification?.sender_id}`}
                    className="fs-6 text-gray-800 text-hover-primary fw-bold"
                  >
                    {notification?.fname} {notification?.lname}
                  </Link>
                  <div className="text-gray-500 fs-7">
                    a aimé votre publication
                  </div>
                </div>
              </div>

              <span
                className="badge badge-light fs-8 btn btn-sm btn-primary"
                onClick={() => handleMarkAsSeen(notification?.id)}
              >
                voir
              </span>
            </div>
          ))}
        </div>
        {isPending && (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" color="#000" size="sm" />
          </div>
        )}
        <div ref={observerTarget}></div>
        {/* <div className="py-3 text-center border-top">
          <Link
            to="/"
            className="btn btn-color-gray-600 btn-active-color-primary"
          >
            Voir tout <KTIcon iconName="arrow-right" className="fs-5" />
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export { HeaderNotificationsMenu };
