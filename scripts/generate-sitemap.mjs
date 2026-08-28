import { writeFileSync } from 'fs';
import { join } from 'path';

const SITE_URL = 'https://movienight.giize.com';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const FALLBACK_API_KEY = '8cb4712984e3c0d68f880b04c4d4f278';
const API_KEY = process.env.VITE_TMDB_API_KEY || FALLBACK_API_KEY;
const TODAY = new Date().toISOString().split('T')[0];

const createSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const genreSlugs = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy',
  'history', 'horror', 'music', 'mystery', 'romance', 'sci-fi', 'thriller', 'war', 'western',
];

const listRoutes = [
  { path: '/lists/best-movies-for-date-night', changefreq: 'weekly', priority: 0.6 },
  { path: '/lists/best-family-movies', changefreq: 'weekly', priority: 0.6 },
  { path: '/lists/what-to-watch-this-weekend', changefreq: 'weekly', priority: 0.6 },
];

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/movies', changefreq: 'daily', priority: 0.9 },
  { path: '/new', changefreq: 'daily', priority: 0.8 },
  { path: '/tv-shows', changefreq: 'daily', priority: 0.8 },
  { path: '/trailers', changefreq: 'daily', priority: 0.7 },
  { path: '/continue-watching', changefreq: 'weekly', priority: 0.5 },
  { path: '/liked', changefreq: 'weekly', priority: 0.4 },
  { path: '/queue', changefreq: 'weekly', priority: 0.4 },
  { path: '/privacy-policy', changefreq: 'monthly', priority: 0.3 },
  ...genreSlugs.map((slug) => ({ path: `/genres/${slug}`, changefreq: 'weekly', priority: 0.6 })),
  ...listRoutes,
];

const fetchTmdb = async (path) => {
  const res = await fetch(`${TMDB_BASE_URL}${path}?language=en-US&api_key=${API_KEY}`);
  if (!res.ok) {
    throw new Error(`TMDB request failed for ${path}: ${res.status}`);
  }
  return res.json();
};

const collectContentSlugs = async () => {
  const slugs = new Set();
  const endpoints = [];

  for (let page = 1; page <= 3; page += 1) {
    endpoints.push(`/movie/popular&page=${page}`);
  }
  for (let page = 1; page <= 3; page += 1) {
    endpoints.push(`/tv/popular&page=${page}`);
  }
  endpoints.push('/trending/movie/day');
  endpoints.push('/trending/tv/day');
  endpoints.push('/movie/upcoming');

  const results = await Promise.allSettled(endpoints.map((endpoint) => fetchTmdb(endpoint)));

  for (const result of results) {
    if (result.status !== 'fulfilled') {
      continue;
    }
    const items = result.value.results || [];
    for (const item of items) {
      const title = item.title || item.name || '';
      const slug = createSlug(title);
      if (slug) {
        slugs.add(`/movies/${slug}`);
      }
    }
  }

  return [...slugs];
};

const buildUrlEntry = ({ path, changefreq, priority }) =>
  `  <url>\n    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

const generate = async () => {
  let contentSlugs = [];
  try {
    contentSlugs = await collectContentSlugs();
  } catch (error) {
    console.warn('Sitemap: TMDB fetch failed, falling back to static routes only.', error);
  }

  const contentEntries = contentSlugs.map((path) => ({
    path,
    changefreq: 'weekly',
    priority: 0.6,
  }));

  const urls = [
    ...staticRoutes.map(buildUrlEntry),
    ...contentEntries.map(buildUrlEntry),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls.join('\n'),
    '</urlset>',
    '',
  ].join('\n');

  const filePath = join(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(filePath, xml, 'utf8');
  console.log(`Sitemap: wrote ${urls.length} URLs to ${filePath} (${contentSlugs.length} content pages).`);
};

generate().catch((error) => {
  console.error('Sitemap generation failed:', error);
  process.exit(1);
});