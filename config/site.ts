export const siteConfig = {
  name: 'NewsApp',
  description: 'Your trusted source for news',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  links: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
  },
  itemsPerPage: 12,
  categories: [
    'World',
    'Politics',
    'Business',
    'Technology',
    'Sports',
    'Entertainment',
    'Science',
    'Health',
  ],
};
