import React from "react";
import { Container } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getBlogBySlug } from "../../../apis";
import LoadingSpinner from "../components/loading-spinner";
import BlogHeader from "../components/media-header";
import BlogMeta from "../components/media-meta";
import BlogContent from "../components/media-content";
import ErrorMessage from "../components/error-message";
import CommentsSection from "../components/comments-section";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  published_at: string;
  user_id: string;
  cover_image: string;
  excerpt: string | null;
  created_at: string;
  updated_at: string;
}

const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery<BlogPost>({
    queryFn: () => getBlogBySlug(slug!),
    queryKey: ["blog", slug],
    enabled: !!slug,
    retry: 1,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !blog) {
    return <ErrorMessage />;
  }

  return (
    <div id="blog-details-page">
      <Container className="py-5">
        <BlogHeader title={blog.title} coverImage={blog.cover_image} />
        <BlogMeta publishedAt={blog.published_at} status={blog.status} />
        <BlogContent content={blog.content} />

        <div className="mt-5">
          <CommentsSection blogId={blog.id} />
        </div>
      </Container>
    </div>
  );
};

export default BlogDetailsPage;
