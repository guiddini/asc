import React from "react";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { BlogSearchParams } from "../types/blog";

interface SearchFiltersProps {
  filters: BlogSearchParams;
  onFiltersChange: (filters: BlogSearchParams) => void;
  onReset: () => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  onSearch,
  isLoading = false,
}) => {
  const handleInputChange = (field: keyof BlogSearchParams, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="search-filters mb-4">
      <Row className="g-3 align-items-end">
        {/* Search Input */}
        <Col lg={10} md={10}>
          <Form.Label className="fw-medium text-muted mb-2">
            Search Articles
          </Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search blogs by title..."
              value={filters.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </InputGroup>
        </Col>

        {/* Search Button */}
        <Col lg={2} md={2}>
          <Button
            variant="primary"
            onClick={onSearch}
            disabled={isLoading}
            className="w-100"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Searching...
              </>
            ) : (
              <>
                <i className="bi bi-search me-2"></i>
                Search
              </>
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilters;
