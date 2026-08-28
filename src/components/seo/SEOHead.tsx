import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  movieTitle?: string;
  movieDescription?: string;
  movieImage?: string;
  isSeries?: boolean;
  genres?: string[];
  datePublished?: string;
  contentRating?: string;
  aggregateRating?: { ratingValue: number; bestRating: number; worstRating: number };
  duration?: string;
}

export default function SEOHead({
  title = 'Movie Night - Discover Movies, Trailers, and Guides',
  description = 'Discover movies, TV shows, trailers, and editorial watch guides on Movie Night.',
  keywords = 'movie discovery, trailers, TV shows, watch guides, film recommendations, movie night, curated picks, entertainment discovery',
  image = '/og-image.jpg',
  url = 'https://movienight.giize.com',
  type = 'website',
  movieTitle,
  movieDescription,
  movieImage,
  isSeries = false,
  genres,
  datePublished,
  contentRating,
  aggregateRating,
  duration
}: SEOHeadProps) {

  useEffect(() => {
    document.title = title;

    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const removeMetaTag = (name: string) => {
      const meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (meta) meta.remove();
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Movie Night');
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('language', 'en');
    updateMetaTag('revisit-after', '1 days');

    updateMetaTag('og:type', type);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image.startsWith('http') ? image : `https://movienight.giize.com${image}`);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:url', url);
    updateMetaTag('og:site_name', 'Movie Night');
    updateMetaTag('og:locale', 'en_US');

    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `https://movienight.giize.com${image}`);
    updateMetaTag('twitter:site', '@MovieNight');
    updateMetaTag('twitter:creator', '@MovieNight');

    updateMetaTag('theme-color', '#dc2626');
    updateMetaTag('msapplication-TileColor', '#dc2626');
    updateMetaTag('application-name', 'Movie Night');
    updateMetaTag('apple-mobile-web-app-title', 'Movie Night');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    const movieSlug = movieTitle
      ? movieTitle.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : '';

    const isContentPage = Boolean(movieTitle);
    const pageType = isContentPage ? (isSeries ? 'TVSeries' : 'Movie') : 'WebSite';
    const contentImage = movieImage || image;
    const resolvedImage = (contentImage.startsWith('http') ? contentImage : `https://movienight.giize.com${contentImage}`);

    const baseStructured: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': pageType,
      name: movieTitle || 'Movie Night',
      description: movieDescription || description,
      url: movieTitle ? `${url}/movies/${movieSlug}` : url,
      image: resolvedImage,
      inLanguage: 'en-US',
    };

    if (isContentPage) {
      if (genres?.length) {
        baseStructured.genre = genres;
      }
      if (datePublished) {
        baseStructured.datePublished = datePublished;
      }
      if (contentRating) {
        baseStructured.contentRating = contentRating;
      }
      if (aggregateRating && aggregateRating.ratingValue > 0) {
        baseStructured.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: Number(aggregateRating.ratingValue.toFixed(1)),
          bestRating: aggregateRating.bestRating,
          worstRating: aggregateRating.worstRating,
        };
      }
      if (duration) {
        baseStructured.duration = duration;
      }
      baseStructured.potentialAction = {
        '@type': 'WatchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${url}/movies/${movieSlug}`,
          inLanguage: 'en-US'
        }
      };
    }

    if (!isContentPage) {
      baseStructured.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${url}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      };
    }

    const structuredScriptId = 'movie-night-content-jsonld';
    let structuredScript = document.querySelector(`script#${structuredScriptId}`) as HTMLScriptElement | null;
    if (!structuredScript) {
      structuredScript = document.createElement('script');
      structuredScript.id = structuredScriptId;
      structuredScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredScript);
    }
    structuredScript.textContent = JSON.stringify(baseStructured);

    const addLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"][href="${href}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        link.setAttribute('href', href);
        document.head.appendChild(link);
      }
    };

    addLink('dns-prefetch', '//image.tmdb.org');
    addLink('dns-prefetch', '//fonts.googleapis.com');
    addLink('preconnect', 'https://image.tmdb.org');

    return () => {
      removeMetaTag('movie-night-seo');
    };
  }, [title, description, keywords, image, url, type, movieTitle, movieDescription, movieImage, isSeries, genres, datePublished, contentRating, aggregateRating, duration]);

  return null;
}
