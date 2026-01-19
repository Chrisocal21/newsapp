import { notFound } from 'next/navigation';
import { getCategoryColors } from '@/config/colors';
import { getArticleBySlug } from '@/lib/articles';
import { OfflineWarning } from '@/components/OfflineWarning';

export const revalidate = 300; // Revalidate every 5 minutes

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const categoryColor = getCategoryColors(article.category);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(article.publishedAt);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header */}
      <header className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <a href="/" className="inline-flex items-center gap-2 text-[var(--color-accent-primary)] text-sm font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Category */}
        <span
          className="badge inline-block"
          style={{
            backgroundColor: categoryColor.bg,
            color: categoryColor.text,
          }}
        >
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-display leading-tight">
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] pb-6 border-b border-[var(--color-border)]">
          <span className="font-semibold text-[var(--color-text-primary)]">{article.author}</span>
          <span>•</span>
          <time dateTime={article.publishedAt.toISOString()}>{formattedDate}</time>
        </div>

        {/* Content */}
        <div className="card space-y-4">
          <p className="text-body leading-relaxed text-[var(--color-text-secondary)]">
            {article.excerpt}
          </p>
          <p className="text-body leading-relaxed text-[var(--color-text-secondary)]">
            {article.content}
          </p>
        </div>

        {/* Attribution */}
        <div className="card bg-amber-500/10">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <strong className="text-[var(--color-text-primary)]">Source:</strong> This article was originally published by <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-accent-primary)]">{article.source}</a>. We respect copyright and provide excerpts under fair use.
          </p>
        </div>

        {/* Call to Action */}
        <OfflineWarning sourceUrl={article.sourceUrl} sourceName={article.source} />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-sm rounded-full"
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
