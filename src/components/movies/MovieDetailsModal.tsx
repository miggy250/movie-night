import {AnimatePresence, motion} from 'motion/react';
import {AlertCircle, LoaderCircle, Monitor, Play, Plus, Star, X} from 'lucide-react';
import Badge from '../common/Badge';
import {getGenreNames, getImageUrl, type MovieData} from '../../services/movieService';

interface MovieDetailsModalProps {
  movie: MovieData | null;
  isPlaying: boolean;
  isPlayerLoading: boolean;
  playerError: string | null;
  playerUrl: string | null;
  relatedMovies: MovieData[];
  onClose: () => void;
  onPlay: () => void;
}

export default function MovieDetailsModal({
  movie,
  isPlaying,
  isPlayerLoading,
  playerError,
  playerUrl,
  relatedMovies,
  onClose,
  onPlay,
}: MovieDetailsModalProps) {
  return (
    <AnimatePresence>
      {movie && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 md:px-0">
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            layoutId={movie.title}
            initial={{opacity: 0, scale: 0.95, y: 50}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 50}}
            className="relative z-[1001] bg-[#181818] w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl border border-white/5 no-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-[1002] w-12 h-12 rounded-full bg-netflix-dark/80 flex items-center justify-center hover:bg-[#282828] transition-all hover:scale-110 active:scale-95 group"
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
            </button>

            <div className="relative aspect-video w-full">
              {isPlaying && playerUrl ? (
                <iframe
                  src={playerUrl}
                  className="w-full h-full border-none shadow-inner"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  title="Movie Player"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <>
                  <img
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    className="w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

                  <div className="absolute bottom-12 left-12 w-2/3">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter drop-shadow-xl">{movie.title}</h2>

                    <div className="flex gap-4">
                      <button
                        onClick={onPlay}
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

                    {(isPlayerLoading || playerError) && (
                      <div className="mt-6 max-w-xl rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur-sm">
                        {isPlayerLoading ? (
                          <div className="flex items-center gap-3 text-white/85">
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            <span>Loading movie...</span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3 text-white/85">
                            <AlertCircle className="mt-0.5 h-5 w-5 text-netflix-red shrink-0" />
                            <span>{playerError}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-4 text-xl mb-8">
                  <span className="text-green-500 font-bold">Highly Recommended</span>
                  <span className="text-white/60">{movie.release_date.split('-')[0]}</span>
                  <span className="px-2 py-0.5 border border-white/40 rounded text-xs">13+</span>
                  <Badge text="HD" className="border border-white/40 opacity-60" />
                </div>

                <p className="text-xl leading-relaxed text-gray-200 font-light">{movie.overview}</p>

                <div className="mt-12 p-8 bg-netflix-red/5 border border-netflix-red/20 rounded-2xl flex items-start gap-6">
                  <Monitor className="w-8 h-8 text-netflix-red mt-1" />

                  <div>
                    <h4 className="font-bold text-netflix-red text-lg mb-2">Full Movie Streaming</h4>
                    <p className="text-gray-400 italic">
                      Streaming complete movie in HD quality via Vidsrc. No ads, instant playback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:w-64 lg:w-80 shrink-0 space-y-8 pt-2">
                <div>
                  <span className="text-gray-500 text-sm block mb-1 uppercase tracking-wider font-bold">Rating</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p className="text-lg font-bold">{movie.vote_average.toFixed(1)} / 10</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 text-sm block mb-1 uppercase tracking-wider font-bold">Genres</span>
                  <p className="text-sm opacity-80 leading-relaxed">
                    {getGenreNames(movie.genre_ids) || 'Action, Drama, Thriller'}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 text-sm block mb-1 uppercase tracking-wider font-bold">Status</span>
                  <p className="text-sm opacity-80 italic">Released Worldwide</p>
                </div>
              </div>
            </div>

            <div className="px-12 pb-20">
              <h3 className="text-2xl font-bold mb-8">More Like This</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedMovies.map((relatedMovie) => (
                  <div key={relatedMovie.id} className="bg-[#2F2F2F] rounded-lg overflow-hidden group cursor-pointer">
                    <div className="aspect-video relative">
                      <img src={getImageUrl(relatedMovie.backdrop_path)} className="w-full h-full object-cover" alt={relatedMovie.title} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-10 h-10" />
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm truncate">{relatedMovie.title}</span>
                        <Plus className="w-4 h-4 opacity-50 shrink-0" />
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2">{relatedMovie.overview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
