import { Col } from "react-bootstrap";
import { ServiceProductCardType } from "../../..";
import getMediaUrl from "../../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

const CompanyDetailProductserviceCard = (props: ServiceProductCardType) => {
  return (
    <Col xs={12} sm={6} md={3} lg={3} xl={3} className="mb-4">
      <Link to={`/products/${props.id}`} className="card border">
        <div className="card-header border-0 pt-4 px-0 mx-auto">
          <div className="card-title m-0">
            <div className="symbol symbol-150px w-150px bg-light">
              <img src={getMediaUrl(props?.featured_image)} alt="image" />
            </div>
          </div>
        </div>

        <div className="card-body p-9">
          <div className="fs-3 fw-bold text-gray-900 text-center">
            {props?.name}
          </div>
        </div>
      </Link>
    </Col>
  );
};

export default CompanyDetailProductserviceCard;
