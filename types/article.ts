export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Limited preview content only
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;
  // Attribution fields
  source: string; // Publication name (e.g., "The New York Times")
  sourceUrl: string; // Original article URL
  sourceDomain?: string; // Domain for display (e.g., "nytimes.com")
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
