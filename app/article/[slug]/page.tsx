import { notFound } from 'next/navigation';
import { getCategoryColor } from '@/config/colors';
import { fetchAllCategoryArticles } from '@/lib/newsapi';

export const revalidate = 300; // Revalidate every 5 minutes

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const allArticles = await fetchAllCategoryArticles();
  const article = allArticles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const categoryColor = getCategoryColor(article.category);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(article.publishedAt);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-surface-secondary">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <a href="/" className="text-accent-primary hover:text-accent-primary-hover text-sm font-medium">
            ← Back to Home
          </a>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Category */}
        <div className="mb-4">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              border: `1.5px solid ${categoryColor}40`,
            }}
          >
            {article.category}
          </span>
        </div>

        {/* Title - Very large and prominent */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="mb-10 border-b border-surface-secondary pb-8">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground-muted mb-1">Written by</p>
              <p className="text-lg font-semibold text-foreground">{article.author}</p>
            </div>
            <div>
              <p className="text-sm text-foreground-muted mb-1">Originally published by</p>
              <a 
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-accent-primary hover:text-accent-primary-hover transition-colors"
              >
                {article.source}
              </a>
              {article.sourceDomain && (
                <p className="text-sm text-foreground-muted mt-1">({article.sourceDomain})</p>
              )}
            </div>
            <div>
              <p className="text-sm text-foreground-muted">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Excerpt/Preview Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-surface border border-surface-secondary rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Article Preview</h2>
            <p className="text-foreground-secondary leading-relaxed text-lg mb-4">
              {article.excerpt}
            </p>
            <p className="text-foreground-secondary leading-relaxed text-lg">
              {article.content}
            </p>
          </div>

          {/* Legal Notice */}
          <div className="bg-accent-warning/10 border border-accent-warning/30 rounded-xl p-6 mb-8">
            <p className="text-sm text-foreground-secondary leading-relaxed">
              <strong className="text-foreground">Content Attribution Notice:</strong> This is a preview of an article originally published by {article.source}. 
              We respect intellectual property rights and provide this excerpt under fair use principles. 
              To read the complete article, please visit the original source.
            </p>
          </div>

          {/* Call to Action - Read Full Article */}
          <div className="text-center py-8">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent-primary text-white font-semibold text-lg rounded-xl hover:bg-accent-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Read Full Article at {article.source}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p className="text-sm text-foreground-muted mt-4">
              Opens in new tab • All rights reserved by original publisher
            </p>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-surface-secondary">
            <h3 className="text-sm font-semibold text-foreground-muted mb-3">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-surface-secondary text-foreground-secondary text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
