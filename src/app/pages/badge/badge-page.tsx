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
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import type { BarcodeData } from "../event/event-page";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../types/reducers";
import QRCode from "react-qr-code";

export const BadgePage = () => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const [loadingBadge, setLoadingBadge] = useState<boolean>(false);

  const [pdfSource, setPdfSource] = useState(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const fetchPdf = async () => {
    setLoadingBadge(true);
    try {
      // Assuming your getUserBadgeApi returns the PDF content as a blob
      const response = await axiosInstance.get(`/ticket/badge`, {
        responseType: "blob",
      });

      const blob = response.data;

      if (blob instanceof Blob) {
        const file = window.URL.createObjectURL(blob);
        setPdfSource(file);
        setLoadingBadge(false);
      } else {
        console.error("Error fetching PDF: Invalid response format");
        setLoadingBadge(false);
      }
    } catch (error) {
      setLoadingBadge(false);
      console.error("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPdf();
    }
  }, [user?.id]);

  const handleDownloadPdf = async () => {
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
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handlePrintPdf = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfSource;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  };

  const [barcode, setBarcode] = useState<BarcodeData | null>(null);

  return (
    <>
      <PageTitle>Mon badge</PageTitle>
      <Row
        xs={12}
        md={12}
        lg={12}
        style={{
          minHeight: "75vh",
        }}
        className="gap-3 gap-md-0"
      >
        <Col xs={12} md={12} lg={4}>
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
        </Col>
        <Col xs={12} md={12} lg={8}>
          <Row
            xs={12}
            md={12}
            lg={12}
            style={{
              minHeight: "75vh",
            }}
          >
            <Col xs={12} md={4} lg={4}>
              <div className="card w-100 h-100 d-flex align-items-center justify-content-center">
                <img
                  src="/side-events/commingsoon.jpeg"
                  alt="Coming Soon"
                  className="w-100 h-100 object-fit-cover rounded"
                />
              </div>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <div className="card w-100 h-100">
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-6">
                  <h1>Share my participation</h1>

                  <div className="w-100 h-50 d-flex flex-column align-items-start justify-content-center gap-4 align-self-start">
                    <LinkedinShareButton
                      url={`https://asc.eventili.com/`}
                      title="I'm attending the African Startup Conference — the leading pan-African gathering dedicated to innovation, entrepreneurship, and future technologies. 🌍✨ Since its inception, it has united ecosystems, governments, investors, and the African diaspora around a shared vision: building a technologically sovereign and inclusive Africa. 
                    
                    Edition after edition, the Conference has become a key platform for dialogue and collaboration, shaping strategic initiatives such as the Algiers Declaration on Startup Development, the African Charter for Talent Retention, and the continental Public Policy Framework on Artificial Intelligence — all highlighting its transformative impact on Africa’s innovation landscape. 
                    
                    In 2025, the Conference returns for its 4th edition under the theme 'Raising African Champions' 🚀 — celebrating high-growth African startups driving progress across the continent and beyond. Join us at https://asc.eventili.com/ to be part of this movement. 💡#ASC2025 #AfricanStartups #Innovation #TechInAfrica #Entrepreneurship #PanAfrican #Guiddini"
                    >
                      <LinkedinIcon size={32} round />
                      <span className="text-muted ms-2">LinkedIn</span>
                    </LinkedinShareButton>
                    {/*  */}
                    {/* Share on Facebook */}
                    <FacebookShareButton
                      url={`https://asc.eventili.com/`}
                      title="I'm attending the African Startup Conference — the leading pan-African gathering dedicated to innovation, entrepreneurship, and future technologies. 🌍✨ Since its inception, it has united ecosystems, governments, investors, and the African diaspora around a shared vision: building a technologically sovereign and inclusive Africa. 
                  
                  Edition after edition, the Conference has become a key platform for dialogue and collaboration, shaping strategic initiatives such as the Algiers Declaration on Startup Development, the African Charter for Talent Retention, and the continental Public Policy Framework on Artificial Intelligence — all highlighting its transformative impact on Africa’s innovation landscape. 
                  
                  In 2025, the Conference returns for its 4th edition under the theme 'Raising African Champions' 🚀 — celebrating high-growth African startups driving progress across the continent and beyond. Join us at https://asc.eventili.com/ to be part of this movement. 💡#ASC2025 #AfricanStartups #Innovation #TechInAfrica #Entrepreneurship #PanAfrican #Guiddini"
                    >
                      <FacebookIcon size={32} round />
                      <span className="text-muted ms-2">Facebook</span>
                    </FacebookShareButton>
                    {/*  */}
                    {/* Share on Twitter */}
                    <TwitterShareButton
                      url={`https://asc.eventili.com/`}
                      title="I'm attending the African Startup Conference — the leading pan-African gathering dedicated to innovation, entrepreneurship, and future technologies. 🌍✨ Since its inception, it has united ecosystems, governments, investors, and the African diaspora around a shared vision: building a technologically sovereign and inclusive Africa. 
                    
                    Edition after edition, the Conference has become a key platform for dialogue and collaboration, shaping strategic initiatives such as the Algiers Declaration on Startup Development, the African Charter for Talent Retention, and the continental Public Policy Framework on Artificial Intelligence — all highlighting its transformative impact on Africa’s innovation landscape. 
                    
                    In 2025, the Conference returns for its 4th edition under the theme 'Raising African Champions' 🚀 — celebrating high-growth African startups driving progress across the continent and beyond. Join us at https://asc.eventili.com/ to be part of this movement. 💡#ASC2025 #AfricanStartups #Innovation #TechInAfrica #Entrepreneurship #PanAfrican #Guiddini"
                    >
                      <TwitterIcon size={32} round />
                      <span className="text-muted ms-2">Twitter</span>
                    </TwitterShareButton>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
