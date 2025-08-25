import clsx from "clsx";
import { FC } from "react";
import { Link } from "react-router-dom";
import { defaultLogs, KTIcon, toAbsoluteUrl } from "../../../helpers";
import eventSlugs from "../../../../app/pages/event/event-slugs";

const HeaderActivitiesMenu = () => {
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
        <h3 className="text-white fw-bold px-9 mt-10 mb-6">Activities</h3>
      </div>

      <div>
        <div className="scroll-y mh-325px my-5 px-8 d-flex flex-column align-items- gap-4">
          {eventSlugs.map((event, index) => (
            // <Link to={`/event/${event?.slug}`} key={`alert${index}`}>
            //   <span className="fs-6 text-black text-hover-primary fw-bolder">
            //     {event?.frenchName}
            //   </span>

            //   {/* <span className="badge badge-light fs-8">20</span> */}
            // </Link>

            <Link
              to={`/event/${event?.slug}`}
              className="d-flex flex-stack py-4"
            >
              <div className="d-flex align-items-center">
                <div className="symbol symbol-35px me-4">
                  <span className="symbol-label bg-light-primary">
                    <i className="ki-duotone ki-abstract-28 fs-2 text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                </div>

                <div className="mb-0 me-2">
                  <span className="fs-5 text-gray-800 text-hover-primary fw-bold">
                    {event?.frenchName}
                  </span>
                  <div className="text-gray-500 fs-6">{event?.arabicName}</div>
                </div>
              </div>

              {/* <span className="badge badge-light fs-8">1 hr</span> */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderActivitiesMenu;
