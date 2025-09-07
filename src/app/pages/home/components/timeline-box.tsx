import { useSelector } from "react-redux";
import moment from "moment";
import { UserResponse } from "../../../types/reducers";

const TimelineBox = () => {
  const { user } = useSelector((state: UserResponse) => state.user);

  return (
    <div className="card card-flush">
      <div className="card-header pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">Mon parcours</span>
          <span className="text-gray-500 pt-2 fw-semibold fs-6">
            Dernières activités
          </span>
        </h3>

        {/* <div className="card-toolbar">
          <button
            className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-overflow="true"
          >
            <i className="ki-outline ki-dots-square fs-1 text-gray-500 me-n1"></i>
          </button>

          <div
            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px"
            data-kt-menu="true"
          >
            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3">
                Voir tous les participants
              </a>
            </div>

            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3">
                Afes Programme
              </a>
            </div>

            <div
              className="menu-item px-3"
              data-kt-menu-trigger="hover"
              data-kt-menu-placement="right-start"
            >
              <a href="#" className="menu-link px-3">
                <span className="menu-title">New Group</span>
                <span className="menu-arrow"></span>
              </a>

              <div className="menu-sub menu-sub-dropdown w-175px py-4">
                <div className="menu-item px-3">
                  <a href="#" className="menu-link px-3">
                    Admin Group
                  </a>
                </div>

                <div className="menu-item px-3">
                  <a href="#" className="menu-link px-3">
                    Staff Group
                  </a>
                </div>

                <div className="menu-item px-3">
                  <a href="#" className="menu-link px-3">
                    Member Group
                  </a>
                </div>
              </div>
            </div>

            <div className="menu-item px-3">
              <a href="#" className="menu-link px-3">
                New Contact
              </a>
            </div>

            <div className="separator mt-3 opacity-75"></div>

            <div className="menu-item px-3">
              <div className="menu-content px-3 py-3">
                <a className="btn btn-primary btn-sm px-4" href="#">
                  Generate Reports
                </a>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <div className="card-body pt-6">
        <div className="timeline-label">
          <div className="timeline-item">
            <div className="timeline-label fw-bold text-gray-800 fs-6 ">
              {moment(user?.created_at).format("HH:mm")}
            </div>

            <div className="timeline-badge">
              <i className="ki-outline ki-abstract-8 text-gray-600 fs-3"></i>
            </div>

            <div className="fw-bold text-gray-700 ps-3 fs-6">A rejoint ACS</div>
          </div>

          {/* <div className="timeline-item d-flex align-items-center">
            <div className="timeline-label fw-bold text-gray-800 fs-6">
              10:00
            </div>

            <div className="timeline-badge">
              <i className="ki-outline ki-abstract-8 text-gray-600 fs-3"></i>
            </div>

            <div className="d-flex align-items-center">
              <span className="fw-bold text-gray-800 px-3">
                AEOL meeting with
              </span>

              <div className="symbol symbol-35px me-3">
                <img src="/media/avatars/300-1.jpg" alt="" />
              </div>

              <div className="symbol symbol-35px">
                <img src="public/media/avatars/300-2.jpg" alt="" />
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-label fw-bold text-gray-800 fs-6">
              14:37
            </div>

            <div className="timeline-badge">
              <i className="ki-outline ki-abstract-8 text-gray-600 fs-3"></i>
            </div>

            <div className="timeline-content fw-bold text-gray-800 ps-3">
              Make deposit
              <a href="#" className="text-primary">
                USD 700
              </a>
              . to ESL
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-label fw-bold text-gray-800 fs-6">
              16:50
            </div>

            <div className="timeline-badge">
              <i className="ki-outline ki-abstract-8 text-gray-600 fs-3"></i>
            </div>

            <div className="fw-semibold text-gray-700 ps-3 fs-7">
              Outlines keep you honest. Indulging in poorly driving and keep
              structure keep you honest great
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-label fw-bold text-gray-800 fs-6">
              21:03
            </div>

            <div className="timeline-badge">
              <i className="ki-outline ki-abstract-8 text-gray-600 fs-3"></i>
            </div>

            <div className="timeline-content fw-semibold text-gray-800 ps-3">
              New order placed
              <a href="#" className="text-primary">
                #XF-2356
              </a>
              .
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-label fw-bold text-gray-800 fs-6">
              16:50
            </div>

            <div className="timeline-badge">
              <i className="ki-outline ki-abstract-8 text-gray-600 fs-3"></i>
            </div>

            <div className="fw-semibold text-gray-700 ps-3 fs-7">
              Outlines keep you honest. Indulging in poorly driving and keep
              structure
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-label fw-bold text-gray-800 fs-6">
              14:37
            </div>

            <div className="timeline-badge">
              <i className="ki-outline ki-abstract-8 text-gray-600 fs-3"></i>
            </div>

            <div className="timeline-content fw-bold text-gray-800 ps-3">
              Make deposit
              <a href="#" className="text-primary">
                USD 700
              </a>
              . to ESL
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TimelineBox;
