import { Article } from '@/types/article';
import { getCategoryColors } from '@/config/colors';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const categoryColor = getCategoryColors(article.category);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(article.publishedAt);

  return (
    <article className="card group">
      <div className="space-y-3">
        {/* Category badge */}
        <div className="flex items-center gap-2">
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
        <h3 className="text-title leading-snug group-hover:text-[var(--color-accent-primary)] transition-colors">
          <Link href={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-body-sm text-[var(--color-text-secondary)] line-clamp-2">
          {article.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] pt-2">
          <span className="font-medium text-[var(--color-text-secondary)]">{article.author}</span>
          <span>•</span>
          <time dateTime={article.publishedAt.toISOString()}>
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
}
