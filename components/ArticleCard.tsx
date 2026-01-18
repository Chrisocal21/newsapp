import { Article } from '@/types/article';
import { getCategoryColor } from '@/config/colors';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const categoryColor = getCategoryColor(article.category);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(article.publishedAt);

  return (
    <article className="bg-surface rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-surface-secondary">
      <div className="p-6">
        {/* Category badge */}
        <div className="mb-3">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              border: `1px solid ${categoryColor}40`,
            }}
          >
            {article.category}
          </span>
        </div>

        {/* Title - More prominent */}
        <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight hover:text-accent-primary transition-colors min-h-[4rem]">
          <Link href={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-foreground-secondary text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Attribution - Author & Source */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-foreground-muted">
            <span className="font-medium text-foreground-secondary">{article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedAt.toISOString()}>
              {formattedDate}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground-muted">Source:</span>
            <a 
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-primary hover:text-accent-primary-hover transition-colors"
            >
              {article.source}
            </a>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-secondary flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-foreground-muted bg-surface-secondary px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
