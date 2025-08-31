import React from "react";
import { Row, Col, Badge } from "react-bootstrap";

interface BlogMetaProps {
  publishedAt: string;
  status: string;
}

const BlogMeta: React.FC<BlogMetaProps> = ({ publishedAt, status }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Row className="mb-5">
      <Col>
        <div className="blog-meta d-flex align-items-center gap-3">
          <span className="text-muted">
            <i className="bi bi-calendar3 me-2"></i>
            {formatDate(publishedAt)}
          </span>
          <Badge
            bg={status === "published" ? "success" : "warning"}
            className="text-capitalize"
          >
            <i className="bi bi-circle-fill me-1"></i>
            {status}
          </Badge>
        </div>
      </Col>
    </Row>
  );
};

export default BlogMeta;
