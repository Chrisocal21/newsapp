import { Article } from '@/types/article';
import { getCategoryColor } from '@/config/colors';
import Link from 'next/link';

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const categoryColor = getCategoryColor(article.category);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(article.publishedAt);

  return (
    <article className="bg-surface rounded-2xl shadow-md overflow-hidden border border-surface-secondary hover:shadow-lg transition-all duration-300">
      <div className="p-10">
        {/* Featured badge and category */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-1.5 bg-accent-primary text-white text-sm font-semibold rounded-full">
            FEATURED
          </span>
          <span
            className="px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              border: `1px solid ${categoryColor}40`,
            }}
          >
            {article.category}
          </span>
        </div>

        {/* Title - Very prominent */}
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight hover:text-accent-primary transition-colors">
          <Link href={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Excerpt - More prominent */}
        <p className="text-xl text-foreground-secondary leading-relaxed mb-8">
          {article.excerpt}
        </p>

        {/* Attribution & Actions */}
        <div className="space-y-3">
            <div className="text-sm">
              <span className="font-semibold text-foreground">{article.author}</span>
              <span className="text-foreground-muted mx-2">•</span>
              <time className="text-foreground-muted" dateTime={article.publishedAt.toISOString()}>
                {formattedDate}
              </time>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground-muted">Originally published by:</span>
              <a 
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent-primary hover:text-accent-primary-hover transition-colors"
              >
                {article.source}
              </a>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-white font-medium text-sm rounded-lg hover:bg-accent-primary-hover transition-colors shadow-sm"
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
