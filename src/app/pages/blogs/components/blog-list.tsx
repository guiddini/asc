import React from "react";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import { Blog } from "../types/blog";
import BlogCard from "./blog-card";

interface BlogListProps {
  blogs?: Blog[];
  loading?: boolean;
  error?: string;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );
  }

  if (blogs?.length === 0) {
    return (
      <div className="no-blogs-found text-center py-5">
        <i className="bi bi-journal-x display-1 text-muted mb-3"></i>
        <h4 className="text-muted">No blogs found</h4>
        <p className="text-muted">
          Try adjusting your search criteria or check back later for new
          content.
        </p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {blogs?.map((blog) => (
        <Col key={blog?.id} lg={4} md={6} sm={12}>
          <BlogCard blog={blog} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
