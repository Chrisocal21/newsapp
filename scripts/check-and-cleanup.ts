import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, let's see what articles we have
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      source: true,
      sourceDomain: true,
      sourceUrl: true,
    },
    take: 80,
  });

  console.log(`\n📊 Found ${articles.length} articles total\n`);

  // Group by source
  type ArticleType = typeof articles[number];
  const sources = articles.reduce((acc: Record<string, ArticleType[]>, article: ArticleType) => {
    const source = article.source || 'Unknown';
    if (!acc[source]) acc[source] = [];
    acc[source].push(article);
    return acc;
  }, {} as Record<string, ArticleType[]>);

  console.log('Sources in database:');
  for (const [source, arts] of Object.entries(sources)) {
    const articleList = arts as ArticleType[];
    console.log(`  ${source}: ${articleList.length} articles`);
  }

  // Find and delete sample articles (those from seed.ts)
  console.log('\n🗑️  Looking for sample articles to delete...\n');
  
  const sampleArticles = articles.filter((a: ArticleType) => 
    a.sourceUrl?.includes('example.com') || 
    a.sourceDomain === 'newsnetwork.com'
  );

  if (sampleArticles.length > 0) {
    console.log(`Found ${sampleArticles.length} sample articles:`);
    sampleArticles.forEach((a: ArticleType) => {
      console.log(`  - ${a.title.substring(0, 60)}...`);
    });

    const result = await prisma.article.deleteMany({
      where: {
        id: {
          in: sampleArticles.map((a: ArticleType) => a.id),
        },
      },
    });

    console.log(`\n✅ Deleted ${result.count} sample articles`);
  } else {
    console.log('No sample articles found - database only has real news!');
  }

  const remaining = await prisma.article.count();
  console.log(`\n📰 ${remaining} real news articles remain in the database\n`);
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
