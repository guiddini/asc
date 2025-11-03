import React from "react";
import { Row, Col } from "react-bootstrap";

interface BlogContentProps {
  content: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  // Convert markdown to HTML (basic implementation)
  const createMarkup = (markdown: string) => {
    let html = markdown
      .replace(/\r\n/g, "\n")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^\- (.*$)/gim, "<li>$1</li>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");

    // Wrap orphaned list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

    // Wrap content in paragraphs
    if (!html.startsWith("<h") && !html.startsWith("<ul")) {
      html = "<p>" + html + "</p>";
    }

    return { __html: html };
  };

  return (
    <Row>
      <Col lg={8} className="mx-auto">
        <div
          className="blog-content-body"
          dangerouslySetInnerHTML={createMarkup(content)}
        />
      </Col>
    </Row>
  );
};

export default BlogContent;
