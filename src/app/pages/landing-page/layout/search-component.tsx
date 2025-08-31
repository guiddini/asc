import React, { useState } from "react";
import { Modal, Form, Button, ListGroup, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";

interface SearchProps {
  show: boolean;
  onHide: () => void;
}

interface SearchFormData {
  query: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  to: string;
  type: "page" | "speaker" | "startup" | "partner" | "session";
}

const schema = yup.object().shape({
  query: yup
    .string()
    .required("Please enter a search term")
    .min(2, "Search term must contain at least 2 characters"),
});

const SearchComponent: React.FC<SearchProps> = ({ show, onHide }) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      query: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const watchQuery = watch("query");

  // Updated mock search data to match the navigation structure
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Event & Previous Editions",
      description: "Learn about the event history and previous editions",
      category: "About",
      to: "/about/event",
      type: "page",
    },
    {
      id: "2",
      title: "Program: Agenda, Keynotes, Workshops, Panels",
      description: "Complete program schedule with all sessions",
      category: "About",
      to: "/about/program",
      type: "session",
    },
    {
      id: "3",
      title: "Speakers: The African Champions",
      description: "Meet our amazing lineup of industry experts",
      category: "About",
      to: "/about/speakers",
      type: "speaker",
    },
    {
      id: "4",
      title: "Exhibiting Startups: Thematic Filtering - Countries",
      description: "Browse startups by theme and country",
      category: "About",
      to: "/about/startups",
      type: "startup",
    },
    {
      id: "5",
      title: "Partnership Packages + Visibility",
      description: "Partnership opportunities to reach thousands of attendees",
      category: "Partners",
      to: "/partners/packages",
      type: "partner",
    },
    {
      id: "6",
      title: "Thematic Spaces",
      description:
        "Startup Factory, Tech Zone, Gaming Zone, Immersion Room, Media Lounge",
      category: "Partners",
      to: "/partners/spaces",
      type: "page",
    },
    {
      id: "7",
      title: "Location, Access, Accommodation",
      description: "All practical information about venue and travel",
      category: "Practical Info",
      to: "/info/location",
      type: "page",
    },
    {
      id: "8",
      title: "Register: VIP - Visitor - Startup - Media - Sponsor",
      description: "Registration options for all attendee types",
      category: "Practical Info",
      to: "/info/register",
      type: "page",
    },
    {
      id: "9",
      title: "Blog - News",
      description: "Latest news and updates from the event",
      category: "Content",
      to: "/blog",
      type: "page",
    },
    {
      id: "10",
      title: "Press Room",
      description: "Media resources and press information",
      category: "Media",
      to: "/press",
      type: "page",
    },
  ];

  const getIconForType = (type: SearchResult["type"]) => {
    switch (type) {
      case "speaker":
        return "bi-person-badge";
      case "startup":
        return "bi-rocket-takeoff";
      case "partner":
        return "bi-handshake";
      case "session":
        return "bi-calendar-event";
      default:
        return "bi-file-text";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "About":
        return "primary";
      case "Partners":
        return "warning";
      case "Practical Info":
        return "success";
      case "Media":
        return "info";
      case "Content":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const performSearch = (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      const filtered = mockResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsSearching(false);
    }, 400);
  };

  const onSubmit = (data: SearchFormData) => {
    performSearch(data.query);
  };

  // Real-time search as user types
  React.useEffect(() => {
    if (watchQuery) {
      performSearch(watchQuery);
    } else {
      setResults([]);
    }
  }, [watchQuery]);

  const handleResultClick = (href: string) => {
    onHide();
    window.location.href = href;
  };

  const handleClose = () => {
    form.reset();
    setResults([]);
    onHide();
  };

  const popularSearches = [
    "Speakers",
    "Registration",
    "Program",
    "Partners",
    "Startups",
    "Location",
    "Accommodation",
    "Press",
  ];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      className="search-modal"
      centered
    >
      <div className="search-modal-content">
        <Modal.Header closeButton className="search-header border-0 pb-2">
          <Modal.Title className="w-100">
            <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
              <div className="search-input-wrapper position-relative">
                <div className="search-icon-container">
                  <i className="bi bi-search search-icon"></i>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Search for sessions, speakers, partners..."
                  size="lg"
                  className="search-input"
                  autoFocus
                  isInvalid={!!errors.query}
                  {...register("query")}
                />
                {isSearching && (
                  <div className="search-loading">
                    <div className="search-spinner">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Searching...</span>
                      </div>
                    </div>
                  </div>
                )}
                <kbd className="search-shortcut">⌘K</kbd>
              </div>
              {errors.query && (
                <Form.Control.Feedback type="invalid" className="d-block mt-2">
                  {errors.query.message}
                </Form.Control.Feedback>
              )}
            </Form>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="search-body pt-1">
          {results.length > 0 && (
            <div className="search-results">
              <div className="results-header mb-3 d-flex justify-content-between align-items-center">
                <span className="results-count">
                  <i className="bi bi-search me-1"></i>
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </span>
                <small className="text-muted">
                  ↑↓ to navigate • ↵ to select
                </small>
              </div>

              <div className="results-list">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="search-result-item"
                    onClick={() => handleResultClick(result.to)}
                  >
                    <div className="result-content">
                      <div className="result-header">
                        <div className="result-icon-wrapper">
                          <i
                            className={`bi ${getIconForType(
                              result.type
                            )} result-icon`}
                          ></i>
                        </div>
                        <div className="result-info">
                          <h6 className="result-title">{result.title}</h6>
                          <p className="result-description">
                            {result.description}
                          </p>
                          <Badge
                            bg={getCategoryColor(result.category)}
                            className="result-category"
                          >
                            {result.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="result-action">
                      <i className="bi bi-arrow-right-short"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {watchQuery &&
            watchQuery.length >= 2 &&
            results.length === 0 &&
            !isSearching && (
              <div className="no-results">
                <div className="no-results-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h6 className="no-results-title">No results found</h6>
                <p className="no-results-text">
                  Try adjusting your search terms or browse our navigation menu
                </p>
                <div className="no-results-suggestions">
                  <span className="suggestions-label">Suggestions:</span>
                  {popularSearches.slice(0, 3).map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="link"
                      size="sm"
                      className="suggestion-link p-0 ms-2"
                      onClick={() => form.setValue("query", suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

          {!watchQuery && (
            <div className="search-welcome">
              <div className="welcome-header mb-4">
                <h6 className="welcome-title">What are you looking for?</h6>
                <p className="welcome-subtitle">
                  Quickly find information about the event, speakers and more
                </p>
              </div>

              <div className="popular-searches">
                <div className="section-title mb-3">
                  <i className="bi bi-fire me-2 text-danger"></i>
                  <span>Popular searches</span>
                </div>
                <div className="suggestions-grid">
                  {popularSearches.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline-primary"
                      size="sm"
                      className="suggestion-pill"
                      onClick={() => form.setValue("query", tag)}
                    >
                      <i className="bi bi-search me-1"></i>
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="quick-links mt-4">
                <div className="section-title mb-3">
                  <i className="bi bi-lightning-fill me-2 text-warning"></i>
                  <span>Quick access</span>
                </div>
                <div className="quick-links-grid">
                  <Link
                    to="/info/register"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-ticket-perforated"></i>
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/about/speakers"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-people"></i>
                    <span>Speakers</span>
                  </Link>
                  <Link
                    to="/about/program"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-calendar-event"></i>
                    <span>Program</span>
                  </Link>
                  <Link
                    to="/partners/packages"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-handshake"></i>
                    <span>Partnership</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default SearchComponent;
