import React from "react";
import { Row, Col } from "react-bootstrap";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface BlogHeaderProps {
  title: string;
  coverImage: string;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ title, coverImage }) => {
  return (
    <Row className="mb-4">
      <Col>
        {coverImage && (
          <div className="blog-cover-image mb-4">
            <img
              src={getMediaUrl(coverImage)}
              alt="Blog cover"
              className="img-fluid rounded"
            />
          </div>
        )}
        <h1 className="blog-title display-4 fw-bold mb-0">{title}</h1>
      </Col>
    </Row>
  );
};

export default BlogHeader;
