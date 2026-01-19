import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

interface NewsAPIArticle {
  source: { name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NYTimesArticle {
  uri: string;
  url: string;
  published_date: string;
  section: string;
  byline: string;
  title: string;
  abstract: string;
  media?: Array<{
    'media-metadata': Array<{ url: string; format: string }>;
  }>;
}

// Category mapping
const newsAPICategoryMap: Record<string, string> = {
  general: 'world',
  business: 'business',
  entertainment: 'entertainment',
  health: 'health',
  science: 'science',
  sports: 'sports',
  technology: 'technology',
};

const nytimesSectionMap: Record<string, string> = {
  world: 'world',
  us: 'world',
  politics: 'politics',
  business: 'business',
  technology: 'technology',
  sports: 'sports',
  arts: 'entertainment',
  science: 'science',
  health: 'health',
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

async function fetchNewsAPI(category: string, count: number = 10) {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.log('⚠ NewsAPI key not found, skipping...');
    return [];
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey,
        category,
        language: 'en',
        pageSize: count,
      },
    });

    return response.data.articles || [];
  } catch (error) {
    console.error(`✗ Failed to fetch from NewsAPI (${category}):`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function fetchNYTimes(section: string = 'home', count: number = 10) {
  const apiKey = process.env.NYTIMES_API_KEY;
  if (!apiKey) {
    console.log('⚠ NY Times API key not found, skipping...');
    return [];
  }

  try {
    const response = await axios.get(
      `https://api.nytimes.com/svc/topstories/v2/${section}.json`,
      {
        params: { 'api-key': apiKey },
      }
    );

    return (response.data.results || []).slice(0, count);
  } catch (error) {
    console.error(`✗ Failed to fetch from NY Times (${section}):`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function saveNewsAPIArticle(article: NewsAPIArticle, categorySlug: string) {
  if (!article.title || !article.description) return false;

  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.log(`✗ Category not found: ${categorySlug}`);
      return false;
    }

    const slug = generateSlug(article.title);
    
    // Check if article already exists
    const existing = await prisma.article.findUnique({
      where: { slug },
    });

    if (existing) {
      return false; // Skip duplicates
    }

    await prisma.article.create({
      data: {
        title: article.title,
        slug,
        excerpt: article.description.substring(0, 300),
        content: article.content || article.description,
        author: article.author || 'Staff Writer',
        categoryId: category.id,
        imageUrl: article.urlToImage,
        publishedAt: new Date(article.publishedAt),
        featured: false,
        source: article.source.name,
        sourceUrl: article.url,
        sourceDomain: extractDomain(article.url),
      },
    });

    return true;
  } catch (error) {
    console.error(`✗ Failed to save article: ${article.title.substring(0, 50)}...`);
    return false;
  }
}

async function saveNYTimesArticle(article: NYTimesArticle, defaultCategorySlug: string = 'world') {
  if (!article.title || !article.abstract) return false;

  try {
    const sectionSlug = nytimesSectionMap[article.section?.toLowerCase()] || defaultCategorySlug;
    const category = await prisma.category.findUnique({
      where: { slug: sectionSlug },
    });

    if (!category) {
      console.log(`✗ Category not found: ${sectionSlug}`);
      return false;
    }

    const slug = generateSlug(article.title);
    
    // Check if article already exists
    const existing = await prisma.article.findUnique({
      where: { slug },
    });

    if (existing) {
      return false; // Skip duplicates
    }

    // Extract image
    const imageUrl = article.media?.[0]?.['media-metadata']?.[2]?.url || null;

    // Extract author
    const author = article.byline?.replace(/^By\s+/i, '').trim() || 'The New York Times';

    await prisma.article.create({
      data: {
        title: article.title,
        slug,
        excerpt: article.abstract.substring(0, 300),
        content: article.abstract,
        author,
        categoryId: category.id,
        imageUrl,
        publishedAt: new Date(article.published_date),
        featured: false,
        source: 'The New York Times',
        sourceUrl: article.url,
        sourceDomain: 'nytimes.com',
      },
    });

    return true;
  } catch (error) {
    console.error(`✗ Failed to save NY Times article: ${article.title.substring(0, 50)}...`);
    return false;
  }
}

async function main() {
  console.log('🔄 Fetching news from external sources...\n');

  let totalAdded = 0;

  // Fetch from NewsAPI for various categories
  console.log('📰 Fetching from NewsAPI...');
  for (const [apiCategory, dbCategory] of Object.entries(newsAPICategoryMap)) {
    const articles = await fetchNewsAPI(apiCategory, 5);
    console.log(`  Found ${articles.length} articles in ${apiCategory}`);
    
    for (const article of articles) {
      const saved = await saveNewsAPIArticle(article, dbCategory);
      if (saved) {
        totalAdded++;
        console.log(`  ✓ ${article.title.substring(0, 60)}...`);
      }
    }
  }

  // Fetch from NY Times
  console.log('\n📰 Fetching from NY Times...');
  const nytSections = ['home', 'world', 'technology', 'business', 'science', 'health', 'sports'];
  
  for (const section of nytSections) {
    const articles = await fetchNYTimes(section, 5);
    console.log(`  Found ${articles.length} articles in ${section}`);
    
    for (const article of articles) {
      const saved = await saveNYTimesArticle(article);
      if (saved) {
        totalAdded++;
        console.log(`  ✓ ${article.title.substring(0, 60)}...`);
      }
    }
  }

  console.log(`\n✅ Fetch completed! Added ${totalAdded} new articles to database.`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
