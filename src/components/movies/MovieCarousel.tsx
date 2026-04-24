import {ChevronLeft, ChevronRight, Heart, Play, Plus} from 'lucide-react';
import {motion} from 'motion/react';
import type {RefObject} from 'react';
import Badge from '../common/Badge';
import {getImageUrl, type MovieData} from '../../services/movieService';

interface MovieCarouselProps {
  movies: MovieData[];
  rowRef: RefObject<HTMLDivElement | null>;
  onScroll: (direction: 'left' | 'right') => void;
  onMovieSelect: (movie: MovieData) => void;
}

export default function MovieCarousel({
  movies,
  rowRef,
  onScroll,
  onMovieSelect,
}: MovieCarouselProps) {
  return (
    <div className="px-4 md:px-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 group cursor-pointer w-fit">
        Trending Day
        <ChevronRight className="w-5 h-5 text-netflix-red group-hover:translate-x-1 transition-transform" />
      </h2>

      <div className="relative group/row">
        <button
          onClick={() => onScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 bg-black/60 w-12 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center -ml-12 md:ml-0"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-2.5 overflow-x-scroll scrollbar-hide py-8"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{
                scale: 1.15,
                zIndex: 50,
                transition: {duration: 0.3},
              }}
              onClick={() => onMovieSelect(movie)}
              className="flex-none w-[140px] md:w-[200px] aspect-[2/3] relative rounded-md overflow-hidden cursor-pointer shadow-black/80 shadow-2xl group/card"
            >
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover group-hover/card:brightness-50 transition-all"
              />

              <div className="absolute top-2 left-2 flex gap-1 shadow-2xl">
                <Badge text="HD" className="bg-white/20 backdrop-blur-md text-white border border-white/20" />
                <Badge text="Live" className="bg-netflix-red text-white animate-pulse" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black via-black/40 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-netflix-dark/60 border border-white/40 flex items-center justify-center hover:border-white group-hover/card:animate-pulse">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-netflix-dark/60 border border-white/40 flex items-center justify-center hover:border-white ml-auto">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-sm font-bold truncate">{movie.title}</h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-500 text-[10px] font-bold">98% Match</span>
                  <span className="text-[10px] opacity-60">{movie.release_date.split('-')[0]}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => onScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 bg-black/60 w-12 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center -mr-12 md:mr-0"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
