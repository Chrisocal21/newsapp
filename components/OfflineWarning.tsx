'use client';

import { useEffect, useState } from 'react';

interface OfflineWarningProps {
  sourceUrl: string;
  sourceName: string;
}

export function OfflineWarning({ sourceUrl, sourceName }: OfflineWarningProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted (client-side only)
    setMounted(true);
    
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show default online state during SSR and initial render
  if (!mounted || isOnline) {
    return (
      <div className="text-center py-8">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent-primary text-white font-semibold text-lg rounded-xl hover:bg-accent-primary-hover transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Read Full Article at {sourceName}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <p className="text-sm text-foreground-muted mt-4">
          Opens in new tab • All rights reserved by original publisher
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="inline-flex items-center gap-3 px-8 py-4 bg-surface-secondary text-foreground-muted font-semibold text-lg rounded-xl opacity-60 cursor-not-allowed">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
        Full Article Unavailable Offline
      </div>
      <p className="text-sm text-foreground-muted mt-4">
        Connect to the internet to read the complete article at {sourceName}
      </p>
    </div>
  );
}
