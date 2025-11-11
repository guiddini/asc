import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "react-query";
import { getPublicCompanies } from "../../../apis/company";
import type { PublicCompany } from "../../../types/company";
import getMediaUrl from "../../../helpers/getMediaUrl";

const ExhibitorsSection: React.FC = () => {
  const {
    data: companies,
    isLoading,
    isError,
  } = useQuery<PublicCompany[]>(
    ["public-companies"],
    () => getPublicCompanies(),
    { staleTime: 5 * 60 * 1000, retry: 1 }
  );

  const items = companies || [];

  return (
    <section id="landing-exhibitors-section">
      <Container id="landing-exhibitors-container">
        <div id="landing-exhibitors-header">
          <h2 id="landing-exhibitors-heading">Exhibitors</h2>
        </div>
        <Row>
          {isLoading && (
            <Col xs={12} className="text-center py-5">
              Loading exhibitors…
            </Col>
          )}
          {isError && (
            <Col xs={12} className="text-center py-5">
              Failed to load exhibitors.
            </Col>
          )}
          {!isLoading && !isError && items.length === 0 && (
            <Col xs={12} className="text-center py-5">
              No exhibitors yet.
            </Col>
          )}
          {!isLoading &&
            !isError &&
            items.map((company, idx) => (
              <Col key={idx} xs={6} md={4} lg={3} xl={2} className="mb-4">
                <Card data-exhibitor-card>
                  <div data-logo>
                    <img
                      src={
                        getMediaUrl(company.logo) ||
                        "/sponsors/commingSoon.jpeg"
                      }
                      alt={company.name}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title
                      className="text-center fs-6"
                      style={{ minHeight: 24 }}
                    >
                      {company.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
    </section>
  );
};

export default ExhibitorsSection;
