import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Blog } from "../types/blog";
import { formatDistanceToNow } from "date-fns";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

interface MediaCardProps {
  media: Blog;
}

const MediaCard: React.FC<MediaCardProps> = ({ media }) => {
  const formatDate = (dateString: string) =>
    formatDistanceToNow(new Date(dateString), { addSuffix: true });

  return (
    <Card
      as={Link}
      to={`/media/${media?.slug}`}
      className="h-100 border-0 overflow-hidden"
      style={{
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
      }}
    >
      {media?.cover_image && (
        <div
          style={{
            width: "100%",
            height: "200px",
            overflow: "hidden",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Card.Img
            variant="top"
            src={getMediaUrl(media?.cover_image)}
            alt={media?.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <Card.Body className="d-flex flex-column p-3">
        <Card.Title
          className="mb-2"
          style={{
            fontSize: "15px",
            fontWeight: "500",
            lineHeight: "1.4",
            color: "#1a1a1a",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {media?.title}
        </Card.Title>

        {"content" in media && media?.content && (
          <Card.Text
            className="flex-grow-1 mb-0"
            style={{
              fontSize: "13px",
              color: "#666",
              lineHeight: "1.5",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {media?.content?.replace(/<[^>]*>/g, "")}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default MediaCard;
