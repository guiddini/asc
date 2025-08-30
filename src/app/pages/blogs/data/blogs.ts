import { Blog } from "../types/blog";

export const SAMPLE_BLOGS: Blog[] = [
  {
    id: "1",
    title: "The Future of Web Development in 2026",
    slug: "future-web-development-2026",
    content: `
      <p>Web development continues to evolve at a rapid pace. In this comprehensive guide, we explore the emerging technologies and frameworks that will shape the industry in 2026.</p>
      <h3>Key Technologies</h3>
      <ul>
        <li>Next.js 15 and React 19</li>
        <li>AI-powered development tools</li>
        <li>WebAssembly integration</li>
        <li>Edge computing solutions</li>
      </ul>
      <p>The landscape is changing, and developers need to stay ahead of the curve...</p>
    `,
    status: "published",
    published_at: "2025-08-15T10:00:00Z",
    author_id: "1",
    cover_image: "/blogs/web-dev-future.jpg",
    excerpt:
      "Explore the emerging technologies and frameworks that will shape web development in 2026, from AI-powered tools to edge computing solutions.",
    created_at: "2025-08-15T09:00:00Z",
    updated_at: "2025-08-15T10:00:00Z",
    reading_time: 8,
    tags: ["Web Development", "Technology", "Future", "React"],
    user: {
      id: "1",
      fname: "Sarah",
      lname: "Johnson",
      email: "sarah@example.com",
      avatar: "/avatars/sarah.jpg",
    },
    comments: [],
  },
  {
    id: "2",
    title: "Building Scalable APIs with Laravel 11",
    slug: "scalable-apis-laravel-11",
    content: `
      <p>Laravel 11 introduces powerful features for building robust, scalable APIs. Learn best practices and implementation strategies.</p>
      <h3>New Features</h3>
      <ul>
        <li>Improved performance</li>
        <li>Enhanced security</li>
        <li>Better testing tools</li>
      </ul>
    `,
    status: "published",
    published_at: "2025-08-10T14:30:00Z",
    author_id: "2",
    cover_image: "/blogs/laravel-apis.jpg",
    excerpt:
      "Master the art of building scalable APIs with Laravel 11, featuring new performance improvements and security enhancements.",
    created_at: "2025-08-10T13:00:00Z",
    updated_at: "2025-08-10T14:30:00Z",
    reading_time: 12,
    tags: ["Laravel", "PHP", "API", "Backend"],
    user: {
      id: "2",
      fname: "Ahmed",
      lname: "Hassan",
      email: "ahmed@example.com",
      avatar: "/avatars/ahmed.jpg",
    },
    comments: [],
  },
  {
    id: "3",
    title: "AI and Machine Learning in Modern Applications",
    slug: "ai-ml-modern-applications",
    content: `
      <p>Artificial Intelligence and Machine Learning are transforming how we build applications. This article covers practical implementations and real-world examples.</p>
    `,
    status: "published",
    published_at: "2025-08-05T16:00:00Z",
    author_id: "3",
    cover_image: "/blogs/ai-ml.jpg",
    excerpt:
      "Discover how AI and ML are revolutionizing modern applications with practical examples and implementation strategies.",
    created_at: "2025-08-05T15:00:00Z",
    updated_at: "2025-08-05T16:00:00Z",
    reading_time: 15,
    tags: ["AI", "Machine Learning", "Technology", "Innovation"],
    user: {
      id: "3",
      fname: "Maria",
      lname: "Garcia",
      email: "maria@example.com",
      avatar: "/avatars/maria.jpg",
    },
    comments: [],
  },
];
