import getMediaUrl from "../../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

const TeamCard = ({ logo, name, role, id }) => {
  return (
    <div className="text-center mb-9">
      <div
        className="octagon mx-auto mb-2 d-flex w-150px h-150px"
        style={{
          backgroundImage: `url(${getMediaUrl(logo)})`,
          backgroundSize: "cover", // or "contain", depending on your needs
          width: "150px",
          height: "150px",
        }}
      ></div>

      <div className="mb-0">
        <Link
          to={`/profile/${id}`}
          className="text-gray-900 fw-bold text-hover-primary fs-3"
        >
          {name}
        </Link>

        <div className="text-muted fs-6 fw-semibold">{role}</div>
      </div>
    </div>
  );
};

export default TeamCard;
