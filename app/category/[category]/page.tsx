import { ArticleGrid } from '@/components/ArticleGrid';
import { getCategoryColor } from '@/config/colors';
import { getArticlesByCategoryWithFallback } from '@/lib/articlesWithFallback';

export const revalidate = 300; // Revalidate every 5 minutes

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const categoryMap: Record<string, string> = {
  world: 'general',
  business: 'business',
  technology: 'technology',
  sports: 'sports',
  health: 'health',
  science: 'science',
  entertainment: 'entertainment',
  politics: 'general',
};

const displayNames: Record<string, string> = {
  world: 'World',
  business: 'Business',
  technology: 'Technology',
  sports: 'Sports',
  health: 'Health',
  science: 'Science',
  entertainment: 'Entertainment',
  politics: 'Politics',
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category.toLowerCase();
  const displayName = displayNames[categorySlug] || 'News';
  
  const articles = await getArticlesByCategoryWithFallback(displayName);
  const categoryColor = getCategoryColor(displayName);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-surface-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <a href="/" className="text-accent-primary hover:text-accent-primary-hover text-sm font-medium mb-4 inline-block">
            ← Back to Home
          </a>
          <div className="flex items-center gap-4">
            <span
              className="inline-block px-5 py-2.5 rounded-full text-lg font-semibold"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
                border: `2px solid ${categoryColor}40`,
              }}
            >
              {displayName}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{displayName} News</h1>
              <p className="text-foreground-secondary mt-1">
                Latest headlines from {displayName.toLowerCase()} coverage
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <ArticleGrid articles={articles} emptyMessage={`No ${displayName.toLowerCase()} articles found`} />
      </main>
    </div>
  );
}
