import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Blog } from "../types/blog";
import { formatDistanceToNow } from "date-fns";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const formatDate = (dateString: string) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true });

  return (
    <Card
      as={Link}
      to={`/blogs/${blog.slug}`}
      className="blog-card h-100 shadow-sm border-0"
      style={{ cursor: "pointer" }}
    >
      {blog.cover_image && (
        <div className="blog-image-container">
          <Card.Img
            variant="top"
            src={getMediaUrl(blog.cover_image)}
            alt={blog.title}
            className="blog-image"
          />
        </div>
      )}

      <Card.Body className="d-flex flex-column">
        <Card.Title className="blog-title h5 mb-2">{blog.title}</Card.Title>

        {"content" in blog && (
          <Card.Text className="blog-excerpt text-muted mb-3 flex-grow-1">
            {blog.content.length > 100
              ? blog.content.substring(0, 100) + "..."
              : blog.content}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default BlogCard;
