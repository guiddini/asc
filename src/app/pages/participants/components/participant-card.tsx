import { Col } from "react-bootstrap";
import { ParticipantProps } from "../../../types/user";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

const ParticipantCard = (props: ParticipantProps) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <div className="card mb-3">
        <div className="card-body d-flex flex-center flex-column py-9 px-5 position-relative">
          <div className="symbol symbol-65px symbol-circle mb-5">
            <img src={getMediaUrl(props.avatar)} className="object-fit-cover" />
          </div>

          <span className="fs-4 text-gray-800 fw-bold mb-0 text-center">
            {props?.fname} {props?.lname}
          </span>

          <div className="fw-semibold text-gray-500 mb-6">
            {props?.roles[0]?.display_name}
          </div>

          <div className="d-flex flex-center flex-wrap gap-5 mt-4">
            <Link
              to={`/profile/${props.id}`}
              className="btn btn-sm btn-custom-purple-dark text-white btn-flex btn-center"
              data-kt-follow-btn="true"
            >
              <i className="fa-regular text-white fa-eye"></i>

              <span className="indicator-label">View</span>
            </Link>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ParticipantCard;
