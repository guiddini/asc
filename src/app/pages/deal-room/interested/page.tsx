import { useQuery } from "react-query";
import { Spinner, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { interestedForStartup } from "../../../apis/investor-connection";
import getMediaUrl from "../../../helpers/getMediaUrl";
import PitchDeckAlert from "../../../pages/home/components/pitch-deck-alert";
import { MessageSquare } from "lucide-react";
import { PageTitle } from "../../../../_metronic/layout/core";

const InterestedInvestorsInMyPitchDeck = () => {
  const { data, isLoading, isError } = useQuery(
    ["interested-for-startup"],
    async () => {
      const res = await interestedForStartup();
      return res;
    },
    {
      keepPreviousData: true,
      staleTime: 10 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  const investors: {
    id: string;
    fname: string;
    lname: string;
    avatar?: string | null;
  }[] = Array.isArray(data) ? (data as any) : (data as any)?.data || [];

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-10">
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger">
        Failed to load interested pitch decks.
      </div>
    );
  }

  return (
    <>
      <PageTitle>Interested Investors</PageTitle>
      <PitchDeckAlert />
      <Row className="g-6 mt-1">
        {investors.map((inv) => (
          <Col key={String(inv?.id)} xs={6} md={4} lg={3}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center justify-content-center p-3">
                <div
                  className="text-center d-flex flex-column align-items-center justify-content-center"
                  style={{ width: 160, height: 160 }}
                >
                  {inv?.avatar ? (
                    <img
                      src={getMediaUrl(inv.avatar)}
                      alt={
                        `${inv?.fname || ""} ${inv?.lname || ""}`.trim() ||
                        "Investor"
                      }
                      className="rounded-circle"
                      style={{ width: 48, height: 48, objectFit: "cover" }}
                    />
                  ) : (
                    <div className="symbol symbol-circle symbol-50px overflow-hidden">
                      <div className="symbol-label fs-6 bg-light-primary text-primary">
                        {inv?.fname?.slice(0, 1) || "I"}
                      </div>
                    </div>
                  )}

                  <div className="fw-bold mt-2">
                    {(inv?.fname || "") + " " + (inv?.lname || "")}
                  </div>
                  <div className="text-muted small">Investor</div>

                  <div className="d-flex gap-2 mt-2">
                    <Link
                      to={`/chat?to=${inv.id}`}
                      className="btn btn-primary btn-sm fw-semibold"
                    >
                      Message
                      <MessageSquare size={16} className="ms-2" />
                    </Link>
                    <Link
                      to={`/profile/${inv.id}`}
                      className="btn btn-light btn-sm fw-semibold"
                    >
                      Profile
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {investors.length === 0 && (
          <Col xs={12}>
            <div className="alert alert-info mb-0">
              No interested investors yet.
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default InterestedInvestorsInMyPitchDeck;
