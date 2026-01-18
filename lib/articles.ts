import { Article } from '@/types/article';
import { mockArticles } from '@/lib/data/mockArticles';
import { logger } from '@/lib/logger';

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

// Get all articles
export const getAllArticles = (): Article[] => {
  logger.debug('Fetching all articles', { count: mockArticles.length });
  return mockArticles;
};

// Get article by ID
export const getArticleById = (id: string): Article | null => {
  const article = mockArticles.find((article) => article.id === id);
  logger.debug('Fetching article by ID', { id, found: !!article });
  return article || null;
};

// Get article by slug
export const getArticleBySlug = (slug: string): Article | null => {
  const article = mockArticles.find((article) => article.slug === slug);
  logger.debug('Fetching article by slug', { slug, found: !!article });
  return article || null;
};

// Get featured articles
export const getFeaturedArticles = (): Article[] => {
  const featured = mockArticles.filter((article) => article.featured);
  logger.debug('Fetching featured articles', { count: featured.length });
  return featured;
};

// Filter articles
export const filterArticles = (
  articles: Article[],
  filters: FilterOptions
): Article[] => {
  let filtered = [...articles];

  if (filters.category) {
    filtered = filtered.filter(
      (article) => article.category === filters.category
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((article) =>
      filters.tags!.some((tag) => article.tags.includes(tag))
    );
  }

  if (filters.featured !== undefined) {
    filtered = filtered.filter((article) => article.featured === filters.featured);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower)
    );
  }

  logger.debug('Filtered articles', { 
    originalCount: articles.length, 
    filteredCount: filtered.length,
    filters 
  });

  return filtered;
};

// Sort articles
export const sortArticles = (
  articles: Article[],
  sortBy: SortOption = 'newest'
): Article[] => {
  const sorted = [...articles];

  switch (sortBy) {
    case 'newest':
      sorted.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
      break;
    case 'oldest':
      sorted.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
      break;
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  logger.debug('Sorted articles', { sortBy, count: sorted.length });
  return sorted;
};

// Paginate articles
export const paginateArticles = (
  articles: Article[],
  options: PaginationOptions
): ArticleListResult => {
  const { page, limit } = options;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedArticles = articles.slice(startIndex, endIndex);
  const total = articles.length;
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  logger.debug('Paginated articles', { 
    page, 
    limit, 
    total, 
    totalPages,
    returned: paginatedArticles.length 
  });

  return {
    articles: paginatedArticles,
    total,
    page,
    totalPages,
    hasMore,
  };
};

// Get articles with filtering, sorting, and pagination
export const getArticles = (
  filters?: FilterOptions,
  sortBy: SortOption = 'newest',
  pagination?: PaginationOptions
): ArticleListResult => {
  let articles = getAllArticles();

  // Apply filters
  if (filters) {
    articles = filterArticles(articles, filters);
  }

  // Apply sorting
  articles = sortArticles(articles, sortBy);

  // Apply pagination
  if (pagination) {
    return paginateArticles(articles, pagination);
  }

  // Return all if no pagination
  return {
    articles,
    total: articles.length,
    page: 1,
    totalPages: 1,
    hasMore: false,
  };
};

// Get articles by category
export const getArticlesByCategory = (
  category: string,
  pagination?: PaginationOptions
): ArticleListResult => {
  return getArticles({ category }, 'newest', pagination);
};

// Search articles
export const searchArticles = (
  query: string,
  pagination?: PaginationOptions
): ArticleListResult => {
  return getArticles({ search: query }, 'newest', pagination);
};
