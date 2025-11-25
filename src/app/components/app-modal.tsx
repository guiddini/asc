import React from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";

interface AppModalProps {
  show: boolean;
  onHide: () => void;
  title?: string;
  primaryText?: string;
  secondaryText?: string;
  androidDownloadUrl?: string;
  shareText?: string;
}

const AppModal: React.FC<AppModalProps> = ({
  show,
  onHide,
  title = "Download the ASC Mobile App",
  primaryText = "Get the full African Startup Conference experience on your mobile device",
  androidDownloadUrl = "https://play.google.com/store/apps/details?id=com.africanstartupconference.app&pli=1",
  shareText = "Check out the African Startup Conference mobile app!",
}) => {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS =
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "African Startup Conference App",
          text: shareText,
          url: androidDownloadUrl,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(androidDownloadUrl)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={true}
      centered
      dialogClassName="modal-dialog modal-dialog-centered mw-700px"
      aria-labelledby="app-download-modal"
      className="app-download-modal"
      animation={true}
    >
      <div className="modal-content border-0 shadow-lg overflow-hidden">
        {/* Close Button */}
        <div
          className="position-absolute top-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <Button
            variant="link"
            onClick={onHide}
            className="btn-sm btn-icon btn-active-color-primary p-2 text-white"
            aria-label="Close modal"
          >
            <i className="ki-duotone ki-cross fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </Button>
        </div>

        {/* 16:9 Illustration Container */}
        <img
          src="/media/app-cover.png"
          className="d-flex align-items-center justify-content-center position-relative overflow-hidden"
          style={{
            aspectRatio: "16/9",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "200px",
          }}
        />

        {/* Main Content */}
        <div className="modal-body p-0">
          <Container fluid className="px-4 px-md-5 py-5">
            <Row className="justify-content-center">
              <Col lg={11} xl={10}>
                {/* Primary and Secondary Text */}
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-3 text-dark fs-2">{title}</h3>
                  <p className="fs-5 text-muted mb-0 lh-lg">{primaryText}</p>
                </div>

                {/* CTA Buttons */}
                <Row className="g-3 justify-content-center mb-4">
                  {isAndroid && (
                    <Col xs={12} sm={6}>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.africanstartupconference.app&pli=1"
                        className="btn btn-link p-0"
                        target="_blank"
                      >
                        <img
                          src="/media/play-store.svg"
                          alt="Download on Google Play"
                          className="me-3"
                        />
                      </a>
                    </Col>
                  )}

                  {isIOS && (
                    <Col xs={12} sm={6} className="text-center">
                      <a
                        href="https://apps.apple.com/us/app/asc-event-official/id6754880557"
                        target="_blank"
                      >
                        <img
                          src="/media/app-store.svg"
                          alt="Download on the App Store"
                          className="me-3"
                        />
                      </a>
                    </Col>
                  )}

                  {!isAndroid && !isIOS && (
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 gap-md-3">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.africanstartupconference.app&pli=1"
                        className="btn btn-link p-0"
                        target="_blank"
                      >
                        <img
                          src="/media/play-store.svg"
                          alt="Play Store"
                          style={{ width: "150px", opacity: "80%" }}
                        />
                      </a>

                      <a
                        href="https://apps.apple.com/us/app/asc-event-official/id6754880557"
                        target="_blank"
                        className="btn btn-link p-0"
                      >
                        <img
                          src="/media/app-store.svg"
                          alt="App Store"
                          style={{ width: "150px", opacity: "80%" }}
                        />
                      </a>
                    </div>
                  )}
                </Row>

                {/* Features Preview */}
                <div className="mt-5 pt-4 border-top">
                  <Row className="g-4 text-center">
                    <Col xs={4}>
                      <div className="d-flex flex-column align-items-center">
                        <i className="ki-duotone ki-notification-bing fs-2x text-primary mb-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                        <span className="small text-muted fw-medium">
                          Live Updates
                        </span>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="d-flex flex-column align-items-center">
                        <i className="ki-duotone ki-profile-circle fs-2x text-primary mb-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                        <span className="small text-muted fw-medium">
                          Networking
                        </span>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="d-flex flex-column align-items-center">
                        <i className="ki-duotone ki-calendar fs-2x text-primary mb-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        <span className="small text-muted fw-medium">
                          Schedule
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Modal>
  );
};

export default AppModal;
