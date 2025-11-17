import React, { useMemo, useState } from "react";
import { Card, Button, Spinner, Badge, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import { UserResponse } from "../../../types/reducers";
import { getPitchDeckStatus, getMyPitchDeck } from "../../../apis/pitch-deck";
import PitchDeckUploadModal from "./pitch-deck-upload-modal";
import PitchDeckDetailsModal from "./pitch-deck-details-modal";
import getMediaUrl from "../../../helpers/getMediaUrl";

function PitchDeckAlert() {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: UserResponse) => state.user);

  const [showUpload, setShowUpload] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const {
    data: statusData,
    isLoading,
    isError,
    refetch,
  } = useQuery(["pitch-deck-status"], getPitchDeckStatus, {
    enabled: true,
    staleTime: 60 * 1000,
  });

  const { data: myDeckData } = useQuery(
    ["my-pitch-deck-lite"],
    getMyPitchDeck,
    { enabled: true, staleTime: 60 * 1000 }
  );

  const status = statusData?.status ?? null;
  const deckTitle = myDeckData?.pitch_deck?.title || null;

  const { variant, title, description, showAction, actionLabel, icon, badge } =
    useMemo(() => {
      if (status === "pending") {
        return {
          variant: "warning",
          title: "Pitch Deck Under Review",
          description:
            "Your pitch deck has been submitted and is currently under review. Our reviewers check for clarity, completeness, and consistency across problem, solution, market, traction, business model, team, and contact details. Typical review time is 24–48 hours. You can replace the file at any time while it’s pending; the latest version will be considered.",
          showAction: false,
          actionLabel: "",
          icon: "clock-history",
          badge: "In Review",
        };
      }
      if (status === "refused") {
        return {
          variant: "danger",
          title: "Pitch Deck Refused",
          description:
            "Your pitch deck did not meet the review criteria. Please upload a revised version. Make sure your slides clearly cover the problem, solution, target market size, traction or proof points, business model, go-to-market, competition, team, and contact details. Use a clear visual hierarchy and keep it concise (10–15 slides).",
          showAction: true,
          actionLabel: "Upload New File",
          icon: "x-circle",
          badge: "Action Required",
        };
      }
      if (status === "accepted") {
        return {
          variant: "success",
          title: "Pitch Deck Accepted",
          description:
            "Great news — your pitch deck has been accepted. You’re now eligible for access to the investor deal room when it becomes available. You can still replace the file at any time to keep investors up to date with your latest metrics or milestones.",
          showAction: false,
          actionLabel: "",
          icon: "check-circle",
          badge: "Approved",
        };
      }
      return {
        variant: "primary",
        title: "Upload Your Pitch Deck",
        description:
          "Upload your pitch deck for review and unlock investor access once approved. Accepted formats: PDF, PPT, or PPTX. Aim for 10–15 slides that clearly cover the problem, solution, market size, traction, business model, competition, go-to-market, team, roadmap, and contact info. You can replace or update your deck anytime; reviews typically complete within 24–48 hours.",
        showAction: true,
        actionLabel: "Upload Pitch Deck",
        icon: "cloud-upload",
        badge: "Get Started",
      };
    }, [status]);

  return (
    <>
      {/* Bootstrap-only layout and utilities */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Body>
          <Row className="g-4 align-items-stretch">
            {/* Visual Panel */}
            <Col xs={12} md={3}>
              <div
                className="rounded-3 overflow-hidden text-white ratio ratio-1x1"
                style={{ ["--bs-aspect-ratio" as any]: "100%" }} // 1:1 square
              >
                <div className="d-flex align-items-center justify-content-center h-100 w-100">
                  <img
                    src={`${import.meta.env.BASE_URL}pitch.png`}
                    alt="Startup cover"
                    className="img-fluid w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      // Hide if missing rather than breaking layout
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            </Col>
            {/* Content Panel */}
            <Col xs={12} md={9} className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="me-3">
                  <small className="text-muted fw-semibold d-block mb-1">
                    Pitch Deck Status
                  </small>
                  <h3 className="mb-0">{title}</h3>
                  {deckTitle && (
                    <div className="small text-muted mt-1">
                      Deck: {deckTitle}
                    </div>
                  )}
                </div>
                <Badge
                  bg={variant as any}
                  className={`align-self-start ${
                    status === "pending" ? "text-white" : ""
                  }`}
                >
                  {badge}
                </Badge>
              </div>

              {/* Meta: render only if user has a company */}
              {user?.company && (
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle overflow-hidden d-inline-flex align-items-center justify-content-center bg-light me-2"
                      style={{ width: 40, height: 40 }}
                    >
                      {user.company.logo ? (
                        <img
                          src={getMediaUrl(user.company.logo)}
                          alt={user.company.name || "Company Logo"}
                          className="w-100 h-100 object-fit-cover"
                        />
                      ) : isLoading ? (
                        <Spinner animation="border" size="sm" role="status" />
                      ) : (
                        <i className="bi bi-building" />
                      )}
                    </div>
                    <div className="fw-semibold">
                      {user.company.name || "Your Startup"}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-muted fw-semibold mb-3">
                {isError
                  ? "Failed to load pitch deck status. Please try again."
                  : description}
              </p>

              {/* Stats */}
              {status && (
                <div className="d-flex flex-wrap gap-3 mb-3">
                  <div className="border rounded p-3">
                    <div className="fw-bold">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="small text-muted">
                      {status === "accepted" ? "Approved Date" : "Submitted"}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center mt-auto">
                {showAction ? (
                  <Button
                    variant={
                      status === "refused"
                        ? "danger"
                        : status === "pending"
                        ? "warning"
                        : "primary"
                    }
                    className="fw-semibold"
                    onClick={() => setShowUpload(true)}
                  >
                    {actionLabel}
                    <i className="bi bi-upload ms-2" />
                  </Button>
                ) : (
                  status === "accepted" && (
                    <Button
                      variant="primary"
                      className="fw-semibold"
                      onClick={() => setShowDetails(true)}
                    >
                      View Details <i className="bi bi-arrow-right ms-1" />
                    </Button>
                  )
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <PitchDeckUploadModal
        show={showUpload}
        onHide={() => setShowUpload(false)}
        onUploaded={async () => {
          await refetch();
          queryClient.invalidateQueries(["pitch-deck-status"]);
        }}
      />
      <PitchDeckDetailsModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
      />
    </>
  );
}

export default PitchDeckAlert;
