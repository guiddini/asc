import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import SpeakerList from "./speaker-list";
import { SPEAKERS } from "../data/speakers";

const SpeakerSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Fixed values (no props)
  const title = "Meet Our Speakers";
  const subtitle =
    "Industry experts and thought leaders sharing their insights";
  const showFilters = true;
  const maxDisplay = 8;
  const fullWidth = true;

  // Filter speakers based on search and country
  const filteredSpeakers = SPEAKERS.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.affiliation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.topic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      !selectedCountry || speaker.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  // Apply maxDisplay limit if specified and showAll is false
  const displayedSpeakers =
    maxDisplay && !showAll
      ? filteredSpeakers.slice(0, maxDisplay)
      : filteredSpeakers;

  // Get unique countries for filter
  const countries = Array.from(new Set(SPEAKERS.map((s) => s.country))).sort();

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
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 15px",
        }}
      >
        {/* Section Header */}
        <Row className="mb-5 w-100">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-5 fw-bold text-dark mb-3">{title}</h2>
            <p className="lead text-muted mb-0">{subtitle}</p>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4 w-100">
          <Col lg={8} className="mx-auto">
            <div className="speaker-filters">
              <Row className="g-3">
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="Search speakers by name, title, company, or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control-lg"
                  />
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="form-select-lg"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Results Info */}
        <Row className="mb-4">
          <Col className="text-center">
            {" "}
            {/* Center the results info */}
            <div className="d-flex justify-content-between align-items-center">
              <p className="text-muted mb-0">
                Showing {displayedSpeakers.length} of {filteredSpeakers.length}{" "}
                speakers
              </p>
              {maxDisplay && filteredSpeakers.length > maxDisplay && (
                <Button
                  variant="outline-primary"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll
                    ? "Show Less"
                    : `Show All ${filteredSpeakers.length} Speakers`}
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Centered Speaker List Container */}
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: "1200px", width: "100%" }}>
            <SpeakerList speakers={displayedSpeakers} />
          </div>
        </div>

        {/* No Results */}
        {filteredSpeakers.length === 0 && (
          <Row className="text-center py-5">
            <Col>
              <div className="no-results">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h4 className="text-muted">No speakers found</h4>
                <p className="text-muted">
                  Try adjusting your search criteria or clearing the filters
                </p>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCountry("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default SpeakerSection;
