import { z } from 'zod';

// Article validation schema
export const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3).max(200),
  slug: z.string().min(1),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(50),
  author: z.string().min(2),
  category: z.enum(['World', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment', 'Science', 'Health']),
  tags: z.array(z.string()).min(1).max(10),
  imageUrl: z.string().optional(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  featured: z.boolean(),
});

// Category validation schema
export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(50),
  slug: z.string().min(1),
  description: z.string().optional(),
});

// Validation functions
export const validateArticle = (data: unknown) => {
  return articleSchema.parse(data);
};

export const validateArticles = (data: unknown[]) => {
  return z.array(articleSchema).parse(data);
};

export const validateCategory = (data: unknown) => {
  return categorySchema.parse(data);
};

// Type exports
export type ArticleInput = z.infer<typeof articleSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
