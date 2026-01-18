import { Article } from '@/types/article';
import { logger } from './logger';

interface HNItem {
  id: number;
  title: string;
  url?: string;
  text?: string;
  by: string;
  time: number;
  score: number;
}

interface HNSearchResult {
  hits: Array<{
    objectID: string;
    title: string;
    url: string;
    author: string;
    created_at: string;
    story_text: string;
    points: number;
  }>;
}

const HN_ALGOLIA_API = 'https://hn.algolia.com/api/v1';

/**
 * Fetch top stories from Hacker News
 */
export async function fetchHackerNewsStories(limit: number = 20): Promise<Article[]> {
  try {
    const response = await fetch(
      `${HN_ALGOLIA_API}/search?tags=front_page&hitsPerPage=${limit * 2}`, // Fetch more to account for filtering
      { next: { revalidate: 600 } }
    );

    if (!response.ok) {
      throw new Error(`HN API error: ${response.status}`);
    }

    const data: HNSearchResult = await response.json();
    
    return data.hits
      .filter(hit => hit.url && hit.title)
      // Filter out articles with no meaningful excerpt (less than 50 chars)
      .filter(hit => hit.story_text && hit.story_text.length > 50)
      .slice(0, limit) // Take only the requested amount after filtering
      .map((hit, index) => transformHNArticle(hit, index));
  } catch (error) {
    logger.error('Error fetching Hacker News stories', { error });
    return [];
  }
}

/**
 * Search Hacker News stories
 */
export async function searchHackerNews(query: string, limit: number = 20): Promise<Article[]> {
  try {
    const response = await fetch(
      `${HN_ALGOLIA_API}/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${limit * 2}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error(`HN Search API error: ${response.status}`);
    }

    const data: HNSearchResult = await response.json();
    
    return data.hits
      .filter(hit => hit.url && hit.title)
      // Filter out articles with no meaningful excerpt
      .filter(hit => hit.story_text && hit.story_text.length > 50)
      .slice(0, limit)
      .map((hit, index) => transformHNArticle(hit, index));
  } catch (error) {
    logger.error('Error searching Hacker News', { error, query });
    return [];
  }
}

/**
 * Transform HN article to our Article type
 */
function transformHNArticle(hit: HNSearchResult['hits'][0], index: number): Article {
  const urlHash = hit.objectID;
  const publishedDate = new Date(hit.created_at);
  
  // Clean up the story text to create a better excerpt
  const cleanExcerpt = hit.story_text 
    ? hit.story_text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&#x2F;/g, '/') // Decode forward slash
        .replace(/&#x27;/g, "'") // Decode apostrophe
        .replace(/&quot;/g, '"') // Decode quotes
        .replace(/&amp;/g, '&') // Decode ampersand
        .replace(/&lt;/g, '<') // Decode less than
        .replace(/&gt;/g, '>') // Decode greater than
        .replace(/&#x3D;/g, '=') // Decode equals
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .substring(0, 300) + '...' // Limit to 300 chars
    : `Popular story with ${hit.points} points on Hacker News.`;

  return {
    id: `hn-${urlHash}`,
    title: hit.title,
    slug: `hn-${urlHash}`,
    excerpt: cleanExcerpt,
    content: hit.story_text || '',
    author: hit.author || 'HN User',
    category: 'Technology',
    tags: ['hacker-news', 'tech'],
    publishedAt: publishedDate,
    updatedAt: publishedDate,
    featured: index === 0,
    source: 'Hacker News',
    sourceUrl: hit.url,
    sourceDomain: new URL(hit.url).hostname,
  };
}
