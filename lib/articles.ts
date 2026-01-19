import { Article } from '@/types/article';
import { logger } from '@/lib/logger';
import { articleRepository, ArticleFilters, ArticleSortOptions } from './repositories/articleRepository';

export type SortOption = 'newest' | 'oldest' | 'title';
export type FilterOptions = {
  category?: string;
  tags?: string[];
  featured?: boolean;
  search?: string;
};

export type PaginationOptions = {
  page: number;
  limit: number;
};

export type ArticleListResult = {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};

/**
 * Convert SortOption to ArticleSortOptions
 */
function mapSortOption(sortBy: SortOption): ArticleSortOptions {
  switch (sortBy) {
    case 'newest':
      return { field: 'publishedAt', order: 'desc' };
    case 'oldest':
      return { field: 'publishedAt', order: 'asc' };
    case 'title':
      return { field: 'title', order: 'asc' };
    default:
      return { field: 'publishedAt', order: 'desc' };
  }
}

/**
 * Convert FilterOptions to ArticleFilters
 */
function mapFilters(filters?: FilterOptions): ArticleFilters {
  if (!filters) return {};

  return {
    categorySlug: filters.category,
    tags: filters.tags,
    featured: filters.featured,
    searchQuery: filters.search,
  };
}

// Get all articles
export const getAllArticles = async (): Promise<Article[]> => {
  try {
    const result = await articleRepository.findAll(
      {},
      { field: 'publishedAt', order: 'desc' },
      { page: 1, limit: 100 }
    );
    logger.debug('Fetching all articles', { count: result.data.length });
    return result.data;
  } catch (error) {
    logger.error('Error fetching all articles', { error });
    return [];
  }
};

// Get article by ID
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const article = await articleRepository.findById(id);
    logger.debug('Fetching article by ID', { id, found: !!article });
    return article;
  } catch (error) {
    logger.error('Error fetching article by ID', { error, id });
    return null;
  }
};

// Get article by slug
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const article = await articleRepository.findBySlug(slug);
    logger.debug('Fetching article by slug', { slug, found: !!article });
    return article;
  } catch (error) {
    logger.error('Error fetching article by slug', { error, slug });
    return null;
  }
};

// Get featured articles
export const getFeaturedArticles = async (limit: number = 5): Promise<Article[]> => {
  try {
    const featured = await articleRepository.getFeatured(limit);
    logger.debug('Fetching featured articles', { count: featured.length });
    return featured;
  } catch (error) {
    logger.error('Error fetching featured articles', { error });
    return [];
  }
};

// Get articles with filtering, sorting, and pagination
export const getArticles = async (
  filters?: FilterOptions,
  sortBy: SortOption = 'newest',
  pagination?: PaginationOptions
): Promise<ArticleListResult> => {
  try {
    const articleFilters = mapFilters(filters);
    const sortOptions = mapSortOption(sortBy);
    const paginationOptions = pagination || { page: 1, limit: 10 };

    const result = await articleRepository.findAll(
      articleFilters,
      sortOptions,
      paginationOptions
    );

    logger.debug('Fetched articles', {
      filters,
      sortBy,
      pagination,
      returned: result.data.length,
      total: result.pagination.total,
    });

    return {
      articles: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      totalPages: result.pagination.totalPages,
      hasMore: result.pagination.hasNext,
    };
  } catch (error) {
    logger.error('Error fetching articles', { error, filters, sortBy, pagination });
    return {
      articles: [],
      total: 0,
      page: pagination?.page || 1,
      totalPages: 0,
      hasMore: false,
    };
  }
};

// Get articles by category
export const getArticlesByCategory = async (
  category: string,
  pagination?: PaginationOptions
): Promise<ArticleListResult> => {
  return getArticles({ category }, 'newest', pagination);
};

// Search articles
export const searchArticles = async (
  query: string,
  pagination?: PaginationOptions
): Promise<ArticleListResult> => {
  try {
    const paginationOptions = pagination || { page: 1, limit: 10 };
    const result = await articleRepository.search(query, paginationOptions);

    logger.debug('Search articles', {
      query,
      pagination,
      returned: result.data.length,
      total: result.pagination.total,
    });

    return {
      articles: result.data,
      total: result.pagination.total,
      page: result.pagination.page,
      totalPages: result.pagination.totalPages,
      hasMore: result.pagination.hasNext,
    };
  } catch (error) {
    logger.error('Error searching articles', { error, query, pagination });
    return {
      articles: [],
      total: 0,
      page: pagination?.page || 1,
      totalPages: 0,
      hasMore: false,
    };
  }
};
