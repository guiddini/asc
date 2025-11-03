import React from "react";
import { Row, Col, Alert, Spinner } from "react-bootstrap";
import { Blog } from "../types/blog";
import MediaCard from "./media-card";

interface MediaListProps {
  media?: Blog[];
  loading?: boolean;
  error?: string;
}

const MediaList: React.FC<MediaListProps> = ({ media, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading media...</p>
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

  if (media?.length === 0) {
    return (
      <div className="no-blogs-found text-center py-5">
        <i className="bi bi-journal-x display-1 text-muted mb-3"></i>
        <h4 className="text-muted">No media found</h4>
        <p className="text-muted">
          Try adjusting your search criteria or check back later for new
          content.
        </p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {media?.map((media) => (
        <Col key={media?.id} lg={4} md={6} sm={12}>
          <MediaCard media={media} />
        </Col>
      ))}
    </Row>
  );
};

export default MediaList;
