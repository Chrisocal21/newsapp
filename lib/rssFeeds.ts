import Parser from 'rss-parser';
import { Article } from '@/types/article';
import { logger } from './logger';

const parser = new Parser();

interface RSSFeed {
  url: string;
  source: string;
  category: string;
}

// Free RSS feeds that don't require API keys
const RSS_FEEDS: RSSFeed[] = [
  // BBC
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News', category: 'World' },
  { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC News', category: 'Business' },
  { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', source: 'BBC News', category: 'Technology' },
  { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', source: 'BBC News', category: 'Entertainment' },
  { url: 'http://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport', category: 'Sports' },
  
  // NPR
  { url: 'https://feeds.npr.org/1001/rss.xml', source: 'NPR', category: 'General' },
  { url: 'https://feeds.npr.org/1003/rss.xml', source: 'NPR', category: 'World' },
  { url: 'https://feeds.npr.org/1006/rss.xml', source: 'NPR', category: 'Business' },
  { url: 'https://feeds.npr.org/1019/rss.xml', source: 'NPR', category: 'Technology' },
  
  // Reuters
  { url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best', source: 'Reuters', category: 'General' },
  
  // TechCrunch
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Technology' },
  
  // Ars Technica
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica', category: 'Technology' },
  
  // The Verge
  { url: 'https://www.theverge.com/rss/index.xml', source: 'The Verge', category: 'Technology' },
];

/**
 * Fetch articles from a single RSS feed
 */
async function fetchRSSFeed(feed: RSSFeed, limit: number = 10): Promise<Article[]> {
  try {
    const rssFeed = await parser.parseURL(feed.url);
    
    return rssFeed.items
      .slice(0, limit)
      .map((item: any, index: number) => {
        const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();
        const urlHash = item.guid || item.link || '';
        const uniqueId = `rss-${feed.source.toLowerCase().replace(/\s+/g, '-')}-${publishedDate.getTime()}-${index}`;

        return {
          id: uniqueId,
          title: item.title || 'Untitled',
          slug: uniqueId,
          excerpt: item.contentSnippet || item.content?.substring(0, 200) || '',
          content: item.content || item.contentSnippet || '',
          author: item.creator || item.author || 'Staff',
          category: feed.category,
          tags: item.categories || [],
          publishedAt: publishedDate,
          updatedAt: publishedDate,
          featured: index === 0,
          source: feed.source,
          sourceUrl: item.link || '',
          sourceDomain: feed.source,
        };
      });
  } catch (error) {
    logger.error(`Error fetching RSS feed: ${feed.source}`, { error, url: feed.url });
    return [];
  }
}

/**
 * Fetch articles from all RSS feeds
 */
export async function fetchAllRSSFeeds(articlesPerFeed: number = 5): Promise<Article[]> {
  try {
    const feedPromises = RSS_FEEDS.map(feed => fetchRSSFeed(feed, articlesPerFeed));
    const feedResults = await Promise.allSettled(feedPromises);
    
    const articles = feedResults
      .filter((result): result is PromiseFulfilledResult<Article[]> => result.status === 'fulfilled')
      .flatMap(result => result.value);

    logger.info(`Fetched ${articles.length} articles from ${RSS_FEEDS.length} RSS feeds`);
    return articles;
  } catch (error) {
    logger.error('Error fetching RSS feeds', { error });
    return [];
  }
}

/**
 * Fetch articles from RSS feeds by category
 */
export async function fetchRSSByCategory(category: string, limit: number = 10): Promise<Article[]> {
  const categoryFeeds = RSS_FEEDS.filter(feed => 
    feed.category.toLowerCase() === category.toLowerCase()
  );

  if (categoryFeeds.length === 0) {
    return [];
  }

  try {
    const feedPromises = categoryFeeds.map(feed => fetchRSSFeed(feed, limit));
    const feedResults = await Promise.allSettled(feedPromises);
    
    const articles = feedResults
      .filter((result): result is PromiseFulfilledResult<Article[]> => result.status === 'fulfilled')
      .flatMap(result => result.value);

    return articles.slice(0, limit);
  } catch (error) {
    logger.error(`Error fetching RSS feeds for category: ${category}`, { error });
    return [];
  }
}

/**
 * Search across RSS feed articles
 */
export async function searchRSSFeeds(query: string, limit: number = 20): Promise<Article[]> {
  const allArticles = await fetchAllRSSFeeds(10);
  const lowerQuery = query.toLowerCase();
  
  return allArticles
    .filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}
