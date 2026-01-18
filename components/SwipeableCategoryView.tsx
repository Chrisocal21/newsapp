'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { siteConfig } from '@/config/site';
import { getCategoryColor } from '@/config/colors';
import { SwipeContainer } from './SwipeContainer';
import { ArticleCard } from './ArticleCard';
import { FeaturedArticle } from './FeaturedArticle';

interface SwipeableCategoryViewProps {
  allArticles: Article[];
}

export function SwipeableCategoryView({ allArticles }: SwipeableCategoryViewProps) {
  const categories = ['All', ...siteConfig.categories];
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentCategory = categories[currentCategoryIndex];

  // Filter articles by current category
  const filteredArticles = currentCategory === 'All' 
    ? allArticles 
    : allArticles.filter(a => a.category === currentCategory);

  const currentArticle = filteredArticles[currentArticleIndex];

  const handleSwipeLeft = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setIsTransitioning(true);
      setCurrentArticleIndex(0); // Reset to first article when switching category
      setTimeout(() => {
        setCurrentCategoryIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleSwipeRight = () => {
    if (currentCategoryIndex > 0) {
      setIsTransitioning(true);
      setCurrentArticleIndex(0); // Reset to first article when switching category
      setTimeout(() => {
        setCurrentCategoryIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleSwipeUp = () => {
    if (currentArticleIndex < filteredArticles.length - 1) {
      setIsTransitioning(true);
      setIsExpanded(false); // Collapse when moving to next article
      setTimeout(() => {
        setCurrentArticleIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleSwipeDown = () => {
    if (currentArticleIndex > 0) {
      setIsTransitioning(true);
      setIsExpanded(false); // Collapse when moving to previous article
      setTimeout(() => {
        setCurrentArticleIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(false); // Collapse when changing category
    setIsExpanded(!isExpanded);
  };

  const handleCategoryClick = (index: number) => {
    setIsTransitioning(true);
    setCurrentArticleIndex(0); // Reset to first article
    setTimeout(() => {
      setCurrentCategoryIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipeRight();
      } else if (e.key === 'ArrowRight') {
        handleSwipeLeft();
      } else if (e.key === 'ArrowUp') {
        handleSwipeDown();
      } else if (e.key === 'ArrowDown') {
        handleSwipeUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCategoryIndex, currentArticleIndex]);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Category Navigation */}
      <div className="flex-shrink-0 bg-background border-b border-surface-secondary">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-lg font-semibold text-foreground">
            {currentCategory === 'All' ? 'All News' : `${currentCategory} News`}
          </h2>
          <div className="flex items-center gap-2 text-xs text-foreground-muted">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 px-4 pb-2 justify-center">
          {categories.map((category, index) => {
            const isActive = index === currentCategoryIndex;
            const categoryColor = category === 'All' ? '#d4722b' : getCategoryColor(category);
            
            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive ? 'shadow-md scale-105' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: isActive ? categoryColor : `${categoryColor}20`,
                  color: isActive ? 'white' : categoryColor,
                  border: `1.5px solid ${isActive ? categoryColor : `${categoryColor}40`}`,
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="px-4 pb-2 flex gap-1">
          {categories.map((_, index) => (
            <div
              key={index}
              className={`h-0.5 rounded-full flex-1 transition-all duration-200 ${
                index === currentCategoryIndex ? 'bg-accent-primary' : 'bg-surface-secondary'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipeable Article Content */}
      <SwipeContainer 
        onSwipeLeft={handleSwipeLeft} 
        onSwipeRight={handleSwipeRight}
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
      >
        <div className={`px-4 py-2 mt-8 transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          {currentArticle ? (
            <div className="w-full max-w-3xl mx-auto">
              {/* Article counter */}
              <div className="text-center">
                <span className="text-xs text-foreground-muted">
                  {currentArticleIndex + 1} / {filteredArticles.length}
                </span>
              </div>

              {/* Article Card */}
              <div className="bg-surface rounded-2xl shadow-sm border border-surface-secondary overflow-hidden">
                {/* Title - Always Visible */}
                <div 
                  onClick={toggleExpanded}
                  className="p-6 pb-4 cursor-pointer hover:bg-surface-secondary/30 transition-colors"
                >
                  {/* Category badge */}
                  <div className="mb-3">
                    <span 
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                      style={{
                        backgroundColor: `${getCategoryColor(currentArticle.category)}20`,
                        color: getCategoryColor(currentArticle.category),
                        border: `1.5px solid ${getCategoryColor(currentArticle.category)}40`,
                      }}
                    >
                      {currentArticle.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4 hover:text-accent-primary transition-colors">
                    {currentArticle.title}
                  </h2>

                  {/* Article metadata */}
                  <div className="space-y-2 mb-4">
                    {/* Source */}
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <a
                        href={currentArticle.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent-primary transition-colors font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {currentArticle.source}
                      </a>
                    </div>

                    {/* Author */}
                    {currentArticle.author && (
                      <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{currentArticle.author}</span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <time dateTime={typeof currentArticle.publishedAt === 'string' ? currentArticle.publishedAt : currentArticle.publishedAt.toISOString()}>
                        {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex items-center justify-center">
                    <div className="text-foreground-muted text-xs flex items-center gap-1.5">
                      <span>Tap to view details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation hints - compact */}
              <div className="text-center">
                <div className="text-xs text-foreground-muted flex items-center justify-center gap-3">
                  {currentArticleIndex > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="hidden sm:inline">Prev</span>
                    </span>
                  )}
                  {currentArticleIndex < filteredArticles.length - 1 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span className="hidden sm:inline">Next</span>
                    </span>
                  )}
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span className="hidden sm:inline">Swipe ←→ for categories</span>
                    <span className="sm:hidden">←→ Categories</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-surface rounded-2xl shadow-sm p-8 text-center border border-surface-secondary">
                <p className="text-foreground-secondary">No articles in this category</p>
              </div>
            </div>
          )}
        </div>
      </SwipeContainer>

      {/* Modal Popup for Expanded Content */}
      {isExpanded && currentArticle && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={toggleExpanded}
        >
          <div 
            className="bg-surface rounded-2xl shadow-2xl border border-surface-secondary max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="sticky top-0 bg-surface border-b border-surface-secondary px-6 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Article Details</span>
              <button
                onClick={toggleExpanded}
                className="text-foreground-muted hover:text-foreground transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              {/* Category badge */}
              <div className="mb-3">
                <span 
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                  style={{
                    backgroundColor: `${getCategoryColor(currentArticle.category)}20`,
                    color: getCategoryColor(currentArticle.category),
                    border: `1.5px solid ${getCategoryColor(currentArticle.category)}40`,
                  }}
                >
                  {currentArticle.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
                {currentArticle.title}
              </h2>

              {/* Published date and author */}
              <div className="flex items-center gap-3 text-xs text-foreground-secondary mb-4 pb-4 border-b border-surface-secondary">
                <time dateTime={typeof currentArticle.publishedAt === 'string' ? currentArticle.publishedAt : currentArticle.publishedAt.toISOString()}>
                  {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
                {currentArticle.author && (
                  <>
                    <span>•</span>
                    <span>{currentArticle.author}</span>
                  </>
                )}
              </div>

              {/* Excerpt */}
              {currentArticle.excerpt && (
                <p className="text-base text-foreground-secondary leading-relaxed mb-6">
                  {currentArticle.excerpt}
                </p>
              )}

              {/* Read Full Article Button */}
              <a
                href={currentArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors duration-200 mb-4"
              >
                Read Full Article
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* Attribution */}
              <div className="pt-4 border-t border-surface-secondary">
                <p className="text-xs text-foreground-muted">
                  Originally published:{' '}
                  <a
                    href={currentArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:underline font-medium"
                  >
                    {currentArticle.source}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
