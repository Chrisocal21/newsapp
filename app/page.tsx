import { siteConfig } from '@/config/site';
import { getAllArticles } from '@/lib/articles';
import { SwipeableCategoryView } from '@/components/SwipeableCategoryView';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  // Fetch articles from database
  const allArticles = await getAllArticles();

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <main className="flex-1 w-full overflow-hidden">
        <SwipeableCategoryView allArticles={allArticles} />
      </main>
    </div>
  );
}
