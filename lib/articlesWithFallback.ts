import { Article } from '@/types/article';
import { fetchAllCategoryArticles } from '@/lib/newsapi';
import { fetchNYTimesMostPopular, fetchNYTimesTopStories } from '@/lib/nytimes';
import { fetchHackerNewsStories } from '@/lib/hackernews';
// import { fetchAllRSSFeeds, fetchRSSByCategory } from '@/lib/rssFeeds';
import { mockArticles } from '@/lib/data/mockArticles';
import { logger } from '@/lib/logger';

/**
 * Get articles from multiple sources with fallback to mock data
 * Combines NYTimes, NewsAPI, and Hacker News for diverse content
 */
export const getArticlesWithFallback = async (): Promise<Article[]> => {
  const articles: Article[] = [];
  let hasNYTimes = false;
  let hasNewsAPI = false;
  let hasHackerNews = false;
  // let hasRSS = false;

  // Try to fetch from NYTimes
  try {
    const nytArticles = await fetchNYTimesMostPopular(7);
    if (nytArticles.length > 0) {
      articles.push(...nytArticles);
      hasNYTimes = true;
      logger.info('Successfully loaded NYTimes articles', { count: nytArticles.length });
    }
  } catch (error) {
    logger.warn('Failed to fetch NYTimes articles', { error });
  }

  // Try to fetch from NewsAPI
  try {
    const newsApiArticles = await fetchAllCategoryArticles();
    if (newsApiArticles.length > 0) {
      articles.push(...newsApiArticles);
      hasNewsAPI = true;
      logger.info('Successfully loaded NewsAPI articles', { count: newsApiArticles.length });
    }
  } catch (error) {
    logger.warn('Failed to fetch NewsAPI articles', { error });
  }

  // Try to fetch from Hacker News
  try {
    const hnArticles = await fetchHackerNewsStories(15);
    if (hnArticles.length > 0) {
      articles.push(...hnArticles);
      hasHackerNews = true;
      logger.info('Successfully loaded Hacker News articles', { count: hnArticles.length });
    }
  } catch (error) {
    logger.warn('Failed to fetch Hacker News articles', { error });
  }

  // RSS feeds temporarily disabled until rss-parser is installed
  // Try to fetch from RSS Feeds
  // try {
  //   const rssArticles = await fetchAllRSSFeeds(3); // 3 articles per feed
  //   if (rssArticles.length > 0) {
  //     articles.push(...rssArticles);
  //     hasRSS = true;
  //     logger.info('Successfully loaded RSS articles', { count: rssArticles.length });
  //   }
  // } catch (error) {
  //   logger.warn('Failed to fetch RSS articles', { error });
  // }

  // If we got articles from at least one source, return them
  if (articles.length > 0) {
    // Deduplicate by title
    const uniqueArticles = Array.from(
      new Map(articles.map(article => [article.title.toLowerCase(), article])).values()
    );
    
    // Sort by published date (newest first)
    uniqueArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    logger.info('Combined articles from sources', { 
      total: uniqueArticles.length,
      hasNYTimes,
      hasNewsAPI,
      hasHackerNews,
      // hasRSS
    });
    
    return uniqueArticles;
  }

  // Fallback to mock data if all APIs fail
  logger.warn('All APIs failed, using mock data');
  return mockArticles;
};

/**
 * Get articles by category with multi-source support
 */
export const getArticlesByCategoryWithFallback = async (
  category: string
): Promise<Article[]> => {
  const articles: Article[] = [];

  // Try NYTimes for category
  try {
    const nytArticles = await fetchNYTimesTopStories(category.toLowerCase());
    if (nytArticles.length > 0) {
      articles.push(...nytArticles);
    }
  } catch (error) {
    logger.warn(`Failed to fetch NYTimes for category ${category}`, { error });
  }

  // RSS feeds temporarily disabled
  // Try RSS feeds for category
  // try {
  //   const rssArticles = await fetchRSSByCategory(category, 10);
  //   if (rssArticles.length > 0) {
  //     articles.push(...rssArticles);
  //   }
  // } catch (error) {
  //   logger.warn(`Failed to fetch RSS for category ${category}`, { error });
  // }

  // If we have articles, return them
  if (articles.length > 0) {
    return articles;
  }

  // Fallback to filtering all articles
  try {
    const allArticles = await getArticlesWithFallback();
    return allArticles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    logger.error('Error filtering articles by category', { error, category });
    return mockArticles.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  }
};
