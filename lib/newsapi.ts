import { Article } from '@/types/article';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

// Map NewsAPI category to our categories
const categoryMap: Record<string, string> = {
  general: 'World',
  business: 'Business',
  entertainment: 'Entertainment',
  health: 'Health',
  science: 'Science',
  sports: 'Sports',
  technology: 'Technology',
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
};

// Extract domain from URL
const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return '';
  }
};

// Generate tags from title and description
const generateTags = (title: string, description: string | null): string[] => {
  const text = `${title} ${description || ''}`.toLowerCase();
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  
  const words = text
    .match(/\b[a-z]{4,}\b/g) || [];
  
  const tags = [...new Set(words)]
    .filter(word => !commonWords.includes(word))
    .slice(0, 5);
  
  return tags;
};

// Transform NewsAPI article to our Article type
const transformArticle = (newsArticle: NewsAPIArticle, category: string, index: number): Article | null => {
  if (!newsArticle.title || !newsArticle.description || !newsArticle.url) {
    return null;
  }

  const publishedDate = new Date(newsArticle.publishedAt);
  const excerpt = newsArticle.description.length > 300 
    ? newsArticle.description.substring(0, 297) + '...'
    : newsArticle.description;

  // Use content or description for preview (max 500 chars)
  const content = newsArticle.content 
    ? newsArticle.content.substring(0, 500)
    : newsArticle.description;

  // Generate unique ID using URL hash
  const urlHash = newsArticle.url.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return {
    id: `newsapi-${category}-${urlHash}-${index}`,
    title: newsArticle.title,
    slug: generateSlug(newsArticle.title),
    excerpt,
    content,
    author: newsArticle.author || 'Staff Writer',
    category: categoryMap[category] || 'World',
    tags: generateTags(newsArticle.title, newsArticle.description),
    imageUrl: newsArticle.urlToImage || undefined,
    publishedAt: publishedDate,
    updatedAt: publishedDate,
    featured: index < 3, // First 3 articles are featured
    source: newsArticle.source.name,
    sourceUrl: newsArticle.url,
    sourceDomain: extractDomain(newsArticle.url),
  };
};

// Fetch articles from NewsAPI
export const fetchNewsArticles = async (
  category: string = 'general',
  pageSize: number = 20
): Promise<Article[]> => {
  if (!NEWSAPI_KEY) {
    logger.error('NewsAPI key not found');
    throw new AppError('NewsAPI key not configured', 500);
  }

  try {
    const url = `${NEWSAPI_BASE_URL}/top-headlines?country=us&category=${category}&pageSize=${pageSize}&apiKey=${NEWSAPI_KEY}`;
    
    logger.info('Fetching articles from NewsAPI', { category, pageSize });
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('NewsAPI request failed', { 
        status: response.status, 
        error: errorData 
      });
      throw new AppError(`NewsAPI error: ${response.statusText}`, response.status);
    }

    const data: NewsAPIResponse = await response.json();

    if (data.status !== 'ok') {
      logger.error('NewsAPI returned error status', { status: data.status });
      throw new AppError('Failed to fetch news articles', 500);
    }

    const articles = data.articles
      .map((article, index) => transformArticle(article, category, index))
      .filter((article): article is Article => article !== null);

    logger.info('Successfully fetched articles', { 
      count: articles.length,
      category 
    });

    return articles;
  } catch (error) {
    logger.error('Error fetching news articles', { error });
    throw error instanceof AppError 
      ? error 
      : new AppError('Failed to fetch news articles', 500);
  }
};

// Fetch articles from multiple categories
export const fetchAllCategoryArticles = async (): Promise<Article[]> => {
  const categories = ['general', 'business', 'technology', 'sports', 'health', 'science', 'entertainment'];
  
  try {
    const articlePromises = categories.map(category => 
      fetchNewsArticles(category, 5).catch(error => {
        logger.warn(`Failed to fetch ${category} articles`, { error });
        return [];
      })
    );

    const articleArrays = await Promise.all(articlePromises);
    const allArticles = articleArrays.flat();

    // Sort by published date
    allArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    return allArticles;
  } catch (error) {
    logger.error('Error fetching all category articles', { error });
    throw new AppError('Failed to fetch news articles', 500);
  }
};

// Search articles
export const searchNewsArticles = async (query: string, pageSize: number = 20): Promise<Article[]> => {
  if (!NEWSAPI_KEY) {
    throw new AppError('NewsAPI key not configured', 500);
  }

  try {
    const url = `${NEWSAPI_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWSAPI_KEY}`;
    
    logger.info('Searching articles', { query, pageSize });
    
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new AppError(`NewsAPI error: ${response.statusText}`, response.status);
    }

    const data: NewsAPIResponse = await response.json();

    const articles = data.articles
      .map((article, index) => transformArticle(article, 'general', index))
      .filter((article): article is Article => article !== null);

    logger.info('Search completed', { count: articles.length, query });

    return articles;
  } catch (error) {
    logger.error('Error searching articles', { error });
    throw error instanceof AppError 
      ? error 
      : new AppError('Failed to search news articles', 500);
  }
};
