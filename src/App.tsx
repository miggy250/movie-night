/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Play, 
  Plus, 
  Info, 
  Search, 
  Bell, 
  ChevronRight, 
  ChevronLeft,
  X,
  Volume2,
  VolumeX,
  Star,
  Monitor,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getTrendingMovies, 
  searchMovies, 
  getImageUrl, 
  getEmbedUrl,
  getGenreNames,
  MovieData 
} from './services/movieService';

// --- Components ---

const Badge = ({ text, className = "" }: { text: string; className?: string }) => (
  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${className}`}>
    {text}
  </span>
);

export default function App() {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [searchResults, setSearchResults] = useState<MovieData[]>([]);
  const [featured, setFeatured] = useState<MovieData | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const movieRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const trending = await getTrendingMovies();
      setMovies(trending);
      if (trending.length > 0) {
        setFeatured(trending[0]);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const results = await searchMovies(searchQuery);
    setSearchResults(results);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (movieRowRef.current) {
      const { scrollLeft, clientWidth } = movieRowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      movieRowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-netflix-dark overflow-x-hidden selection:bg-netflix-red selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-100 transition-all duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-netflix-dark shadow-2xl backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-8">
          <h1 
            onClick={() => {
              setIsSearching(false);
              setSearchQuery('');
            }}
            className="text-netflix-red text-2xl md:text-3xl font-black tracking-tighter uppercase italic cursor-pointer scale-110 md:scale-100 origin-left"
          >
            Movie Night
          </h1>
          <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-300">
            {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Titles, people, genres"
              className="bg-black/40 border border-white/20 px-4 py-1.5 pl-10 rounded text-sm focus:outline-none focus:border-white/40 w-32 md:w-64 transition-all"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100" />
          </form>
          <Bell className="w-5 h-5 cursor-pointer hidden md:block" />
          <div className="w-8 h-8 bg-netflix-red rounded cursor-pointer flex items-center justify-center font-bold text-sm">
            M
          </div>
        </div>
      </nav>

      {isSearching ? (
        <section className="pt-32 px-4 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold mb-8">Search Results for "{searchQuery}"</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {searchResults.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedMovie(movie)}
                className="aspect-[2/3] relative rounded-lg overflow-hidden cursor-pointer"
              >
                <img 
                  src={getImageUrl(movie.poster_path)} 
                  alt={movie.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* Hero Section */}
          {featured && (
            <section className="relative h-[85vh] w-full flex items-center">
              <div className="absolute inset-0 z-0">
                <img 
                  src={getImageUrl(featured.backdrop_path, 'original')} 
                  alt="Hero" 
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark via-netflix-dark/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
              </div>

              <div className="relative z-10 px-4 md:px-12 max-w-3xl mt-20">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="w-4 h-4 text-netflix-red" />
                    <span className="text-white font-bold tracking-[0.2em] text-[10px] uppercase">Original Streaming Engine</span>
                  </div>
                  <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
                    {featured.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-300 text-sm mb-6">
                    <span className="text-green-500 font-bold">{Math.round(featured.vote_average * 10)}% Match</span>
                    <span>{featured.release_date.split('-')[0]}</span>
                    <Badge text="4K Ultra HD" className="border border-white/40 text-white/80" />
                  </div>
                  <p className="text-lg text-gray-200 mb-8 max-w-xl leading-relaxed line-clamp-3 drop-shadow-md">
                    {featured.overview}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        setSelectedMovie(featured);
                        setIsPlaying(true);
                      }}
                      className="flex items-center gap-3 px-10 py-3.5 bg-white text-black font-bold rounded hover:bg-white/90 transition-all active:scale-95"
                    >
                      <Play className="w-6 h-6" fill="black" />
                      Play
                    </button>
                    <button 
                      onClick={() => setSelectedMovie(featured)}
                      className="flex items-center gap-3 px-10 py-3.5 bg-gray-500/50 text-white font-bold rounded hover:bg-gray-500/40 transition-all backdrop-blur-md"
                    >
                      <Info className="w-6 h-6" />
                      More Info
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="absolute bottom-20 right-0 px-12 flex items-center gap-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="bg-gray-800/80 border-l-4 border-netflix-red py-1.5 px-6 text-sm font-bold tracking-widest">
                  13+
                </div>
              </div>
            </section>
          )}

          {/* Rows */}
          <main className="relative -mt-20 z-10 pb-24 space-y-12">
            
            {/* Trending Row */}
            <div className="px-4 md:px-12">
              <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2 group cursor-pointer w-fit">
                Trending Day
                <ChevronRight className="w-5 h-5 text-netflix-red group-hover:translate-x-1 transition-transform" />
              </h2>
              
              <div className="relative group/row">
                <button 
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-0 bottom-0 z-40 bg-black/60 w-12 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center -ml-12 md:ml-0"
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>

                <div 
                  ref={movieRowRef}
                  className="flex gap-2.5 overflow-x-scroll scrollbar-hide py-8"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {movies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      whileHover={{ 
                        scale: 1.15,
                        zIndex: 50,
                        transition: { duration: 0.3 }
                      }}
                      onClick={() => setSelectedMovie(movie)}
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
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-0 bottom-0 z-40 bg-black/60 w-12 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center -mr-12 md:mr-0"
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </div>
            </div>

            {/* Grid Category */}
            <div className="px-4 md:px-12">
               <h2 className="text-xl font-bold mb-6">Popular on Movie Night</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {movies.slice(5, 13).map((movie) => (
                    <motion.div 
                      key={movie.id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedMovie(movie)}
                      className="aspect-video relative rounded-lg overflow-hidden cursor-pointer group shadow-xl"
                    >
                       <img 
                        src={getImageUrl(movie.backdrop_path)} 
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500" 
                        alt="Backdrop"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute bottom-4 left-4">
                          <h3 className="font-bold text-lg drop-shadow-md">{movie.title}</h3>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </main>
        </>
      )}

      {/* Detail & Player Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 md:px-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => {
                setSelectedMovie(null);
                setIsPlaying(false);
              }}
            />
            
            <motion.div
              layoutId={selectedMovie.title}
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="relative z-[1001] bg-[#181818] w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl border border-white/5 no-scrollbar"
            >
              <button 
                onClick={() => {
                  setSelectedMovie(null);
                  setIsPlaying(false);
                }}
                className="absolute top-6 right-6 z-[1002] w-12 h-12 rounded-full bg-netflix-dark/80 flex items-center justify-center hover:bg-[#282828] transition-all hover:scale-110 active:scale-95 group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
              </button>

              <div className="relative aspect-video w-full">
                {isPlaying ? (
                  <iframe
                    src={getEmbedUrl(selectedMovie.id)}
                    className="w-full h-full border-none shadow-inner"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    title="Movie Player"
                  />
                ) : (
                  <>
                    <img 
                      src={getImageUrl(selectedMovie.backdrop_path, 'original')} 
                      alt="Backdrop" 
                      className="w-full h-full object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-12 w-2/3">
                       <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter drop-shadow-xl">{selectedMovie.title}</h2>
                       <div className="flex gap-4">
                          <button 
                            onClick={() => setIsPlaying(true)}
                            className="flex items-center gap-3 px-12 py-4 bg-white text-black font-bold rounded-md hover:bg-white/90 transition-all active:scale-95"
                          >
                            <Play fill="black" className="w-6 h-6" />
                            Play Now
                          </button>
                          <button className="p-4 rounded-full border-2 border-white/30 hover:border-white transition-colors bg-white/5 hover:bg-white/10 active:scale-90">
                            <Plus className="w-6 h-6" />
                          </button>
                          <button className="p-4 rounded-full border-2 border-white/30 hover:border-white transition-colors bg-white/5 hover:bg-white/10 active:scale-90">
                            <Star className="w-6 h-6" />
                          </button>
                       </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
                 <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-4 text-xl mb-8">
                       <span className="text-green-500 font-bold">Highly Recommended</span>
                       <span className="text-white/60">{selectedMovie.release_date.split('-')[0]}</span>
                       <span className="px-2 py-0.5 border border-white/40 rounded text-xs">13+</span>
                       <Badge text="HD" className="border border-white/40 opacity-60" />
                    </div>
                    <p className="text-xl leading-relaxed text-gray-200 font-light">
                       {selectedMovie.overview}
                    </p>
                    
                    <div className="mt-12 p-8 bg-netflix-red/5 border border-netflix-red/20 rounded-2xl flex items-start gap-6">
                       <Monitor className="w-8 h-8 text-netflix-red mt-1" />
                       <div>
                          <h4 className="font-bold text-netflix-red text-lg mb-2">Theater Experience</h4>
                          <p className="text-gray-400 italic">Streaming at maximum resolution based on your connection quality. Advanced sync enabled.</p>
                       </div>
                    </div>
                 </div>

                 <div className="md:w-64 lg:w-80 shrink-0 space-y-8 pt-2">
                    <div>
                       <span className="text-gray-500 text-sm block mb-1 uppercase tracking-wider font-bold">Rating</span>
                       <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <p className="text-lg font-bold">{selectedMovie.vote_average.toFixed(1)} / 10</p>
                       </div>
                    </div>
                    <div>
                       <span className="text-gray-500 text-sm block mb-1 uppercase tracking-wider font-bold">Genres</span>
                       <p className="text-sm opacity-80 leading-relaxed">
                         {getGenreNames(selectedMovie.genre_ids) || "Action, Drama, Thriller"}
                       </p>
                    </div>
                    <div>
                       <span className="text-gray-500 text-sm block mb-1 uppercase tracking-wider font-bold">Status</span>
                       <p className="text-sm opacity-80 italic">Released Worldwide</p>
                    </div>
                 </div>
              </div>
              
              {/* Similar Movies */}
              <div className="px-12 pb-20">
                 <h3 className="text-2xl font-bold mb-8">More Like This</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movies.slice(0, 6).map(m => (
                       <div key={m.id} className="bg-[#2F2F2F] rounded-lg overflow-hidden group cursor-pointer">
                          <div className="aspect-video relative">
                             <img src={getImageUrl(m.backdrop_path)} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play className="w-10 h-10" />
                             </div>
                          </div>
                          <div className="p-4">
                             <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm truncate">{m.title}</span>
                                <Plus className="w-4 h-4 opacity-50 shrink-0" />
                             </div>
                             <p className="text-xs text-gray-400 line-clamp-2">{m.overview}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Search Overlay Background */}
      {isSearching && (
        <div 
          className="fixed inset-0 bg-netflix-dark z-[-1] transition-opacity"
          onClick={() => setIsSearching(false)}
        />
      )}
    </div>
  );
}

