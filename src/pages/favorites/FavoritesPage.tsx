import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowLeft, Search, Filter, Grid, List } from 'lucide-react';
import ModernMovieCard from '../../components/movies/ModernMovieCard';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

export default function FavoritesPage() {
  const { favorites } = useUserPreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'rating'>('title');

  const filteredFavorites = favorites.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      case 'rating':
        return b.vote_average - a.vote_average;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-black pt-4">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-600 fill-red-600" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                My Favorites
              </h1>
            </div>
          </div>

          {/* Stats and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="text-gray-400">
              {favorites.length === 0 ? (
                <span>No favorites yet</span>
              ) : (
                <span>{favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} favorited</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search favorites..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors"
              >
                <option value="title">Sort by Title</option>
                <option value="date">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-white/10 border border-white/20 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No favorites yet</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start adding movies to your favorites by clicking the heart icon on any movie card or in the movie details.
              </p>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Browse Movies
              </button>
            </div>
          ) : sortedFavorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No results found</h2>
              <p className="text-gray-400 mb-4">
                No favorites match your search for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                viewMode === 'grid'
                  ? `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pb-12`
                  : `space-y-4 pb-12`
              }
            >
              {sortedFavorites.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={
                    viewMode === 'grid' ? '' : 'flex gap-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors'
                  }
                >
                  {viewMode === 'grid' ? (
                    <ModernMovieCard
                      movie={movie}
                      layout="poster"
                      size="medium"
                      onSelect={(movie) => {
                        // Navigate to movie details
                        console.log('Navigate to movie:', movie);
                      }}
                      showPlayButton={true}
                    />
                  ) : (
                    <>
                      <div className="w-24 h-36 flex-shrink-0">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-2 truncate">{movie.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{movie.overview}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{movie.release_date.split('-')[0]}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
    </div>
  );
}
