import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Pagination,
} from "react-bootstrap";
import { useMutation } from "react-query";
import SearchFilters from "./components/search-filters";
import { Blog, BlogSearchParams } from "./types/blog";
import { searchBlogs } from "../../apis";
import MediaList from "./components/media-list";

const MediaPage: React.FC = () => {
  const [filters, setFilters] = useState<BlogSearchParams>({
    title: "",
  });

  const [blogs, setBlogs] = useState<Blog[]>();
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 9;

  // React Query Mutation for searching blogs
  const searchMutation = useMutation({
    mutationFn: searchBlogs,
    onSuccess: (data) => {
      setBlogs(data); // Handle different API response formats
      setHasSearched(true);
    },
    onError: (error) => {
      console.error("Search failed:", error);
      setHasSearched(true);
    },
  });

  const handleFiltersChange = (newFilters: BlogSearchParams) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Trigger the search mutation
    searchMutation.mutate({ title: filters.title });
  };

  const handleResetFilters = () => {
    setFilters({ title: "" });
    setHasSearched(false);
    searchMutation.reset();
  };

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters.title]);

  const totalItems = blogs?.length ?? 0;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems]
  );
  const paginatedBlogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return blogs?.slice(start, end) ?? [];
  }, [blogs, page]);

  return (
    <Container
      style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 15px" }}
    >
      {/* Search Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        onSearch={handleSearch}
        isLoading={searchMutation.isLoading}
      />

      {/* Error Message */}
      {searchMutation.isError && (
        <Alert variant="warning" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Search failed. Showing sample results instead.
        </Alert>
      )}

      {/* Search Results Summary */}
      {hasSearched && (
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 text-muted">
                {filters.title ? (
                  <>
                    Found {blogs?.length} result
                    {blogs?.length !== 1 ? "s" : ""} for
                    <strong className="text-primary ms-1">
                      "{filters?.title}"
                    </strong>
                  </>
                ) : (
                  `Showing all ${blogs?.length}${
                    blogs?.length !== 1 ? "s" : ""
                  }`
                )}
              </p>
              <div className="view-options">
                <Button variant="outline-primary" size="sm" className="me-2">
                  <i className="bi bi-grid"></i>
                </Button>
                <Button variant="outline-primary" size="sm">
                  <i className="bi bi-list"></i>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Media Cards List */}
      <MediaList
        media={paginatedBlogs}
        loading={searchMutation.isLoading}
        error={searchMutation.isError ? "Failed to load media" : undefined}
      />

      {/* Pagination */}
      {totalItems > pageSize && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <Pagination.Item
                    key={pageNum}
                    active={page === pageNum}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MediaPage;
