import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useMutation } from "react-query";
import SearchFilters from "./components/search-filters";
import BlogList from "./components/blog-list";
import { Blog, BlogSearchParams } from "./types/blog";
import { searchBlogs } from "../../apis";

const BlogsPage: React.FC = () => {
  const [filters, setFilters] = useState<BlogSearchParams>({
    title: "",
  });

  const [blogs, setBlogs] = useState<Blog[]>();
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleBlogClick = (blog: Blog) => {
    // Navigate to blog detail page
    console.log("Navigate to blog:", blog.slug);
    // In Next.js: router.push(`/blogs/${blog.slug}`);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="blogs-page">
      {/* Enhanced Hero Section */}
      <section
        className="blogs-hero position-relative overflow-hidden"
        style={{
          width: "100%",
          margin: "0 calc(-50vw + 50%)",

          padding: "8rem 0 6rem 0",
          background:
            "linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-secondary) 100%)",
        }}
      >
        {/* Animated Background Elements */}
        <div className="hero-bg-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>

        <Container
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 15px" }}
        >
          <Row>
            <Col
              lg={8}
              className="mx-auto text-center position-relative"
              style={{ zIndex: 2 }}
            >
              <div className="hero-content">
                <div className="hero-badge mb-4">
                  <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
                    <i className="bi bi-lightning-fill me-2"></i>
                    Latest Articles & Insights
                  </span>
                </div>

                <h1 className="hero-title display-1 fw-bold text-white mb-4">
                  Discover Amazing
                  <span className="text-white d-block">
                    Stories & Tutorials
                  </span>
                </h1>

                <p
                  className="hero-description lead text-white mb-5"
                  style={{ opacity: 0.9, fontSize: "1.3rem" }}
                >
                  Deep dive into the world of technology, innovation, and
                  creative solutions. Our expert-written articles will keep you
                  ahead of the curve.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Content */}
      <section className="blogs-content py-5">
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
                        Found {blogs.length} result
                        {blogs.length !== 1 ? "s" : ""} for
                        <strong className="text-primary ms-1">
                          "{filters.title}"
                        </strong>
                      </>
                    ) : (
                      `Showing all ${blogs.length} blog${
                        blogs.length !== 1 ? "s" : ""
                      }`
                    )}
                  </p>
                  <div className="view-options">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
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

          {/* Blog List */}
          <BlogList
            blogs={blogs}
            loading={searchMutation.isLoading}
            error={searchMutation.isError ? "Failed to load blogs" : undefined}
          />
        </Container>
      </section>
    </div>
  );
};

export default BlogsPage;
