import { Article } from '@/types/article';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  emptyMessage?: string;
}

export function ArticleGrid({ 
  articles, 
  emptyMessage = 'No articles found' 
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-surface rounded-2xl shadow-sm p-12 text-center border border-surface-secondary">
        <p className="text-foreground-secondary text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
