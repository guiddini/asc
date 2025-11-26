import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import getMediaUrl from "../../helpers/getMediaUrl";
import axiosInstance from "../../apis/axios";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
import { KTIcon } from "../../../_metronic/helpers";
import type { BarcodeData } from "../event/event-page";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../types/reducers";
import QRCode from "react-qr-code";
import UpdateUserIdentificationsModal from "../../components/update-user-identifications";

export const BadgePage = () => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const [loadingBadge, setLoadingBadge] = useState<boolean>(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [barcode, setBarcode] = useState<BarcodeData | null>(null);
  const [showUpdateIdentification, setShowUpdateIdentification] =
    useState(false);

  // KYC gating
  const hasIdentification = user?.info?.has_identification;
  const kycStatus = user?.info?.kyc_status as
    | "accepted"
    | "pending"
    | "refused"
    | undefined;
  const isBlocked = kycStatus !== "accepted";

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const fetchPdf = async () => {
    if (isBlocked) return;
    setLoadingBadge(true);
    try {
      const response = await axiosInstance.get(`/ticket/badge`, {
        responseType: "blob",
      });
      const blob = response.data;
      if (blob instanceof Blob) {
        const file = window.URL.createObjectURL(blob);
        setPdfSource(file);
        setLoadingBadge(false);
      } else {
        setLoadingBadge(false);
      }
    } catch (error) {
      setLoadingBadge(false);
    }
  };

  useEffect(() => {
    if (user?.id && !isBlocked) {
      fetchPdf();
    } else {
      setPdfSource(null);
    }
  }, [user?.id, isBlocked]);

  const handleDownloadPdf = async () => {
    if (isBlocked) return;
    try {
      const response = await axiosInstance.get(`/ticket/badge`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "badge.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {}
  };

  const handlePrintPdf = () => {
    if (isBlocked || !pdfSource) return;
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfSource;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  };

  return (
    <>
      <PageTitle>Mon badge</PageTitle>

      {isBlocked && (
        <div
          className={`notice d-flex align-items-center justify-content-between rounded border border-dashed p-4 mb-6 ${
            kycStatus === "refused"
              ? "bg-light-danger border-danger"
              : "bg-light-warning border-warning"
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className="d-flex align-items-center">
            <div className="symbol symbol-35px me-4">
              <span
                className={`symbol-label ${
                  kycStatus === "refused"
                    ? "bg-light-danger"
                    : "bg-light-warning"
                }`}
              >
                <KTIcon
                  iconName="notification"
                  className={`fs-2 ${
                    kycStatus === "refused" ? "text-danger" : "text-warning"
                  }`}
                />
              </span>
            </div>
            <div className="d-flex flex-column">
              <span className="text-gray-900 fw-bold">
                {kycStatus === "refused"
                  ? "KYC Refused — Access Denied"
                  : hasIdentification
                  ? "KYC Pending — Access Restricted"
                  : "Identification Required — No Access"}
              </span>
              <span className="text-muted fs-7">
                {kycStatus === "refused"
                  ? "Your identification documents were refused. You must re‑upload valid documents. Until your KYC is accepted, you cannot enter the event venue, generate or print your badge, or access restricted features."
                  : hasIdentification
                  ? "Your documents are under review. Until KYC is accepted: no entry to the event venue, no badge generation/printing, and certain features remain locked."
                  : "You have not uploaded your passport or national ID. To attend the event, you must submit your identification for KYC. Without an accepted KYC, you cannot enter the venue or generate/print your badge."}
              </span>
            </div>
          </div>
          <div className="ms-5">
            {(kycStatus === "refused" ||
              (kycStatus === "pending" && !hasIdentification) ||
              (!kycStatus && !hasIdentification)) && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowUpdateIdentification(true)}
              >
                {kycStatus === "refused" ? "Upload Again" : "Upload Now"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Disabled look for page content */}
      <div
        className="position-relative"
        style={{
          opacity: isBlocked ? 0.6 : 1,
          pointerEvents: isBlocked ? "none" : "auto",
          filter: isBlocked ? "grayscale(0.2)" : "none",
        }}
      >
        {/* Single row, three equal columns */}
        <Row
          xs={12}
          md={12}
          lg={12}
          style={{ minHeight: "75vh" }}
          className="gap-3 gap-md-0"
        >
          {/* Left column: badge or blocked card */}
          <Col xs={12} md={4} lg={4}>
            {isBlocked ? (
              <div className="card h-100 d-flex align-items-center justify-content-center text-center p-10">
                <h3 className="mb-2">Badge unavailable</h3>
                <p className="text-muted">
                  Badge generation is disabled until your KYC is accepted. No
                  badge means no entry to the event venue.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowUpdateIdentification(true)}
                >
                  {kycStatus === "refused"
                    ? "Upload Again"
                    : "Upload Documents"}
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center gap-2 p-10 card h-100">
                <img
                  src={getMediaUrl(user?.avatar) || "/placeholder.svg"}
                  alt={`Photo de profile de ${user?.fname} ${user?.lname}`}
                  className="w-150px h-150px rounded-circle object-fit-contain"
                />
                <h1 className="mt-3 text-center">
                  {user?.fname} {user?.lname}
                </h1>
                <h3>{user?.roleValues?.display_name}</h3>
                <>
                  <QRCode id="qrcode" value={user?.id} size={128} level="H" />
                </>
              </div>
            )}
          </Col>

          {/* Middle column: coming soon */}
          <Col xs={12} md={4} lg={4}>
            <div className="card w-100 h-100 d-flex align-items-center justify-content-center">
              <img
                src="/side-events/commingsoon.jpeg"
                alt="Coming Soon"
                className="w-100 h-100 object-fit-cover rounded"
              />
            </div>
          </Col>

          {/* Right column: share my participation */}
          <Col xs={12} md={4} lg={4}>
            <div className="card w-100 h-100">
              <div className="card-body d-flex flex-column align-items-center justify-content-center p-6">
                <h1>Share my participation</h1>
                <div className="w-100 d-flex flex-column align-items-start justify-content-center gap-4 align-self-start">
                  <LinkedinShareButton
                    url={`https://africanstartupconference.org/`}
                    title="I'm attending the African Startup Conference — the leading pan-African gathering dedicated to innovation, entrepreneurship, and future technologies. 🌍✨ Since its inception, it has united ecosystems, governments, investors, and the African diaspora around a shared vision: building a technologically sovereign and inclusive Africa. 
                    
                    Edition after edition, the Conference has become a key platform for dialogue and collaboration, shaping strategic initiatives such as the Algiers Declaration on Startup Development, the African Charter for Talent Retention, and the continental Public Policy Framework on Artificial Intelligence — all highlighting its transformative impact on Africa’s innovation landscape. 
                    
                    In 2025, the Conference returns for its 4th edition under the theme 'Raising African Champions' 🚀 — celebrating high-growth African startups driving progress across the continent and beyond. Join us at https://africanstartupconference.org/ to be part of this movement. 💡#ASC2025 #AfricanStartups #Innovation #TechInAfrica #Entrepreneurship #PanAfrican #Guiddini"
                  >
                    <LinkedinIcon size={32} round />
                    <span className="text-muted ms-2">LinkedIn</span>
                  </LinkedinShareButton>
                  <FacebookShareButton
                    url={`https://africanstartupconference.org/`}
                    title="I'm attending the African Startup Conference — the leading pan-African gathering dedicated to innovation, entrepreneurship, and future technologies. 🌍✨ Since its inception, it has united ecosystems, governments, investors, and the African diaspora around a shared vision: building a technologically sovereign and inclusive Africa. 
                    
                    Edition after edition, the Conference has become a key platform for dialogue and collaboration, shaping strategic initiatives such as the Algiers Declaration on Startup Development, the African Charter for Talent Retention, and the continental Public Policy Framework on Artificial Intelligence — all highlighting its transformative impact on Africa’s innovation landscape. 
                    
                    In 2025, the Conference returns for its 4th edition under the theme 'Raising African Champions' 🚀 — celebrating high-growth African startups driving progress across the continent and beyond. Join us at https://africanstartupconference.org/ to be part of this movement. 💡#ASC2025 #AfricanStartups #Innovation #TechInAfrica #Entrepreneurship #PanAfrican #Guiddini"
                  >
                    <FacebookIcon size={32} round />
                    <span className="text-muted ms-2">Facebook</span>
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={`https://africanstartupconference.org/`}
                    title="I'm attending the African Startup Conference — the leading pan-African gathering dedicated to innovation, entrepreneurship, and future technologies. 🌍✨ Since its inception, it has united ecosystems, governments, investors, and the African diaspora around a shared vision: building a technologically sovereign and inclusive Africa. 
                    
                    Edition after edition, the Conference has become a key platform for dialogue and collaboration, shaping strategic initiatives such as the Algiers Declaration on Startup Development, the African Charter for Talent Retention, and the continental Public Policy Framework on Artificial Intelligence — all highlighting its transformative impact on Africa’s innovation landscape. 
                    
                    In 2025, the Conference returns for its 4th edition under the theme 'Raising African Champions' 🚀 — celebrating high-growth African startups driving progress across the continent and beyond. Join us at https://africanstartupconference.org/ to be part of this movement. 💡#ASC2025 #AfricanStartups #Innovation #TechInAfrica #Entrepreneurship #PanAfrican #Guiddini"
                  >
                    <TwitterIcon size={32} round />
                    <span className="text-muted ms-2">Twitter</span>
                  </TwitterShareButton>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {!isBlocked && (
        <div className="d-flex gap-3 mt-4">
          <Button
            variant="primary"
            disabled={loadingBadge || !pdfSource}
            onClick={handleDownloadPdf}
          >
            Download Badge
          </Button>
          <Button
            variant="secondary"
            disabled={loadingBadge || !pdfSource}
            onClick={handlePrintPdf}
          >
            Print Badge
          </Button>
          {loadingBadge && <Spinner animation="border" size="sm" />}
        </div>
      )}

      <UpdateUserIdentificationsModal
        show={showUpdateIdentification}
        onHide={() => setShowUpdateIdentification(false)}
      />
    </>
  );
};
