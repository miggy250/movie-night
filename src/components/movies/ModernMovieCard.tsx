import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Star } from 'lucide-react';
import Badge from '../common/Badge';
import { getImageUrl, type MovieData } from '../../services/movieService';

interface ModernMovieCardProps {
  movie: MovieData;
  layout?: 'poster' | 'backdrop';
  size?: 'small' | 'medium' | 'large';
  onSelect: (movie: MovieData) => void;
  showPlayButton?: boolean;
  className?: string;
}

const sizeConfig = {
  small: {
    poster: 'w-[120px] h-[180px]',
    backdrop: 'w-[200px] h-[112px]',
    titleSize: 'text-xs',
    buttonSize: 'w-6 h-6'
  },
  medium: {
    poster: 'w-[160px] h-[240px] sm:w-[200px] sm:h-[300px]',
    backdrop: 'w-[300px] h-[169px] sm:w-[400px] sm:h-[225px]',
    titleSize: 'text-sm sm:text-base',
    buttonSize: 'w-8 h-8'
  },
  large: {
    poster: 'w-[200px] h-[300px] sm:w-[240px] sm:h-[360px]',
    backdrop: 'w-[400px] h-[225px] sm:w-[500px] sm:h-[281px]',
    titleSize: 'text-base sm:text-lg',
    buttonSize: 'w-10 h-10'
  }
};

export default function ModernMovieCard({
  movie,
  layout = 'poster',
  size = 'medium',
  onSelect,
  showPlayButton = true,
  className = ''
}: ModernMovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const config = sizeConfig[size];
  const imagePath = layout === 'poster' ? movie.poster_path : movie.backdrop_path;
  const aspectRatio = layout === 'poster' ? 'aspect-[2/3]' : 'aspect-video';

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(movie);
  };

  const handleCardClick = () => {
    onSelect(movie);
  };

  return (
    <motion.div
      className={`relative ${config[layout]} ${aspectRatio} group cursor-pointer ${className}`}
      whileHover={{ scale: layout === 'poster' ? 1.05 : 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      layout
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full overflow-hidden rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl">
        {/* Image or Placeholder */}
        {!imageError ? (
          <img
            src={getImageUrl(imagePath)}
            alt={movie.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center p-4">
              <Film className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-xs sm:text-sm">No Image</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 z-10">
          <Badge 
            text="HD" 
            className="bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs px-2 py-1" 
          />
          {movie.vote_average > 7 && (
            <Badge 
              text="TOP" 
              className="bg-red-600/80 backdrop-blur-md text-white text-xs px-2 py-1" 
            />
          )}
        </div>

        {/* Hover Overlay with Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 bg-gradient-to-t from-black via-black/60 to-transparent"
            >
              {/* Top Actions */}
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  {showPlayButton && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlay}
                      className={`${config.buttonSize} rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors`}
                    >
                      <Play className={`w-3 h-3 sm:w-4 sm:h-4 text-black fill-black ml-0.5`} />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Bottom Info */}
              <div className="space-y-2">
                <h3 className={`font-bold text-white line-clamp-2 ${config.titleSize} drop-shadow-lg`}>
                  {movie.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-medium">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{movie.release_date.split('-')[0]}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Info (Always Visible on Large Cards) */}
        {size === 'large' && !isHovered && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className={`font-bold text-white line-clamp-1 ${config.titleSize} drop-shadow-lg`}>
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-white">{movie.vote_average.toFixed(1)}</span>
              <span className="text-gray-300">{movie.release_date.split('-')[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      <AnimatePresence>
        {!imageError && !isHovered && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gray-800 animate-pulse"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Re-export Film icon for placeholder
function Film({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
      <line x1="7" y1="2" x2="7" y2="22"/>
      <line x1="17" y1="2" x2="17" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="2" y1="7" x2="7" y2="7"/>
      <line x1="2" y1="17" x2="7" y2="17"/>
      <line x1="17" y1="17" x2="22" y2="17"/>
      <line x1="17" y1="7" x2="22" y2="7"/>
    </svg>
  );
}
