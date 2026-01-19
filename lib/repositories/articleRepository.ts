import { prisma } from '../db';
import { Article } from '@/types/article';
import { logger } from '../logger';
import { Prisma } from '@prisma/client';

// Type for article with relations
type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: { category: true; tags: true };
}>;

/**
 * Transform database article to Article type
 */
function transformArticle(article: ArticleWithRelations): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    category: article.category.name,
    tags: article.tags.map((tag: { name: string }) => tag.name),
    imageUrl: article.imageUrl || undefined,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    featured: article.featured,
    source: article.source,
    sourceUrl: article.sourceUrl,
    sourceDomain: article.sourceDomain || undefined,
  };
}

export interface ArticleFilters {
  categoryId?: string;
  categorySlug?: string;
  featured?: boolean;
  tags?: string[];
  searchQuery?: string;
}

export interface ArticleSortOptions {
  field: 'publishedAt' | 'updatedAt' | 'title';
  order: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Article Repository - handles all database operations for articles
 */
export const articleRepository = {
  /**
   * Find all articles with optional filtering, sorting, and pagination
   */
  async findAll(
    filters?: ArticleFilters,
    sort: ArticleSortOptions = { field: 'publishedAt', order: 'desc' },
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Article>> {
    try {
      const where: Prisma.ArticleWhereInput = {};

      // Apply filters
      if (filters?.categoryId) {
        where.categoryId = filters.categoryId;
      }

      if (filters?.categorySlug) {
        where.category = {
          slug: filters.categorySlug,
        };
      }

      if (filters?.featured !== undefined) {
        where.featured = filters.featured;
      }

      if (filters?.tags && filters.tags.length > 0) {
        where.tags = {
          some: {
            slug: {
              in: filters.tags,
            },
          },
        };
      }

      if (filters?.searchQuery) {
        where.OR = [
          { title: { contains: filters.searchQuery } },
          { excerpt: { contains: filters.searchQuery } },
          { content: { contains: filters.searchQuery } },
        ];
      }

      // Get total count
      const total = await prisma.article.count({ where });

      // Calculate pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);

      // Fetch articles
      const articles = await prisma.article.findMany({
        where,
        orderBy: {
          [sort.field]: sort.order,
        },
        skip,
        take: limit,
        include: {
          category: true,
          tags: true,
        },
      });

      // Transform to Article type
      const transformedArticles = articles.map(transformArticle);

      return {
        data: transformedArticles,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      logger.error('Error fetching articles', { error, filters, sort, pagination });
      throw error;
    }
  },

  /**
   * Find a single article by ID
   */
  async findById(id: string): Promise<Article | null> {
    try {
      const article = await prisma.article.findUnique({
        where: { id },
        include: {
          category: true,
          tags: true,
        },
      });

      if (!article) {
        return null;
      }

      return transformArticle(article);
    } catch (error) {
      logger.error('Error fetching article by ID', { error, id });
      throw error;
    }
  },

  /**
   * Find a single article by slug
   */
  async findBySlug(slug: string): Promise<Article | null> {
    try {
      const article = await prisma.article.findUnique({
        where: { slug },
        include: {
          category: true,
          tags: true,
        },
      });

      if (!article) {
        return null;
      }

      return transformArticle(article);
    } catch (error) {
      logger.error('Error fetching article by slug', { error, slug });
      throw error;
    }
  },

  /**
   * Create a new article
   */
  async create(data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    categorySlug: string;
    tags?: string[];
    imageUrl?: string;
    publishedAt?: Date;
    featured?: boolean;
    source: string;
    sourceUrl: string;
    sourceDomain?: string;
  }): Promise<Article> {
    try {
      // Get or create category
      const category = await prisma.category.findUnique({
        where: { slug: data.categorySlug },
      });

      if (!category) {
        throw new Error(`Category with slug '${data.categorySlug}' not found`);
      }

      // Get or create tags
      const tagConnections = [];
      if (data.tags && data.tags.length > 0) {
        for (const tagName of data.tags) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            create: {
              name: tagName,
              slug: tagSlug,
            },
            update: {},
          });
          tagConnections.push({ id: tag.id });
        }
      }

      // Create article
      const article = await prisma.article.create({
        data: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          author: data.author,
          categoryId: category.id,
          imageUrl: data.imageUrl,
          publishedAt: data.publishedAt || new Date(),
          featured: data.featured || false,
          source: data.source,
          sourceUrl: data.sourceUrl,
          sourceDomain: data.sourceDomain,
          tags: {
            connect: tagConnections,
          },
        },
        include: {
          category: true,
          tags: true,
        },
      });

      return transformArticle(article);
    } catch (error) {
      logger.error('Error creating article', { error, data });
      throw error;
    }
  },

  /**
   * Update an existing article
   */
  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      author: string;
      categorySlug: string;
      tags: string[];
      imageUrl: string;
      featured: boolean;
    }>
  ): Promise<Article> {
    try {
      const updateData: any = {};

      // Handle simple fields
      if (data.title) updateData.title = data.title;
      if (data.slug) updateData.slug = data.slug;
      if (data.excerpt) updateData.excerpt = data.excerpt;
      if (data.content) updateData.content = data.content;
      if (data.author) updateData.author = data.author;
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
      if (data.featured !== undefined) updateData.featured = data.featured;

      // Handle category update
      if (data.categorySlug) {
        const category = await prisma.category.findUnique({
          where: { slug: data.categorySlug },
        });
        if (category) {
          updateData.categoryId = category.id;
        }
      }

      // Handle tags update
      if (data.tags) {
        // First, disconnect all existing tags
        await prisma.article.update({
          where: { id },
          data: {
            tags: {
              set: [],
            },
          },
        });

        // Then connect new tags
        const tagConnections = [];
        for (const tagName of data.tags) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
          const tag = await prisma.tag.upsert({
            where: { slug: tagSlug },
            create: {
              name: tagName,
              slug: tagSlug,
            },
            update: {},
          });
          tagConnections.push({ id: tag.id });
        }
        updateData.tags = {
          connect: tagConnections,
        };
      }

      const article = await prisma.article.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          tags: true,
        },
      });

      return transformArticle(article);
    } catch (error) {
      logger.error('Error updating article', { error, id, data });
      throw error;
    }
  },

  /**
   * Delete an article
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.article.delete({
        where: { id },
      });
      logger.info('Article deleted', { id });
    } catch (error) {
      logger.error('Error deleting article', { error, id });
      throw error;
    }
  },

  /**
   * Get featured articles
   */
  async getFeatured(limit: number = 5): Promise<Article[]> {
    const result = await this.findAll(
      { featured: true },
      { field: 'publishedAt', order: 'desc' },
      { page: 1, limit }
    );
    return result.data;
  },

  /**
   * Search articles
   */
  async search(query: string, pagination?: PaginationOptions): Promise<PaginatedResult<Article>> {
    return this.findAll(
      { searchQuery: query },
      { field: 'publishedAt', order: 'desc' },
      pagination
    );
  },
};
