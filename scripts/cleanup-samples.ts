import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting sample articles...\n');

  // Delete articles with sample data characteristics
  const result = await prisma.article.deleteMany({
    where: {
      OR: [
        { source: 'News Network' },
        { sourceDomain: 'newsnetwork.com' },
        { sourceUrl: { contains: 'example.com' } },
      ],
    },
  });

  console.log(`✅ Deleted ${result.count} sample articles`);
  console.log('📰 Only real news articles remain in the database\n');
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
