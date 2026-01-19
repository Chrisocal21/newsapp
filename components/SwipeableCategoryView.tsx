'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { siteConfig } from '@/config/site';
import { getCategoryColors } from '@/config/colors';
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
      setTimeout(() => {
        setCurrentArticleIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleSwipeDown = () => {
    if (currentArticleIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentArticleIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
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
      {/* Minimal Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent pt-4 sm:pt-5">
        <div className="flex items-center justify-between px-8 sm:px-10 md:px-12 py-3 pb-4">
          <div className="text-white font-bold text-4xl">
            Archv
          </div>
          <div className="text-white/60 text-sm">
            {currentArticleIndex + 1}/{filteredArticles.length}
          </div>
        </div>
      </div>

      {/* Full Screen Swipeable Content */}
      <SwipeContainer 
        onSwipeLeft={handleSwipeLeft} 
        onSwipeRight={handleSwipeRight}
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
      >
        <div className="h-full w-full relative flex flex-col">
          <div className="h-20"></div>
          
          {/* Category Pills */}
          <div className="flex justify-between gap-4 px-8 sm:px-10 md:px-12 mb-8">
            {categories.map((category, index) => {
              const isActive = index === currentCategoryIndex;
              
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(index)}
                  className={`flex-1 px-4 py-4 rounded-full text-base font-bold whitespace-nowrap transition-all shadow-lg ${
                    isActive ? 'bg-white text-black scale-105' : 'bg-white/30 text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {currentArticle ? (
            <div className="flex-1 w-full flex items-center justify-center px-5 sm:px-6">
              {/* Full Screen Card */}
              <div className="relative w-full max-w-sm h-[75vh] bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-bg-tertiary)] rounded-3xl shadow-2xl overflow-hidden z-10">
                {/* Category Badge - Top Left */}
                <div className="absolute top-5 left-5 z-10">
                  <span 
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-lg"
                    style={{
                      backgroundColor: getCategoryColors(currentArticle.category).bg,
                      color: getCategoryColors(currentArticle.category).text,
                    }}
                  >
                    {currentArticle.category}
                  </span>
                </div>

                {/* Content Container - Updated padding */}
                <div className="h-full flex flex-col px-6 py-5 items-center">
                  {/* Spacer for top badge */}
                  <div className="h-16 w-full"></div>

                  {/* Main Content - Inner padding */}
                  <div className="flex-1 flex flex-col justify-start space-y-4 w-full max-w-[240px]">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] leading-tight">
                      {currentArticle.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-6">
                      {currentArticle.excerpt}
                    </p>
                  </div>

                  {/* Bottom Info & Action */}
                  <div className="space-y-3 mt-auto">
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm px-1">
                      <span className="font-semibold text-[var(--color-text-primary)]">{currentArticle.author}</span>
                      <time className="text-[var(--color-text-tertiary)]">
                        {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>

                    {/* Read Button */}
                    <a
                      href={`/article/${currentArticle.slug}`}
                      className="block w-full py-4 bg-[var(--color-accent-primary)] text-white text-center font-bold text-base rounded-2xl active:scale-95 transition-transform"
                    >
                      Read Article
                    </a>

                    {/* Swipe Hint */}
                    <p className="text-center text-xs text-[var(--color-text-tertiary)] pb-2">
                      Swipe up for next • Swipe down for previous
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-[var(--color-text-secondary)]">No articles in this category</p>
              </div>
            </div>
          )}
        </div>
      </SwipeContainer>
    </div>
  );
}
