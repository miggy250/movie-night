import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const SITE_URL = 'https://movienight.giize.com';
const TODAY = new Date().toISOString().split('T')[0];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const upsertMeta = (html, attr, name, content) => {
  const escaped = escapeHtml(content);
  const re = new RegExp(`<meta\\s+${attr}="${name}"[^>]*>`, 'i');
  if (re.test(html)) {
    return html.replace(re, (match) => {
      if (/content="/i.test(match)) {
        return match.replace(/content="[^"]*"/i, `content="${escaped}"`);
      }
      return match.replace(/>\s*$/, ` content="${escaped}">`);
    });
  }
  return html.replace('</head>', `  <meta ${attr}="${name}" content="${escaped}" />\n  </head>`);
};

const upsertTitle = (html, title) =>
  html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

const upsertCanonical = (html, url) =>
  html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${escapeHtml(url)}"`);

const injectJsonLd = (html, data) =>
  html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(data)}</script>\n  </head>`);

const injectNoscript = (html, content) =>
  html.replace('</body>', `  <noscript>${escapeHtml(content)}</noscript>\n  </body>`);

const toTitle = (part) =>
  part
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const buildBreadcrumbJsonLd = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }];
  let accumulated = '';
  parts.forEach((part, index) => {
    accumulated += `/${part}`;
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: toTitle(part),
      item: `${SITE_URL}${accumulated}`,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
};

const SITE_NAME = 'Movie Night';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const staticRoutes = [
  {
    path: '/',
    title: 'Watch Movie Night Picks | Movie Night',
    description: 'Find hand-picked movies, TV shows, animations, new releases, and trailers to stream on Movie Night.',
    keywords: 'movie discovery, movie night picks, TV shows, animations, movie trailers',
    noscript: 'Movie Night helps you discover movies, TV shows, animations, and movie trailers. Browse trending movies, new releases, popular TV series, and curated editorial lists for date night, family night, and weekend watching.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      description: 'Find hand-picked movies, TV shows, animations, new releases, and trailers to stream on Movie Night.',
      url: `${SITE_URL}/`,
      image: DEFAULT_IMAGE,
      inLanguage: 'en-US',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  },
  {
    path: '/movies',
    title: 'Browse Movies Online | Movie Night',
    description: 'Browse the Movie Night movie collection and discover popular films, trending picks, and HD streaming options.',
    keywords: 'movie discovery, popular movies, TV shows, trailers, Movie Night',
    noscript: 'Browse the Movie Night movie collection. Discover popular films, trending picks, and HD streaming options with cast details, ratings, and similar titles.',
  },
  {
    path: '/new',
    title: 'New and Popular Movies | Movie Night',
    description: 'Discover new and popular movies, shows, and animations currently trending on Movie Night.',
    keywords: 'new movies, popular movies, trending shows, Movie Night new releases',
    noscript: 'Discover new and popular movies, TV shows, and animations trending on Movie Night, with trailers and streaming options.',
  },
  {
    path: '/tv-shows',
    title: 'Watch TV Shows Online | Movie Night',
    description: 'Browse TV shows by genre, rating, and release date on Movie Night, from drama and comedy to sci-fi and adventure.',
    keywords: 'watch tv shows online, stream series, browse TV shows, Movie Night TV',
    noscript: 'Browse TV shows by genre, rating, and release date on Movie Night. Find series from drama, comedy, sci-fi, adventure, and more.',
  },
  {
    path: '/trailers',
    title: 'Movie Trailers and New Releases | Movie Night',
    description: 'Watch upcoming movie and TV trailers, preview new releases, and find what to stream next on Movie Night.',
    keywords: 'movie trailers, new releases, upcoming movies, TV trailers, Movie Night trailers',
    noscript: 'Watch movie and TV trailers, preview new releases, and find what to stream next on Movie Night.',
  },
  {
    path: '/continue-watching',
    title: 'Continue Watching | Movie Night',
    description: 'Resume movies, TV shows, and animations you already started on Movie Night with saved source and episode details.',
    keywords: 'continue watching, resume movie, resume TV show, saved playback, Movie Night continue watching',
    noscript: 'Resume movies, TV shows, and animations you already started on Movie Night with saved playback sources and episode details.',
  },
  {
    path: '/liked',
    title: 'Liked Movies and Shows | Movie Night',
    description: 'Review the movies, TV shows, and animations you liked on Movie Night so your next watch is easy to find.',
    keywords: 'liked movies, saved shows, favorite streaming titles, Movie Night liked titles',
    noscript: 'Review the movies, TV shows, and animations you liked on Movie Night so your next watch is easy to find.',
  },
  {
    path: '/queue',
    title: 'Movie Watch Queue | Movie Night',
    description: 'Build a personal queue of movies, TV shows, and animations to watch later on Movie Night.',
    keywords: 'movie queue, watch later movies, saved TV shows, Movie Night queue',
    noscript: 'Build a personal queue of movies, TV shows, and animations to watch later on Movie Night.',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Movie Night',
    description: 'Read the Movie Night privacy policy to learn how we handle data, cookies, advertising, and user privacy.',
    keywords: 'privacy policy, Movie Night privacy, data policy, cookie policy',
    noscript: 'Read the Movie Night privacy policy to learn how we handle data, cookies, advertising, and user privacy.',
  },
];

const genreRoutes = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy',
  'history', 'horror', 'music', 'mystery', 'romance', 'sci-fi', 'thriller', 'war', 'western',
];

const listRoutes = [
  'best-movies-for-date-night',
  'best-family-movies',
  'what-to-watch-this-weekend',
];

const listTitles = {
  'best-movies-for-date-night': 'Best Movies for Date Night',
  'best-family-movies': 'Best Family Movies',
  'what-to-watch-this-weekend': 'What to Watch This Weekend',
};

const buildRouteMeta = (route) => {
  const canonical = `${SITE_URL}${route.path}`;
  const breadcrumbJsonLd = route.path === '/' ? null : buildBreadcrumbJsonLd(route.path);

  let html = route.baseHtml;
  html = upsertTitle(html, route.title);
  html = upsertMeta(html, 'name', 'description', route.description);
  html = upsertMeta(html, 'name', 'keywords', route.keywords);
  html = upsertMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  html = upsertMeta(html, 'property', 'og:type', 'website');
  html = upsertMeta(html, 'property', 'og:title', route.title);
  html = upsertMeta(html, 'property', 'og:description', route.description);
  html = upsertMeta(html, 'property', 'og:image', DEFAULT_IMAGE);
  html = upsertMeta(html, 'property', 'og:url', canonical);
  html = upsertMeta(html, 'property', 'og:site_name', SITE_NAME);
  html = upsertMeta(html, 'property', 'og:locale', 'en_US');
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', route.title);
  html = upsertMeta(html, 'name', 'twitter:description', route.description);
  html = upsertMeta(html, 'name', 'twitter:image', DEFAULT_IMAGE);
  html = upsertCanonical(html, canonical);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: route.title,
    description: route.description,
    url: canonical,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
  };

  if (route.jsonLd) {
    html = injectJsonLd(html, route.jsonLd);
  } else {
    html = injectJsonLd(html, pageJsonLd);
  }
  if (breadcrumbJsonLd) {
    html = injectJsonLd(html, breadcrumbJsonLd);
  }
  html = injectNoscript(html, `${route.title}. ${route.noscript} Browse now on ${SITE_URL}.`);

  return html;
};

const outDir = join(process.cwd(), 'dist');
let baseHtml;
try {
  baseHtml = readFileSync(join(outDir, 'index.html'), 'utf8');
} catch (error) {
  console.error('Prerender: dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const allRoutes = staticRoutes.map((route) => ({
  ...route,
  jsonLd: route.jsonLd || null,
  baseHtml,
}));

for (const slug of genreRoutes) {
  allRoutes.push({
    path: `/genres/${slug}`,
    title: `${toTitle(slug)} Movies and Shows | Movie Night`,
    description: `Browse ${slug} movies, TV shows, and animations on Movie Night with clean genre pages and curated streaming picks.`,
    keywords: `${slug} movies, ${slug} shows, stream ${slug}, Movie Night genres`,
    noscript: `Browse ${slug} movies, TV shows, and animations on Movie Night with curated streaming picks.`,
    baseHtml,
  });
}

for (const slug of listRoutes) {
  const listTitle = listTitles[slug] || toTitle(slug);
  allRoutes.push({
    path: `/lists/${slug}`,
    title: `${listTitle} | Movie Night`,
    description: `Explore the ${listTitle.toLowerCase()} list on Movie Night with curated recommendations and quick watch ideas.`,
    keywords: `${listTitle}, movie recommendations, curated movie lists, Movie Night lists`,
    noscript: `Explore the ${listTitle.toLowerCase()} list on Movie Night with curated recommendations and quick watch ideas.`,
    baseHtml,
  });
}

let written = 0;
for (const route of allRoutes) {
  const html = buildRouteMeta(route);
  const filePath = route.path === '/' ? join(outDir, 'index.html') : join(outDir, route.path.slice(1), 'index.html');
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html, 'utf8');
  written += 1;
}

console.log(`Prerender: wrote ${written} route pages to dist/ (last update ${TODAY}).`);