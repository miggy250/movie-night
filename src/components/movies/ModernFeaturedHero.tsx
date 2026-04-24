import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import { getImageUrl, type MovieData } from '../../services/movieService';

interface ModernFeaturedHeroProps {
  movie: MovieData;
  isMuted: boolean;
  onToggleMute: () => void;
  onPlay: () => void;
  onOpenDetails: () => void;
}

export default function ModernFeaturedHero({
  movie,
  isMuted,
  onToggleMute,
  onPlay,
  onOpenDetails,
}: ModernFeaturedHeroProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
  }, [movie.id]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay();
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDetails();
  };

  return (
    <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <motion.img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ 
            scale: isHovered ? 1.05 : 1.1,
            y: isHovered ? -10 : 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Loading Placeholder */}
      <AnimatePresence>
        {!isImageLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          />
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Title and Badges */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge 
                    text="FEATURED" 
                    className="bg-red-600 text-white px-3 py-1 text-sm font-bold" 
                  />
                  <Badge 
                    text="HD" 
                    className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-3 py-1" 
                  />
                  {movie.vote_average > 8 && (
                    <Badge 
                      text="CRITIC'S CHOICE" 
                      className="bg-yellow-600/80 backdrop-blur-md text-white px-3 py-1" 
                    />
                  )}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight">
                  {movie.title}
                </h1>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-bold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-300">/10</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.release_date.split('-')[0]}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>2h 15min</span>
                </div>
              </div>

              {/* Overview */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed line-clamp-3 sm:line-clamp-4"
              >
                {movie.overview}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayClick}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black" />
                  <span className="text-sm sm:text-base">Play Now</span>
                </motion.button>

                              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="hidden lg:block"
              >
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Streaming Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>4K Ultra HD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Dolby Atmos</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm flex items-center gap-2"
      >
        <span>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-4 bg-white/60 rounded-full"
        />
      </motion.div>

      {/* Responsive Mobile Adjustments */}
      <div className="lg:hidden absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Available Now</span>
          </div>
          <span>•</span>
          <span>HD Quality</span>
        </div>
      </div>
    </section>
  );
}
