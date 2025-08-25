import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { ProductCardProps } from "../..";

const ProductCard = (props: ProductCardProps) => {
  return (
    <Col
      xs={12}
      sm={12}
      md={5}
      lg={5}
      xl={5}
      xxl={4}
      className="mb-4 mw-lg-400px"
    >
      <div className="card card-flush h-md-100 border ">
        <div className="card-body py-3">
          <div className="row gx-9 ">
            <Row
              xs={12}
              md={12}
              className="d-flex flex-column overflow-hidden h-300px mb-3 px-0 mx-auto"
              // style={{
              //   height: "22rem !important",
              // }}
            >
              {/* featured image view */}
              <div className="card w-100 px-0">
                <div className="card-body w-100 overflow-hidden p-3">
                  <img
                    src={getMediaUrl(props?.featured_image)}
                    className="w-100 rounded-2 object-fit-fill"
                  />
                </div>
              </div>
            </Row>
            <Row xs={12} md={12} xl={12} className="mx-auto">
              <div className="d-flex flex-column w-100">
                <div className="mb-7">
                  <div className="d-flex flex-stack mb-6 justify-content-between w-100">
                    <div className="flex-shrink-0 me-5">
                      <span className="text-gray-800 fs-2 fw-bold text-truncate max-w-sm">
                        {props?.name?.length > 20
                          ? `${props.name?.slice(0, 20)} ....`
                          : props?.name}
                      </span>
                      <span className="text-gray-500 fs-7 fw-bold me-2 d-block lh-1 pb-1">
                        {props?.category?.name_fr}
                      </span>
                    </div>
                    <span className="badge badge-custom-purple-light text-white flex-shrink-0 align-self-center py-3 px-4 fs-7">
                      {props.type === "Service" ? "Service" : "Produit"}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-center justify-content-between flex-wrap d-grid gap-2">
                    <div className="d-flex align-items-center me-5 me-xl-13">
                      <div className="symbol symbol-50px symbol-circle me-3 border">
                        <img
                          src={getMediaUrl(props?.company?.logo)}
                          className=""
                          alt={props?.company?.name}
                        />
                      </div>
                      <div className="m-0">
                        <span className="fw-semibold text-gray-500 d-block fs-4">
                          Par
                        </span>
                        <Link
                          to={`/company/${props?.company?.id}`}
                          className="fw-bold text-gray-800 text-hover-primary fs-4"
                        >
                          {props?.company?.name}
                        </Link>
                      </div>
                    </div>

                    <Link
                      to={`/products/${props?.id}`}
                      className="btn btn-sm btn-custom-purple-dark text-white w-md-auto h-md-auto d-flex align-items-center justify-content-center text-nowrap ms-auto"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
