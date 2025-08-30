import React, { useState } from "react";
import { Modal, Form, Button, ListGroup, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  href: string;
  type: "page" | "speaker" | "startup" | "partner" | "session";
}

const schema = yup.object().shape({
  query: yup
    .string()
    .required("Veuillez saisir un terme de recherche")
    .min(2, "Le terme de recherche doit contenir au moins 2 caractères"),
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

  // Mock search data with French content
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Inscription à l'événement",
      description: "Inscrivez-vous à la conférence et réservez votre place",
      category: "Participants",
      href: "/attendees/register",
      type: "page",
    },
    {
      id: "2",
      title: "Intervenants & Conférenciers",
      description:
        "Découvrez notre formidable sélection d'experts de l'industrie",
      category: "Événement",
      href: "/speakers",
      type: "speaker",
    },
    {
      id: "3",
      title: "Postuler pour Pitcher",
      description: "Soumettez votre startup pour notre concours de pitch",
      category: "Startups",
      href: "/startups/apply",
      type: "startup",
    },
    {
      id: "4",
      title: "Devenir Partenaire",
      description: "Partenariat pour atteindre des milliers de participants",
      category: "Partenaires",
      href: "/partners/join",
      type: "partner",
    },
    {
      id: "5",
      title: "Programme & Horaires",
      description: "Consultez le programme complet et les sessions",
      category: "Événement",
      href: "/attendees/schedule",
      type: "session",
    },
    {
      id: "6",
      title: "Réseautage Professionnel",
      description: "Connectez-vous avec des entrepreneurs et investisseurs",
      category: "Participants",
      href: "/attendees/networking",
      type: "page",
    },
    {
      id: "7",
      title: "Histoires de Réussite",
      description: "Découvrez les success stories de nos startups",
      category: "Startups",
      href: "/startups/stories",
      type: "startup",
    },
    {
      id: "8",
      title: "Kit Presse & Média",
      description: "Ressources média et informations presse",
      category: "Médias",
      href: "/media/press-kit",
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
      case "Participants":
        return "primary";
      case "Startups":
        return "success";
      case "Partenaires":
        return "warning";
      case "Médias":
        return "info";
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
    "Conférenciers",
    "Inscription",
    "Programme",
    "Partenaires",
    "Startups",
    "Réseautage",
    "Pitch",
    "Investisseurs",
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
                  placeholder="Rechercher des sessions, conférenciers, partenaires..."
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
                        <span className="visually-hidden">Recherche...</span>
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
                  {results.length} résultat{results.length !== 1 ? "s" : ""}{" "}
                  trouvé{results.length !== 1 ? "s" : ""}
                </span>
                <small className="text-muted">
                  ↑↓ pour naviguer • ↵ pour sélectionner
                </small>
              </div>

              <div className="results-list">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="search-result-item"
                    onClick={() => handleResultClick(result.href)}
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
                <h6 className="no-results-title">Aucun résultat trouvé</h6>
                <p className="no-results-text">
                  Essayez d'ajuster vos termes de recherche ou parcourez notre
                  menu de navigation
                </p>
                <div className="no-results-suggestions">
                  <span className="suggestions-label">Suggestions :</span>
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
                <h6 className="welcome-title">Que recherchez-vous ?</h6>
                <p className="welcome-subtitle">
                  Trouvez rapidement des informations sur l'événement, les
                  intervenants et plus encore
                </p>
              </div>

              <div className="popular-searches">
                <div className="section-title mb-3">
                  <i className="bi bi-fire me-2 text-danger"></i>
                  <span>Recherches populaires</span>
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
                  <span>Accès rapide</span>
                </div>
                <div className="quick-links-grid">
                  <a
                    href="/attendees/register"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-ticket-perforated"></i>
                    <span>S'inscrire</span>
                  </a>
                  <a
                    href="/speakers"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-people"></i>
                    <span>Conférenciers</span>
                  </a>
                  <a
                    href="/attendees/schedule"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-calendar-event"></i>
                    <span>Programme</span>
                  </a>
                  <a
                    href="/partners/join"
                    className="quick-link"
                    onClick={handleClose}
                  >
                    <i className="bi bi-handshake"></i>
                    <span>Partenariat</span>
                  </a>
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
