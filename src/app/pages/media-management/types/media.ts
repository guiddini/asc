export interface MediaFormData {
  title: string;
  slug: string;
  content: string;
  cover_image: File | null;
  excerpt: string;
  status: "draft" | "published";
}

export interface Media {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  excerpt: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}
