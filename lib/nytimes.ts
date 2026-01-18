import { Article } from '@/types/article';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors';

const NYTIMES_API_KEY = process.env.NYTIMES_API_KEY;
const NYTIMES_BASE_URL = 'https://api.nytimes.com/svc';

interface NYTimesArticle {
  uri: string;
  url: string;
  id: number;
  asset_id: number;
  source: string;
  published_date: string;
  updated: string;
  section: string;
  subsection: string;
  nytdsection: string;
  adx_keywords: string;
  byline: string;
  type: string;
  title: string;
  abstract: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  media: Array<{
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
    'media-metadata': Array<{
      url: string;
      format: string;
      height: number;
      width: number;
    }>;
  }>;
}

interface NYTimesResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: NYTimesArticle[];
}

// Map NYTimes section to our categories
const sectionToCategoryMap: Record<string, string> = {
  world: 'World',
  us: 'World',
  politics: 'Politics',
  business: 'Business',
  technology: 'Technology',
  sports: 'Sports',
  arts: 'Entertainment',
  science: 'Science',
  health: 'Health',
  opinion: 'World',
  default: 'World',
};

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
};

// Extract author from byline
const extractAuthor = (byline: string): string => {
  if (!byline) return 'The New York Times';
  // Remove "By " prefix
  return byline.replace(/^By\s+/i, '').trim() || 'The New York Times';
};

// Generate tags from keywords
const generateTags = (keywords: string): string[] => {
  if (!keywords) return [];
  return keywords
    .split(';')
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0)
    .slice(0, 5);
};

// Transform NYTimes article to our Article type
const transformArticle = (nytArticle: NYTimesArticle, index: number): Article | null => {
  if (!nytArticle.title || !nytArticle.abstract || !nytArticle.url) {
    return null;
  }

  const publishedDate = new Date(nytArticle.published_date);
  const section = nytArticle.section?.toLowerCase() || 'default';
  const category = sectionToCategoryMap[section] || sectionToCategoryMap.default;

  // Get image URL from media
  let imageUrl: string | undefined;
  if (nytArticle.media && nytArticle.media.length > 0) {
    const mediaItem = nytArticle.media[0];
    if (mediaItem['media-metadata'] && mediaItem['media-metadata'].length > 0) {
      // Get the largest available image
      const largestImage = mediaItem['media-metadata'].reduce((prev, current) => 
        (current.width > prev.width) ? current : prev
      );
      imageUrl = largestImage.url;
    }
  }

  const excerpt = nytArticle.abstract.length > 300
    ? nytArticle.abstract.substring(0, 297) + '...'
    : nytArticle.abstract;

  // Generate unique ID using article URL or ID
  const uniqueId = nytArticle.id || nytArticle.asset_id || nytArticle.url.split('/').pop() || Date.now();

  return {
    id: `nyt-${uniqueId}-${index}`,
    title: nytArticle.title,
    slug: generateSlug(nytArticle.title),
    excerpt,
    content: nytArticle.abstract, // NYTimes doesn't provide full content, use abstract
    author: extractAuthor(nytArticle.byline),
    category,
    tags: generateTags(nytArticle.adx_keywords),
    imageUrl,
    publishedAt: publishedDate,
    updatedAt: new Date(nytArticle.updated || nytArticle.published_date),
    featured: index < 2, // First 2 NYTimes articles are featured
    source: 'The New York Times',
    sourceUrl: nytArticle.url,
    sourceDomain: 'nytimes.com',
  };
};

// Fetch most popular articles from NYTimes
export const fetchNYTimesMostPopular = async (
  period: 1 | 7 | 30 = 7
): Promise<Article[]> => {
  if (!NYTIMES_API_KEY) {
    logger.error('NYTimes API key not found');
    throw new AppError('NYTimes API key not configured', 500);
  }

  try {
    const url = `${NYTIMES_BASE_URL}/mostpopular/v2/viewed/${period}.json?api-key=${NYTIMES_API_KEY}`;
    
    logger.info('Fetching most popular articles from NYTimes', { period });
    
    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('NYTimes API request failed', { 
        status: response.status, 
        error: errorData 
      });
      throw new AppError(`NYTimes API error: ${response.statusText}`, response.status);
    }

    const data: NYTimesResponse = await response.json();

    if (data.status !== 'OK') {
      logger.error('NYTimes API returned error status', { status: data.status });
      throw new AppError('Failed to fetch NYTimes articles', 500);
    }

    const articles = data.results
      .map((article, index) => transformArticle(article, index))
      .filter((article): article is Article => article !== null);

    logger.info('Successfully fetched NYTimes articles', { 
      count: articles.length,
      period 
    });

    return articles;
  } catch (error) {
    logger.error('Error fetching NYTimes articles', { error });
    throw error instanceof AppError 
      ? error 
      : new AppError('Failed to fetch NYTimes articles', 500);
  }
};

// Fetch top stories from NYTimes by section
export const fetchNYTimesTopStories = async (
  section: string = 'home'
): Promise<Article[]> => {
  if (!NYTIMES_API_KEY) {
    throw new AppError('NYTimes API key not configured', 500);
  }

  try {
    const url = `${NYTIMES_BASE_URL}/topstories/v2/${section}.json?api-key=${NYTIMES_API_KEY}`;
    
    logger.info('Fetching top stories from NYTimes', { section });
    
    const response = await fetch(url, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      throw new AppError(`NYTimes API error: ${response.statusText}`, response.status);
    }

    const data: NYTimesResponse = await response.json();

    const articles = data.results
      .slice(0, 20) // Limit to 20 articles
      .map((article, index) => transformArticle(article, index))
      .filter((article): article is Article => article !== null);

    logger.info('Successfully fetched NYTimes top stories', { 
      count: articles.length,
      section 
    });

    return articles;
  } catch (error) {
    logger.error('Error fetching NYTimes top stories', { error });
    throw error instanceof AppError 
      ? error 
      : new AppError('Failed to fetch NYTimes top stories', 500);
  }
};

// Search NYTimes articles
export const searchNYTimesArticles = async (
  query: string,
  page: number = 0
): Promise<Article[]> => {
  if (!NYTIMES_API_KEY) {
    throw new AppError('NYTimes API key not configured', 500);
  }

  try {
    const url = `${NYTIMES_BASE_URL}/search/v2/articlesearch.json?q=${encodeURIComponent(query)}&page=${page}&api-key=${NYTIMES_API_KEY}`;
    
    logger.info('Searching NYTimes articles', { query, page });
    
    const response = await fetch(url, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      throw new AppError(`NYTimes API error: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    
    if (!data.response || !data.response.docs) {
      return [];
    }

    const articles = data.response.docs
      .map((doc: any, index: number) => {
        const publishedDate = new Date(doc.pub_date);
        const section = doc.section_name?.toLowerCase() || 'default';
        const category = sectionToCategoryMap[section] || sectionToCategoryMap.default;

        const searchId = doc._id || doc.web_url.split('/').pop() || `search-${index}`;
        return {
          id: `nyt-search-${searchId}`,
          title: doc.headline?.main || 'Untitled',
          slug: generateSlug(doc.headline?.main || 'untitled'),
          excerpt: doc.abstract || doc.snippet || '',
          content: doc.lead_paragraph || doc.abstract || doc.snippet || '',
          author: doc.byline?.original ? extractAuthor(doc.byline.original) : 'The New York Times',
          category,
          tags: doc.keywords?.slice(0, 5).map((k: any) => k.value.toLowerCase()) || [],
          imageUrl: doc.multimedia && doc.multimedia.length > 0 
            ? `https://www.nytimes.com/${doc.multimedia[0].url}`
            : undefined,
          publishedAt: publishedDate,
          updatedAt: publishedDate,
          featured: false,
          source: 'The New York Times',
          sourceUrl: doc.web_url,
          sourceDomain: 'nytimes.com',
        };
      })
      .filter((article: Article) => article.title && article.excerpt);

    logger.info('NYTimes search completed', { count: articles.length, query });

    return articles;
  } catch (error) {
    logger.error('Error searching NYTimes articles', { error });
    throw error instanceof AppError 
      ? error 
      : new AppError('Failed to search NYTimes articles', 500);
  }
};
