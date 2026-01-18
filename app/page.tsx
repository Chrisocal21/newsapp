import { siteConfig } from '@/config/site';
import { getArticlesWithFallback } from '@/lib/articlesWithFallback';
import { SwipeableCategoryView } from '@/components/SwipeableCategoryView';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  // Fetch real articles from NewsAPI with fallback to mock data
  const allArticles = await getArticlesWithFallback();

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-surface shadow-sm sticky top-0 z-20 flex-shrink-0 border-b border-surface-secondary">
        <div className="max-w-7xl mx-auto px-6 py-3 text-center">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{siteConfig.name}</h1>
          <p className="text-foreground-secondary text-sm mt-0.5">{siteConfig.description}</p>
        </div>
      </header>
      
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden max-w-7xl w-full mx-auto px-6">
          <SwipeableCategoryView allArticles={allArticles} />
        </div>

        {/* Attribution Notice - Fixed to Bottom */}
        <section className="flex-shrink-0 bg-surface-secondary/50 border-t border-surface-secondary px-6 py-3 pb-6 text-center w-full">
          <p className="text-xs text-foreground-secondary leading-tight">
            All content attributed to original sources. We respect copyright.
          </p>
          <a 
            href="/attribution" 
            className="text-accent-primary hover:text-accent-primary-hover text-xs font-medium"
          >
            Attribution Policy →
          </a>
        </section>
      </main>
    </div>
  );
}
