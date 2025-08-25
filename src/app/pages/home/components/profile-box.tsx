import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

const ProfileBox = ({ postLength }: { postLength: number }) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  return (
    <div className="card mb-5 mb-xl-8">
      <div className="card-body pt-15 px-0">
        <div className="d-flex flex-column text-center mb-9 px-9">
          <div className="symbol symbol-80px symbol-lg-150px mb-4 overflow-hidden rounded-3">
            <img
              src={getMediaUrl(user?.avatar)}
              className="object-fit-cover"
              alt=""
            />
          </div>

          <div className="text-center">
            <Link
              to={`/profile/${user?.id}`}
              className="text-gray-800 fw-bold text-hover-primary fs-4"
            >
              {user?.fname} {user?.lname}
            </Link>

            <span className="text-muted d-block fw-semibold">
              {user?.roleValues?.display_name}
            </span>
          </div>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          <div className="text-center">
            <div className="text-gray-800 fw-bold fs-3">
              <span
                className="m-0"
                data-kt-countup="true"
                data-kt-countup-value="642"
              >
                {postLength || 0}
              </span>
            </div>
            <span className="text-gray-500 fs-8 d-block fw-bold">
              Publications
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
