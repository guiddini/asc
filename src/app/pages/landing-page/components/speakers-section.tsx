import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import SpeakerList from "./speaker-list";
import { useQuery } from "react-query";
import { getAllSpeakers, SpeakersResponse } from "../../../apis/speaker";

const SpeakerSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch speakers using React Query with currentPage param
  const { data, isLoading, isError } = useQuery<SpeakersResponse>(
    ["speakers", currentPage],
    () => getAllSpeakers(currentPage),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  // Speakers from API response or empty array if loading
  const speakers = data?.data || [];

  // Filter speakers based on search term locally on current page
  const filteredSpeakers = speakers.filter((speaker) => {
    const lowerSearch = searchTerm.toLowerCase();
    const fullName = `${speaker.fname} ${speaker.lname}`.toLowerCase();
    return fullName.includes(lowerSearch);
  });

  const totalPages = data?.last_page || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Handlers for pagination buttons
  const goToPrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Reset to page 1 when search term changes (optional: can keep currentPage)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <section
      className="speaker-section"
      style={{
        width: "100%",
        padding: "5rem 0",
        backgroundColor: "var(--bs-light)",
      }}
    >
      <Container
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 15px" }}
      >
        {/* Section Header */}
        <Row className="mb-5 w-100">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-5 fw-bold text-dark mb-3">
              Meet Our Speakers
              {/* Rencontrez nos conférenciers */}
            </h2>
            <p className="lead text-muted mb-0">
              Discover the minds shaping the future of innovation and
              entrepreneurship
              {/* Industry experts and thought leaders sharing their insights */}
              {/* Des experts du secteur et des leaders d'opinion partageant leurs connaissances */}
            </p>
          </Col>
        </Row>
        {/* Search Filter */}
        {/* <Row className="mb-4 w-100">
          <Col lg={8} className="mx-auto">
            <Form.Control
              type="text"
              placeholder="Search speakers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-lg"
              disabled={isLoading}
            />
          </Col>
        </Row> */}
        {/* Results Info & Pagination */}
        {/* <Row className="mb-4 w-100">
          <Col
            lg={8}
            className="mx-auto d-flex justify-content-between align-items-center"
          >
            <p className="text-muted mb-0">
              Showing {filteredSpeakers.length} of {speakers.length} speakers on
              page {safeCurrentPage} of {totalPages}
            </p>
            <div>
              <Button
                variant="outline-primary"
                onClick={goToPrevPage}
                disabled={safeCurrentPage <= 1 || isLoading}
                className="me-2"
              >
                Previous
              </Button>
              <Button
                variant="outline-primary"
                onClick={goToNextPage}
                disabled={safeCurrentPage >= totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row> */}
        {/* Speaker List */}
        {/* <Row
          className="justify-content-center w-100"
          xs={12}
          sm={12}
          md={12}
          lg={12}
        >
          <Col lg={8}>
            {isLoading ? (
              <p>Loading speakers...</p>
            ) : isError ? (
              <p>Error loading speakers.</p>
            ) : filteredSpeakers.length > 0 ? (
              <SpeakerList speakers={filteredSpeakers} />
            ) : (
              <div className="no-results text-center py-5">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h4 className="text-muted">No speakers found</h4>
                <p className="text-muted">Try adjusting your search criteria</p>
                <Button
                  variant="outline-primary"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </Col>
        </Row> */}
      </Container>
    </section>
  );
};

export default SpeakerSection;
