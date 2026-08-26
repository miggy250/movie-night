import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ModernMovieCard from './ModernMovieCard';
import { getContentReleaseDate, type MovieData } from '../../services/movieService';

interface NewReleasePreviewStackProps {
  movies: MovieData[];
  onMovieSelect: (movie: MovieData) => void;
  title?: string;
  subtitle?: string;
  className?: string;
  pageSize?: number;
  sortMovies?: boolean;
  autoRotate?: boolean;
  rotateEveryMs?: number;
}

const defaultTitle = 'Newest first preview';
const defaultSubtitle = 'Fresh arrivals stay at the front, and the stack rotates automatically.';

export default function NewReleasePreviewStack({
  movies,
  onMovieSelect,
  title = defaultTitle,
  subtitle = defaultSubtitle,
  className = '',
  pageSize = 10,
  sortMovies = true,
  autoRotate = true,
  rotateEveryMs = 5500,
}: NewReleasePreviewStackProps) {
  const prefersReducedMotion = useReducedMotion();
  const [page, setPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const sortedMovies = useMemo(() => {
    if (!sortMovies) {
      return movies;
    }

    return [...movies].sort((a, b) => {
      const dateDelta = new Date(getContentReleaseDate(b)).getTime() - new Date(getContentReleaseDate(a)).getTime();
      if (dateDelta !== 0) {
        return dateDelta;
      }

      return (b.vote_average || 0) - (a.vote_average || 0);
    });
  }, [movies, sortMovies]);

  const pageCount = Math.max(1, Math.ceil(sortedMovies.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visibleMovies = sortedMovies.slice(safePage * pageSize, safePage * pageSize + pageSize);

  useEffect(() => {
    setPage(0);
  }, [sortedMovies.length, pageSize]);

  useEffect(() => {
    if (!autoRotate || prefersReducedMotion || pageCount <= 1 || isHovered) {
      return;
    }

    const interval = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, rotateEveryMs);

    return () => window.clearInterval(interval);
  }, [autoRotate, isHovered, pageCount, prefersReducedMotion, rotateEveryMs]);

  const jumpToPage = (nextPage: number) => {
    const normalizedPage = Math.min(pageCount - 1, Math.max(0, nextPage));
    setPage(normalizedPage);
  };

  if (sortedMovies.length === 0) {
    return null;
  }

  return (
    <section
      className={`rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.18),_transparent_38%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(0,0,0,0.42))] px-4 py-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-6 sm:py-6 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => jumpToPage(safePage - 1)}
            disabled={safePage === 0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => jumpToPage(safePage + 1)}
            disabled={safePage >= pageCount - 1}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-500 sm:text-sm">
        <span>
          Showing {safePage * pageSize + 1} to {Math.min(sortedMovies.length, (safePage + 1) * pageSize)} of {sortedMovies.length}
        </span>
        <span>
          Page {safePage + 1} of {pageCount}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={safePage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.24 }}
          className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-5 md:grid-rows-2 md:gap-8"
        >
          {visibleMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative"
            >
              <ModernMovieCard
                movie={movie}
                layout="poster"
                size="medium"
                onSelect={onMovieSelect}
                className="transition-none"
              />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
