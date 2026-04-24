import {Info, Monitor, Play, Volume2, VolumeX} from 'lucide-react';
import {motion} from 'motion/react';
import Badge from '../common/Badge';
import {getImageUrl, type MovieData} from '../../services/movieService';

interface FeaturedHeroProps {
  movie: MovieData;
  isMuted: boolean;
  onToggleMute: () => void;
  onPlay: () => void;
  onOpenDetails: () => void;
}

export default function FeaturedHero({
  movie,
  isMuted,
  onToggleMute,
  onPlay,
  onOpenDetails,
}: FeaturedHeroProps) {
  return (
    <section className="relative h-[85vh] w-full flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark via-netflix-dark/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-4 md:px-12 max-w-3xl mt-20">
        <motion.div
          initial={{opacity: 0, x: -50}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.8}}
        >
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-netflix-red" />
            <span className="text-white font-bold tracking-[0.2em] text-[10px] uppercase">Original Streaming Engine</span>
          </div>

          <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
            {movie.title}
          </h2>

          <div className="flex items-center gap-4 text-gray-300 text-sm mb-6">
            <span className="text-green-500 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
            <span>{movie.release_date.split('-')[0]}</span>
            <Badge text="4K Ultra HD" className="border border-white/40 text-white/80" />
          </div>

          <p className="text-lg text-gray-200 mb-8 max-w-xl leading-relaxed line-clamp-3 drop-shadow-md">
            {movie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onPlay}
              className="flex items-center gap-3 px-10 py-3.5 bg-white text-black font-bold rounded hover:bg-white/90 transition-all active:scale-95"
            >
              <Play className="w-6 h-6" fill="black" />
              Play
            </button>

            <button
              onClick={onOpenDetails}
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
          onClick={onToggleMute}
          className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="bg-gray-800/80 border-l-4 border-netflix-red py-1.5 px-6 text-sm font-bold tracking-widest">
          13+
        </div>
      </div>
    </section>
  );
}
