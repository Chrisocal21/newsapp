import { ArticleGrid } from '@/components/ArticleGrid';
import { getCategoryColors } from '@/config/colors';
import { getArticlesByCategory } from '@/lib/articles';

export const revalidate = 300; // Revalidate every 5 minutes

interface CategoryPageProps {
  params: {
    category: string;
  };
}

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
  
  const result = await getArticlesByCategory(displayName);
  const articles = result.articles;
  const categoryColor = getCategoryColors(displayName);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <a href="/" className="inline-flex items-center gap-2 text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] text-sm font-medium mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
          <div className="flex items-center gap-4">
            <span
              className="badge"
              style={{
                backgroundColor: categoryColor.bg,
                color: categoryColor.text,
              }}
            >
              {displayName}
            </span>
            <div>
              <h1 className="text-headline text-[var(--color-text-primary)]">{displayName} News</h1>
              <p className="text-body-secondary mt-1">
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
