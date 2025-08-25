import { Link, useParams } from "react-router-dom";
import eventSlugs from "./event-slugs";
import { Error404 } from "../../modules/errors/components/Error404";
import { ErrorsLayout } from "../../modules/errors/ErrorsLayout";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import { Col, Container, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import DevTalentModal from "./modals/dev-talent-modal";
import FintechStrategyModal from "./modals/fintech-strategy-modal";
import EcommerceChallenge from "./modals/ecommerce-challenge";
import getMediaUrl from "../../helpers/getMediaUrl";

export interface BarcodeData {
  user_id: string;
  category: string;
  barcode_path: string;
  updated_at: string;
  created_at: string;
  id: number;
  supportResourcesNeeded?: string[];
}

const EventPage = () => {
  const { slug } = useParams();
  const is_correct_slug = eventSlugs?.some((e) => e.slug === slug);

  if (!is_correct_slug)
    return (
      <ErrorsLayout>
        <Error404 />
      </ErrorsLayout>
    );

  const event = eventSlugs?.find((e) => e.slug === slug);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<BarcodeData | null>(null);

  const displayContent = () => {
    switch (event.slug) {
      case "dev&talents-day":
        return <DevTalentModal />;

      case "fintech-strategy":
        return <FintechStrategyModal />;

      case "E-commerce-challenge":
        return <EcommerceChallenge />;

      default:
        break;
    }
  };

  const displayPartenaires = () => {
    switch (event.slug) {
      case "Guichet-unique":
        return (
          <>
            <Col xs={6} sm={4} md={3}>
              <Link
                to="/company/9b4f5c4b-61ab-4f40-9123-eda471b54716"
                className="symbol symbol-100px rounded-3 cursor-pointer"
              >
                <img
                  src="https://api.algeriafintech.com/storage/companies/9b4f5c4b-61ab-4f40-9123-eda471b54716/logo_65c8b1cba1e96.png"
                  alt="image"
                  className="rounded-3"
                />
              </Link>
            </Col>

            <Col xs={6} sm={4} md={3}>
              <Link
                to="/company/9b4f57fd-5d24-4a82-897e-f766afa5a5ac"
                className="symbol symbol-100px rounded-3 cursor-pointer"
              >
                <img
                  src="http://api.algeriafintech.com/storage/companies/9b4f57fd-5d24-4a82-897e-f766afa5a5ac/logo_65c8aef96eadb.jpeg"
                  alt="image"
                  className="rounded-3"
                />
              </Link>
            </Col>

            <Col xs={6} sm={4} md={3}>
              <Link
                to="/company/9b4500d7-47bd-4e5a-8b37-e5032c60750a"
                className="symbol symbol-100px rounded-3 cursor-pointer"
              >
                <img
                  src="http://api.algeriafintech.com/storage/companies/9b4500d7-47bd-4e5a-8b37-e5032c60750a/logo_65c1e823936af.png"
                  alt="image"
                  className="rounded-3"
                />
              </Link>
            </Col>

            <Col xs={6} sm={4} md={3}>
              <Link
                to="/company/9b4714da-e8c1-4fbf-ba18-2073e37a59e7"
                className="symbol symbol-100px rounded-3 cursor-pointer"
              >
                <img
                  src="http://api.algeriafintech.com/storage/companies/9b4714da-e8c1-4fbf-ba18-2073e37a59e7/logo_65c344ccbe1b8.png"
                  alt="image"
                  className="rounded-3"
                />
              </Link>
            </Col>
          </>
        );

      case "dev&talents-day":
        return <></>;

      case "fintech-strategy":
        return <></>;

      default:
        break;
    }
  };

  return (
    <Container fluid>
      {barcode?.barcode_path && (
        <Row
          xs={12}
          md={12}
          className="notice d-flex bg-light-primary rounded border-primary border border-dashed w-100 flex-shrink-0 p-6 mb-4"
        >
          <Col
            xs={12}
            md={6}
            className="px-0 mh-150px d-flex flex-row justify-content-center align-items-center"
          >
            <KTIcon
              iconName="disconnect"
              className="fs-2tx text-primary me-4"
            />
            <div className="mb-3 mb-md-0 fw-bold">
              <h4 className="text-gray-800 fw-bolder">
                Participation au guichet unique confirmée ! !
              </h4>
              <div className="fs-6 text-gray-600 pe-7">
                Votre inscritption au guichet unique a été validée, Rendez vous
                le 5 Mars 2024 à l'Eshra
              </div>
            </div>
          </Col>
          <Col xs={12} md={6} className="px-0 mh-100px">
            <img
              src={`${getMediaUrl(barcode?.barcode_path)}`}
              className="w-100 h-100 "
            />
          </Col>
        </Row>
      )}
      <Row xs={12} md={12} className="">
        <Col xs={12} md={12} lg={6} xl={5} className="mh-md-500px">
          <div className="card mb-4">
            <Row xs={12} md={12} className="card-body">
              <h3>Les partenaires :</h3>

              <Col xs={6} sm={4} md={3}>
                <Link
                  to="/company/9b42126a-4a6e-4a72-ab05-ce408bab8277"
                  className="symbol symbol-100px rounded-3 cursor-pointer"
                >
                  <img
                    src="http://api.algeriafintech.com/storage/companies/9b42126a-4a6e-4a72-ab05-ce408bab8277/logo_65bffc5707aa9.png"
                    alt="image"
                    className="rounded-3"
                  />
                </Link>
              </Col>
              <Col xs={6} sm={4} md={3}>
                <Link
                  to="/company/9b57474d-ea4c-4967-ae4a-8a9e4321ee04"
                  className="symbol symbol-100px rounded-3 cursor-pointer"
                >
                  <img
                    src="http://api.algeriafintech.com/storage/companies/9b57474d-ea4c-4967-ae4a-8a9e4321ee04/logo_65cde2377890a.png"
                    alt="image"
                    className="rounded-3"
                  />
                </Link>
              </Col>
              {displayPartenaires()}
            </Row>
          </div>

          <div className="card">
            <Row className="card-body">
              <div className="w-100 d-flex align-items-center">
                {/*  */}

                <h4 className="text-gray-700 fs-5">{event?.description}</h4>
                {/*  */}
              </div>

              <Col
                xs={12}
                // md={4}
                lg={3}
                className="d-flex  flex-row align-items-center justify-content-between gap-4 mt-4 w-100"
              >
                <div>
                  <h4>200 participants</h4>
                  <div className="symbol-group symbol-hover flex-nowrap">
                    <Link
                      to={`/profile/9b434300-aabe-4ca7-bca0-d9667328a59d`}
                      className="symbol symbol-35px symbol-circle"
                      data-bs-toggle="tooltip"
                      aria-label="Michael Eberon"
                      data-bs-original-title="Michael Eberon"
                      data-kt-initialized="1"
                    >
                      <img
                        alt="Pic"
                        src="http://api.algeriafintech.com/storage/users/9b434300-aabe-4ca7-bca0-d9667328a59d/pp_65c15cab7b384.jpeg"
                      />
                    </Link>
                    <Link
                      to={`/profile/9b433ac1-4b75-4dc5-a303-2528bbae04fa`}
                      className="symbol symbol-35px symbol-circle"
                      data-bs-toggle="tooltip"
                      aria-label="Michael Eberon"
                      data-bs-original-title="Michael Eberon"
                      data-kt-initialized="1"
                    >
                      <img
                        alt="Pic"
                        src="http://api.algeriafintech.com/storage/users/9b433ac1-4b75-4dc5-a303-2528bbae04fa/pp_65c0c1ea60404.png"
                      />
                    </Link>
                    <Link
                      to={`/profile/9b420f35-6e2e-41be-a47c-f0516dfbeb1f`}
                      className="symbol symbol-35px symbol-circle"
                      data-bs-toggle="tooltip"
                      aria-label="Michael Eberon"
                      data-bs-original-title="Michael Eberon"
                      data-kt-initialized="1"
                    >
                      <img
                        alt="Pic"
                        src="http://api.algeriafintech.com/storage/users/9b420f35-6e2e-41be-a47c-f0516dfbeb1f/pp_65bffc05025ba.jpg"
                      />
                    </Link>

                    <span
                      className="symbol symbol-35px symbol-circle"
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_view_users"
                    >
                      <span className="symbol-label bg-dark text-gray-300 fs-8 fw-bold">
                        +177
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  className="btn mb-3 order-last text-light"
                  style={{
                    backgroundColor: "#00c4c4",
                  }}
                  disabled={
                    event.slug === "Guichet-unique" && barcode !== null
                      ? true
                      : false
                  }
                  onClick={() => {
                    if (event.slug === "Guichet-unique" && barcode === null) {
                      setShowModal(true);
                    }
                  }}
                >
                  Participer
                </button>
              </Col>
            </Row>
          </div>
        </Col>
        <Col
          xs={12}
          md={12}
          lg={6}
          xl={7}
          className="card ps-4 py-3 d-flex order-first"
        >
          <h1 className="p-3">{event?.title}</h1>
          <div className="card-body w-100 mh-md-500px overflow-hidden p-3">
            <img
              src={toAbsoluteUrl(`/media/afes/events/${slug}.jpg`)}
              className="w-100 h-100 rounded-2"
            />
          </div>
        </Col>
      </Row>
      <Modal
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modal-dialog modal-dialog-centered mw-md-900px "
      >
        <Modal.Header closeButton>
          <Modal.Title>{event?.title}</Modal.Title>
        </Modal.Header>
        {displayContent()}
      </Modal>
    </Container>
  );
};

export default EventPage;
