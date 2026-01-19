import { Article } from '@/types/article';
import { getCategoryColors } from '@/config/colors';
import Link from 'next/link';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const categoryColor = getCategoryColors(article.category);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(article.publishedAt);

  return (
    <article className="card">
      <div className="space-y-4">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[var(--color-accent-primary)] text-white text-xs font-bold rounded-full">
            FEATURED
          </span>
          <span
            className="badge"
            style={{
              backgroundColor: categoryColor.bg,
              color: categoryColor.text,
            }}
          >
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-display leading-tight group-hover:text-[var(--color-accent-primary)] transition-colors">
          <Link href={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-body-lg text-[var(--color-text-secondary)]">
          {article.excerpt}
        </p>

        {/* Metadata & Action */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
            <span className="font-semibold text-[var(--color-text-primary)]">{article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedAt.toISOString()}>
              {formattedDate}
            </time>
          </div>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Read Full Article
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
