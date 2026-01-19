export const siteConfig = {
  name: 'Archv',
  description: 'Your passive news archive - save articles, read later',
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
