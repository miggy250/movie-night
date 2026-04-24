import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  Plus, 
  Heart, 
  Star, 
  Share2, 
  Download,
  AlertCircle,
  LoaderCircle,
  Monitor,
  Calendar,
  Clock,
  Film,
  Volume2,
  Maximize,
  Minimize
} from 'lucide-react';
import Badge from '../common/Badge';
import { getImageUrl, getGenreNames, type MovieData } from '../../services/movieService';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

interface ModernMovieDetailsModalProps {
  movie: MovieData | null;
  isPlaying: boolean;
  isPlayerLoading: boolean;
  playerError: string | null;
  playerUrl: string | null;
  relatedMovies: MovieData[];
  onClose: () => void;
  onPlay: () => void;
}

export default function ModernMovieDetailsModal({
  movie,
  isPlaying,
  isPlayerLoading,
  playerError,
  playerUrl,
  relatedMovies,
  onClose,
  onPlay,
}: ModernMovieDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'similar'>('overview');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { isFavorite, addToFavorites, isWatchLater, addToWatchLater } = useUserPreferences();
  
  const isLiked = movie ? isFavorite(movie.id) : false;
  const isInList = movie ? isWatchLater(movie.id) : false;

  useEffect(() => {
    if (movie) {
      setIsImageLoaded(false);
      setActiveTab('overview');
    }
  }, [movie]);

  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts for video controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlaying) {
        onClose();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleFullscreen();
      }
    };

    if (isPlaying) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isPlaying, onClose, handleFullscreen]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie) {
      addToFavorites(movie);
    }
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie) {
      addToWatchLater(movie);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share && movie) {
      navigator.share({
        title: movie.title,
        text: movie.overview,
        url: window.location.href
      });
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement download functionality
    console.log('Download movie:', movie?.title);
  };

  if (!movie) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          layoutId={movie.title}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative z-[1001] ${
            isFullscreen 
              ? 'w-full h-full' 
              : 'w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] bg-black sm:rounded-2xl'
          } overflow-hidden flex flex-col`}
        >
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="sm:hidden absolute top-4 right-4 z-[1002] w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Video Player Section */}
          <div className="relative aspect-video w-full bg-black">
            {isPlaying && playerUrl ? (
              <div 
                className="relative w-full h-full"
                onDoubleClick={onClose}
              >
                <iframe
                  src={playerUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  title="Movie Player"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="eager"
                />
                
                {/* Close Button Overlay */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-2 right-2 z-[1003] w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>

                
                              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Background Image */}
                <motion.img
                  src={getImageUrl(movie.backdrop_path, 'original')}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  onLoad={() => setIsImageLoaded(true)}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

                {/* Loading Placeholder */}
                <AnimatePresence>
                  {!isImageLoaded && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gray-900"
                    />
                  )}
                </AnimatePresence>

                {/* Play Button and Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 lg:p-12">
                  {/* Top Section */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge text="HD" className="bg-white/20 backdrop-blur-md text-white border border-white/30" />
                        <Badge text="4K" className="bg-blue-600/80 text-white" />
                        <Badge text="DOLBY" className="bg-green-600/80 text-white" />
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                        {movie.title}
                      </h1>
                    </div>

                    {/* Desktop Close Button */}
                    <button
                      onClick={onClose}
                      className="hidden sm:block w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Center - Play Button */}
                  <div className="flex-1 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onPlay}
                      disabled={isPlayerLoading}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:bg-gray-100 transition-all disabled:opacity-50"
                    >
                      {isPlayerLoading ? (
                        <LoaderCircle className="w-8 h-8 sm:w-10 sm:h-10 text-black animate-spin" />
                      ) : (
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
                      )}
                    </motion.button>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onPlay}
                      className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <Play className="w-5 h-5 fill-black" />
                      <span>Play</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToList}
                      className={`p-3 rounded-full border transition-all ${
                        isInList
                          ? 'bg-green-600/20 border-green-600 text-green-600'
                          : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                      }`}
                      title={isInList ? "Remove from Watch Later" : "Add to Watch Later"}
                    >
                      <Clock className={`w-5 h-5 ${isInList ? 'fill-green-600' : ''}`} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLike}
                      className={`p-3 rounded-full border transition-all ${
                        isLiked
                          ? 'bg-red-600/20 border-red-600 text-red-600'
                          : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                      }`}
                      title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="p-3 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {playerError && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8"
                      >
                        <div className="bg-red-600/20 backdrop-blur-sm border border-red-600/30 rounded-lg p-4 flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <span className="text-white text-sm">{playerError}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Content Tabs */}
          <div className="bg-black border-t border-white/10">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'details', label: 'Details' },
                { id: 'similar', label: `Similar (${relatedMovies.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-red-600 bg-white/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8 max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
                      <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <span className="text-gray-500 text-sm">Rating</span>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-white font-bold">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-gray-500 text-sm">Year</span>
                        <span className="text-white">{movie.release_date.split('-')[0]}</span>
                      </div>
                      <div className="space-y-2">
                        <span className="text-gray-500 text-sm">Duration</span>
                        <span className="text-white">2h 15min</span>
                      </div>
                      <div className="space-y-2">
                        <span className="text-gray-500 text-sm">Quality</span>
                        <span className="text-white">4K Ultra HD</span>
                      </div>
                    </div>

                    <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Monitor className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-red-600 mb-1">Full Movie Streaming</h4>
                          <p className="text-gray-300 text-sm">
                            Streaming complete movie in HD quality via Vidsrc. No ads, instant playback.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {getGenreNames(movie.genre_ids).split(', ').map((genre) => (
                          <div key={genre}>
                            <Badge
                              text={genre}
                              className="bg-white/10 text-white border border-white/20"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-bold text-white">Technical Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Video Quality</span>
                            <span className="text-white">4K Ultra HD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Audio</span>
                            <span className="text-white">Dolby Atmos</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Subtitles</span>
                            <span className="text-white">English, Spanish</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-white">Streaming Info</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Source</span>
                            <span className="text-white">Vidsrc</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Availability</span>
                            <span className="text-green-500">Live Now</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ads</span>
                            <span className="text-white">None</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'similar' && (
                  <motion.div
                    key="similar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Similar Movies</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {relatedMovies.map((relatedMovie) => (
                        <motion.div
                          key={relatedMovie.id}
                          whileHover={{ scale: 1.05 }}
                          className="aspect-video rounded-lg overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={getImageUrl(relatedMovie.backdrop_path)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            alt={relatedMovie.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-bold line-clamp-1">{relatedMovie.title}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
