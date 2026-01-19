import '../lib/db';
import { prisma } from '../lib/db';

const categories = [
  { name: 'World', slug: 'world', description: 'International news and global events' },
  { name: 'Politics', slug: 'politics', description: 'Political news and analysis' },
  { name: 'Business', slug: 'business', description: 'Business, finance, and economy' },
  { name: 'Technology', slug: 'technology', description: 'Tech news and innovation' },
  { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
  { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and culture' },
  { name: 'Science', slug: 'science', description: 'Science and research' },
  { name: 'Health', slug: 'health', description: 'Health and wellness news' },
];

const tags = [
  { name: 'Breaking News', slug: 'breaking-news' },
  { name: 'Analysis', slug: 'analysis' },
  { name: 'Opinion', slug: 'opinion' },
  { name: 'Investigation', slug: 'investigation' },
  { name: 'Featured', slug: 'featured' },
];

const sampleArticles = [
  { title: 'AI Revolution: How Machine Learning is Transforming Industries', category: 'technology', excerpt: 'Artificial intelligence and machine learning are reshaping how businesses operate across all sectors.', content: 'Artificial intelligence and machine learning technologies are fundamentally transforming how industries operate. Companies are leveraging AI to automate processes, gain insights from data, and create innovative products across healthcare, finance, and manufacturing sectors.', author: 'Sarah Johnson', tags: ['breaking-news', 'analysis'], featured: true, daysAgo: 3 },
  { title: 'Global Climate Summit Reaches Historic Agreement', category: 'world', excerpt: 'World leaders commit to ambitious carbon reduction targets at landmark climate conference.', content: 'Representatives from 195 countries have reached a groundbreaking agreement on climate action. The accord includes binding commitments to reduce carbon emissions by 50% by 2030 and achieve net-zero by 2050.', author: 'Michael Chen', tags: ['breaking-news', 'featured'], featured: true, daysAgo: 2 },
  { title: 'The Future of Remote Work: Trends Shaping 2026', category: 'business', excerpt: 'As hybrid work becomes the norm, companies are reimagining office spaces and collaboration.', content: 'The workplace continues to evolve with hybrid models becoming standard. Companies are investing in technology to support distributed teams while maintaining company culture and productivity.', author: 'Emily Rodriguez', tags: ['analysis'], featured: false, daysAgo: 5 },
  { title: 'Breakthrough in Quantum Computing Announced', category: 'technology', excerpt: 'Scientists achieve stable qubits at room temperature, marking major milestone.', content: 'Researchers have successfully demonstrated quantum computing operations at room temperature, eliminating the need for extreme cooling. This breakthrough could accelerate practical quantum computing applications.', author: 'Dr. James Wilson', tags: ['breaking-news', 'featured'], featured: true, daysAgo: 1 },
  { title: 'New Study Links Mediterranean Diet to Longevity', category: 'health', excerpt: 'Comprehensive 20-year study shows significant health benefits from traditional diet.', content: 'A landmark study following 100,000 participants over two decades reveals that adherence to a Mediterranean diet pattern reduces mortality risk by 23% and significantly lowers cardiovascular disease.', author: 'Dr. Maria Gonzalez', tags: ['analysis'], featured: false, daysAgo: 4 },
  { title: 'Electric Vehicle Sales Surge Past Traditional Cars', category: 'business', excerpt: 'EVs outsell gas-powered vehicles for the first time in major markets.', content: 'Electric vehicle sales have overtaken traditional combustion engines in several key markets, signaling a historic shift in the automotive industry. Infrastructure improvements and declining battery costs drive adoption.', author: 'Alex Kim', tags: ['breaking-news'], featured: true, daysAgo: 1 },
  { title: 'NASA Confirms Water Ice Deposits on Mars', category: 'science', excerpt: 'Latest Mars rover findings reveal vast underground ice reserves.', content: 'NASAs Perseverance rover has discovered extensive water ice deposits beneath the Martian surface, potentially providing crucial resources for future human missions to the red planet.', author: 'Jennifer Park', tags: ['breaking-news', 'featured'], featured: true, daysAgo: 2 },
  { title: 'Premier League: Dramatic Final Day Decides Champion', category: 'sports', excerpt: 'Title race goes down to the wire with last-minute goals deciding the winner.', content: 'The most thrilling Premier League season finale in years saw three teams separated by just two points going into the final matchday. A stunning comeback victory secured the championship.', author: 'Tom Harrison', tags: ['breaking-news'], featured: false, daysAgo: 1 },
  { title: 'New Archaeological Discovery Rewrites Ancient History', category: 'world', excerpt: 'Previously unknown civilization uncovered in South America.', content: 'Archaeologists have discovered evidence of a sophisticated pre-Columbian civilization in the Amazon basin, complete with advanced urban planning and agricultural systems.', author: 'Dr. Carlos Mendez', tags: ['investigation', 'featured'], featured: false, daysAgo: 6 },
  { title: 'Streaming Wars: Major Platform Announces Merger', category: 'entertainment', excerpt: 'Industry consolidation continues as two major players join forces.', content: 'In a move that will reshape the streaming landscape, two leading platforms have announced plans to merge, creating a service with over 200 million subscribers worldwide.', author: 'Rachel Green', tags: ['breaking-news'], featured: false, daysAgo: 3 },
  { title: 'Breakthrough Gene Therapy Approved for Rare Disease', category: 'health', excerpt: 'FDA approves revolutionary treatment offering hope to thousands.', content: 'A groundbreaking gene therapy has received FDA approval for treating a previously incurable genetic disorder. The one-time treatment shows promise in completely halting disease progression.', author: 'Dr. Lisa Chen', tags: ['breaking-news', 'analysis'], featured: true, daysAgo: 2 },
  { title: 'Cybersecurity Alert: Major Vulnerability Discovered', category: 'technology', excerpt: 'Critical flaw affects billions of devices worldwide.', content: 'Security researchers have identified a critical vulnerability in widely-used software that could affect billions of devices. Major tech companies are rushing to deploy patches.', author: 'Marcus Johnson', tags: ['breaking-news'], featured: false, daysAgo: 1 },
  { title: 'Global Markets Rally on Economic Data', category: 'business', excerpt: 'Strong employment numbers fuel investor optimism.', content: 'Stock markets worldwide posted significant gains following better-than-expected economic indicators. Unemployment rates fell to decade lows while wage growth remained steady.', author: 'David Miller', tags: ['analysis'], featured: false, daysAgo: 1 },
  { title: 'Historic Peace Accord Signed in Middle East', category: 'world', excerpt: 'Long-standing conflict moves toward resolution with landmark agreement.', content: 'After years of negotiations, regional powers have signed a comprehensive peace agreement addressing territorial disputes and establishing frameworks for economic cooperation.', author: 'Fatima Abbas', tags: ['breaking-news', 'featured'], featured: true, daysAgo: 4 },
  { title: 'Record-Breaking Heatwave Grips Southern Hemisphere', category: 'world', excerpt: 'Temperature records shattered across multiple continents.', content: 'Unprecedented heatwaves are affecting Australia, South America, and southern Africa, with temperatures exceeding previous records by significant margins. Climate scientists express concern.', author: 'Emma Wilson', tags: ['breaking-news'], featured: false, daysAgo: 2 },
  { title: 'New Treatment Shows Promise Against Alzheimers', category: 'health', excerpt: 'Clinical trials demonstrate significant cognitive improvement.', content: 'A novel drug therapy has shown remarkable results in slowing cognitive decline in Alzheimers patients. Phase 3 trials indicate potential for disease modification rather than just symptom management.', author: 'Dr. Robert Taylor', tags: ['breaking-news', 'analysis'], featured: true, daysAgo: 3 },
  { title: 'Championship Game Sets Viewership Records', category: 'sports', excerpt: 'Over 150 million viewers tune in for historic matchup.', content: 'The championship game attracted the largest television audience in sports history, combining traditional broadcast with streaming platforms to reach a global audience.', author: 'Chris Anderson', tags: ['breaking-news'], featured: false, daysAgo: 2 },
  { title: 'Renewable Energy Surpasses Fossil Fuels Globally', category: 'science', excerpt: 'Solar and wind power generation reaches historic milestone.', content: 'For the first time, renewable energy sources have generated more electricity than fossil fuels on a global scale. The shift accelerates as costs continue to decline.', author: 'Dr. Anna Schmidt', tags: ['breaking-news', 'featured'], featured: true, daysAgo: 5 },
  { title: 'Tech Giant Unveils Revolutionary AI Assistant', category: 'technology', excerpt: 'New artificial intelligence promises to transform daily computing.', content: 'A major technology company has revealed an advanced AI assistant that can understand context, maintain conversations, and execute complex tasks across multiple applications seamlessly.', author: 'Kevin Zhang', tags: ['breaking-news', 'analysis'], featured: false, daysAgo: 3 },
  { title: 'Oscar Nominations Announced Amid Controversy', category: 'entertainment', excerpt: 'Award season begins with unexpected snubs and surprises.', content: 'The Academy of Motion Picture Arts and Sciences revealed this years Oscar nominations, with several surprise inclusions and notable omissions sparking industry debate.', author: 'Jessica Martinez', tags: ['breaking-news'], featured: false, daysAgo: 4 },
];

async function main() {
  console.log('Start seeding...');

  // Create categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`✓ Category: ${category.name}`);
  }

  // Create tags
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    console.log(`✓ Tag: ${tag.name}`);
  }

  // Create articles
  let articleCount = 0;
  for (const articleData of sampleArticles) {
    const category = await prisma.category.findUnique({
      where: { slug: articleData.category },
    });

    if (!category) continue;

    const tagRecords = await Promise.all(
      articleData.tags.map((tagSlug) =>
        prisma.tag.findUnique({ where: { slug: tagSlug } })
      )
    );

    const validTags = tagRecords.filter((tag: typeof tagRecords[number]): tag is NonNullable<typeof tag> => tag !== null);
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - articleData.daysAgo);

    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    try {
      await prisma.article.create({
        data: {
          title: articleData.title,
          slug,
          excerpt: articleData.excerpt,
          content: articleData.content,
          author: articleData.author,
          categoryId: category.id,
          publishedAt,
          featured: articleData.featured,
          source: 'News Network',
          sourceUrl: `https://example.com/${slug}`,
          sourceDomain: 'newsnetwork.com',
          tags: {
            connect: validTags.map((tag: { id: string }) => ({ id: tag.id })),
          },
        },
      });
      articleCount++;
      console.log(`✓ Article: ${articleData.title.substring(0, 50)}...`);
    } catch (error) {
      console.log(`✗ Failed: ${articleData.title}`);
    }
  }

  console.log(`\n✅ Seeding completed! Created ${articleCount} articles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
