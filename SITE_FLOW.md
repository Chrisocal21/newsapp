# News App - Site Flow & Architecture

## Overview
A Progressive Web App (PWA) for reading news offline with real-time syncing from external news APIs.

---

## User Flow

### 1. **First Visit (Online)**
```
User visits http://localhost:3000
    ↓
Homepage loads with swipeable category view
    ↓
Displays 53 real news articles from database
    ↓
Service Worker installs in background
    ↓
Articles, images, and pages cached for offline use
```

### 2. **Browsing Articles (Online/Offline)**
```
Homepage
    ↓
Swipe between categories OR tap category name
    ↓
View articles in selected category
    ↓
Tap article card
    ↓
Article Detail Page
    ├── Read excerpt/preview (always available)
    ├── View metadata (author, source, date, tags)
    └── Click "Read Full Article" button
        ├── [Online] → Opens external source in new tab
        └── [Offline] → Button disabled with offline message
```

### 3. **Category Navigation**
```
Homepage
    ↓
Tap category name OR swipe left/right
    ↓
Articles filtered by category
    ├── World
    ├── Politics
    ├── Business
    ├── Technology
    ├── Sports
    ├── Entertainment
    ├── Science
    └── Health
```

### 4. **Offline Experience**
```
User goes offline (airplane mode, no WiFi)
    ↓
Yellow "You're offline" banner appears at top
    ↓
All cached content still accessible:
    ├── Browse all articles
    ├── Read excerpts/previews
    ├── View cached images
    └── Navigate between pages
    
External links behavior:
    └── "Read Full Article" button disabled
    └── Shows "Full Article Unavailable Offline" message
```

### 5. **News Syncing (Background)**
```
[Manual Sync]
Run: npm run news:fetch
    ↓
Fetches from NewsAPI (7 categories × 5 articles)
    ↓
Fetches from NY Times (7 sections × 5 articles)
    ↓
Saves new articles to SQLite database
    ↓
Skips duplicates based on slug
    ↓
New articles appear on homepage

[Automatic Sync]
Run: npm run news:sync (in separate terminal)
    ↓
Cron job runs every 30 minutes
    ↓
Executes fetch-news.ts script
    ↓
Database updates automatically
```

---

## Technical Architecture

### Frontend Layer
```
Next.js 16.1.3 (App Router)
    ↓
├── Server Components (async data fetching)
│   ├── app/page.tsx → Homepage with categories
│   ├── app/category/[category]/page.tsx → Category pages
│   └── app/article/[slug]/page.tsx → Article details
│
├── Client Components (interactivity)
│   ├── SwipeableCategoryView → Category carousel
│   ├── SwipeContainer → Touch gestures
│   ├── OfflineIndicator → Connection status
│   └── OfflineWarning → Smart external links
│
└── Shared Components
    ├── ArticleCard → Article preview cards
    ├── ArticleGrid → Responsive grid layout
    ├── FeaturedArticle → Hero article display
    └── Pagination → Page navigation
```

### Data Layer
```
SQLite Database (prisma/dev.db)
    ↓
Prisma ORM (v5.22.0)
    ↓
Repository Pattern (lib/repositories/)
    ↓
├── articleRepository.ts
│   ├── findAll() → Get articles with filters/pagination
│   ├── findById() → Single article by ID
│   ├── findBySlug() → Single article by slug
│   ├── create() → Insert new article
│   ├── update() → Modify existing article
│   ├── delete() → Remove article
│   └── search() → Full-text search
│
└── Database Schema
    ├── Article (main content)
    ├── Category (8 predefined categories)
    ├── Tag (article tags)
    ├── User (future authentication)
    ├── UserPreferences (future personalization)
    ├── UserBookmark (future bookmarks)
    └── ArticleView (future analytics)
```

### API Integration Layer
```
External News Sources
    ↓
├── NewsAPI
│   ├── Endpoint: newsapi.org/v2/top-headlines
│   ├── Categories: general, business, entertainment, health, science, sports, technology
│   ├── Rate Limit: Unknown (hit some)
│   └── Transform: newsapi.ts → Article type
│
└── NY Times
    ├── Endpoint: api.nytimes.com/svc/topstories/v2/{section}.json
    ├── Sections: home, world, technology, business, science, health, sports
    ├── Rate Limit: 429 errors on rapid requests
    └── Transform: nytimes.ts → Article type

Fetching Script (scripts/fetch-news.ts)
    ↓
Loads .env.local with API keys
    ↓
Fetches from both sources
    ↓
Transforms to standard Article format
    ↓
Saves to database (skips duplicates)
```

### PWA Layer
```
Service Worker (next-pwa)
    ↓
Caching Strategy:
├── NetworkFirst (default)
│   ├── Try network first
│   ├── Fallback to cache if offline
│   └── Cache for 24 hours
│
├── CacheFirst (images)
│   ├── Local images: 30 days
│   ├── External images: 7 days
│   └── Max 200 entries
│
└── StaleWhileRevalidate (fonts)
    └── Serve from cache, update in background

Offline Features:
├── Database on device (SQLite)
├── All pages cached
├── Images cached
└── API responses cached (5 min)
```

---

## Data Flow Diagrams

### Article Fetching Flow
```
npm run news:fetch
    ↓
[scripts/fetch-news.ts executes]
    ↓
Load environment variables from .env.local
    ↓
┌─────────────────────┬──────────────────────┐
│   NewsAPI Request   │  NY Times Request    │
│   (7 categories)    │  (7 sections)        │
└──────────┬──────────┴───────────┬──────────┘
           │                      │
           ↓                      ↓
    Transform to Article type
           │
           ↓
    Check if slug exists in DB
           │
           ├── Exists → Skip
           └── New → Insert into DB
                ↓
         [Prisma Client]
                ↓
         [SQLite Database]
                ↓
    Article now available on site
```

### Page Rendering Flow
```
User requests page (e.g., /)
    ↓
[Next.js Server Component]
    ↓
Call lib/articles.ts function
    ↓
├── getAllArticles()
│       ↓
│   articleRepository.findAll()
│       ↓
│   Prisma query to SQLite
│       ↓
│   Transform DB results to Article[]
│       ↓
│   Return with pagination metadata
│
└── React renders with data
    ↓
Service Worker caches rendered page
    ↓
User sees articles
```

### Offline Page Load Flow
```
User offline, requests page
    ↓
Network request fails
    ↓
Service Worker intercepts
    ↓
Check cache for page
    ├── Found → Serve cached version
    └── Not found → Show offline page
         ↓
OfflineIndicator detects navigator.onLine = false
    ↓
Yellow banner shows "You're offline"
    ↓
User browses cached content
```

---

## File Structure & Responsibilities

### `/app` - Next.js App Router
- **page.tsx** - Homepage with swipeable categories
- **layout.tsx** - Root layout with PWA metadata
- **globals.css** - Global styles (Tailwind)
- **article/[slug]/page.tsx** - Dynamic article pages
- **category/[category]/page.tsx** - Dynamic category pages
- **attribution/page.tsx** - Content attribution notices

### `/components` - React Components
- **ArticleCard.tsx** - Article preview card
- **ArticleGrid.tsx** - Responsive grid container
- **FeaturedArticle.tsx** - Hero article display
- **Pagination.tsx** - Page navigation controls
- **SwipeableCategoryView.tsx** - Category carousel with swipe
- **SwipeContainer.tsx** - Touch gesture wrapper
- **OfflineIndicator.tsx** - Connection status banner
- **OfflineWarning.tsx** - Smart external link handler

### `/lib` - Business Logic
- **articles.ts** - High-level article API (facade)
- **articlesWithFallback.ts** - Fallback logic for errors
- **db.ts** - Prisma client singleton
- **errors.ts** - Custom error classes
- **logger.ts** - Logging utility
- **newsapi.ts** - NewsAPI integration
- **nytimes.ts** - NY Times integration
- **pagination.ts** - Pagination utilities
- **rssFeeds.ts** - RSS feed parsing
- **validation.ts** - Zod schemas
- **repositories/articleRepository.ts** - Article CRUD operations

### `/config` - Configuration
- **colors.ts** - Category color mapping
- **site.ts** - Site-wide settings

### `/prisma` - Database
- **schema.prisma** - Database schema definition
- **seed.ts** - Sample data seeding (not used)
- **dev.db** - SQLite database file
- **migrations/** - Database migrations

### `/scripts` - Utility Scripts
- **fetch-news.ts** - Manual news fetching
- **sync-scheduler.ts** - Auto-sync with cron (30 min)
- **check-and-cleanup.ts** - Database inspection
- **cleanup-samples.ts** - Remove sample articles
- **generate-icons.ts** - Generate PWA icons

### `/public` - Static Assets
- **manifest.json** - PWA manifest
- **icon-192x192.png** - PWA icon (small)
- **icon-512x512.png** - PWA icon (large)

### `/types` - TypeScript Types
- **article.ts** - Article interface definition

---

## State Management

### Current State (No State Library)
```
Server State:
├── Database → Source of truth
├── Prisma queries → Always fresh data
└── Server Components → Fetch on each request

Client State:
├── URL parameters → Category selection
├── Local component state → Swipe gestures
└── Browser APIs → Online/offline detection

Cache State:
└── Service Worker → Automatic caching
```

### Future State (Phase 4)
```
Planned additions:
├── User authentication state
├── Reading preferences
├── Bookmarks
└── Reading history
```

---

## Error Handling

### Network Errors
```
API Request fails
    ↓
try/catch in fetch-news.ts
    ↓
Log error with details
    ↓
Continue to next source
    ↓
Return partial results (53 articles instead of 70)
```

### Database Errors
```
Query fails
    ↓
try/catch in repository
    ↓
logger.error() with context
    ↓
Throw error up the chain
    ↓
Next.js catches and shows error page
```

### Offline Errors
```
User offline, requests external resource
    ↓
Network request fails
    ↓
Service Worker catches
    ↓
Returns cached version OR
    ↓
Shows offline message
```

---

## Performance Optimizations

### Current Optimizations
1. **Database Indexes** - Slug, category, publishedAt
2. **Image Caching** - 30-day cache for images
3. **Server Components** - No client-side JS for static content
4. **Pagination** - Load only 12 articles at a time
5. **Service Worker** - Instant page loads from cache

### Future Optimizations (Planned)
1. **Image Optimization** - Next.js Image component
2. **Lazy Loading** - Intersection Observer for cards
3. **Virtual Scrolling** - For large article lists
4. **Database Indexing** - Full-text search index
5. **CDN** - External image caching

---

## Security Considerations

### Current Security
1. **API Keys** - Stored in .env.local (not committed)
2. **External Links** - rel="noopener noreferrer"
3. **Content Attribution** - Legal notices on articles
4. **HTTPS** - Required for PWA
5. **Input Validation** - Zod schemas

### Future Security (Planned)
1. **User Authentication** - JWT tokens
2. **Rate Limiting** - Prevent API abuse
3. **Content Sanitization** - XSS prevention
4. **CORS** - API endpoint protection

---

## Deployment Flow (Future)

### Production Build
```
npm run build
    ↓
Next.js optimizes code
    ↓
Service Worker generated
    ↓
Static assets output to .next/
    ↓
npm run start
    ↓
Production server on port 3000
```

### Deployment Platforms
- **Vercel** - Recommended for Next.js
- **Netlify** - Alternative
- **Docker** - Self-hosted option
- **Railway** - Database + app hosting

---

## Testing Strategy (Planned)

### Unit Tests
- Repository functions
- Utility functions
- Data transformations

### Integration Tests
- API fetching
- Database operations
- PWA caching

### E2E Tests
- User flows
- Offline functionality
- Article navigation

---

## Current Metrics

### Database
- **Articles**: 53 real news articles
- **Categories**: 8 (World, Politics, Business, Technology, Sports, Entertainment, Science, Health)
- **Tags**: 5 predefined tags
- **Sources**: 29 unique news sources

### Performance
- **Initial Load**: ~1.4s (compile + render)
- **Cached Load**: <100ms (service worker)
- **Database Query**: ~60ms average
- **API Fetch**: ~5-10s (both sources combined)

### Features Complete
- ✅ PWA with offline support
- ✅ Real news from NewsAPI + NY Times
- ✅ Category navigation
- ✅ Article detail pages
- ✅ Pagination
- ✅ Responsive design
- ✅ Auto-sync capability

---

## Development Commands

### Daily Development
```bash
npm run dev              # Start dev server
npm run news:fetch       # Fetch news once
npm run news:sync        # Auto-sync every 30 min
npm run db:studio        # View database GUI
```

### Database Management
```bash
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data (not used)
npx prisma studio        # Open Prisma Studio
npx tsx scripts/check-and-cleanup.ts  # Inspect DB
```

### Building
```bash
npm run build            # Production build
npm run start            # Production server
npm run lint             # Check code quality
```

---

## Future Enhancements

### Phase 3 - UI/UX (50% Complete)
- [ ] Search functionality
- [ ] Article filtering
- [ ] Dark mode
- [ ] Skeleton loaders

### Phase 4 - User Features (0% Complete)
- [ ] User authentication
- [ ] Bookmarks
- [ ] Reading history
- [ ] Preferences

### Phase 5 - Advanced Features (0% Complete)
- [ ] Push notifications
- [ ] Article recommendations
- [ ] Social sharing
- [ ] Comments

### Phase 6 - Analytics (0% Complete)
- [ ] Reading analytics
- [ ] Popular articles
- [ ] User engagement metrics

---

**Last Updated**: January 18, 2026  
**Current Version**: 0.1.0  
**Status**: Development - Core features complete
