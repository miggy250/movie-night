import {motion} from 'motion/react';
import {getImageUrl, type MovieData} from '../../services/movieService';

interface SearchResultsSectionProps {
  searchQuery: string;
  results: MovieData[];
  onMovieSelect: (movie: MovieData) => void;
}

export default function SearchResultsSection({
  searchQuery,
  results,
  onMovieSelect,
}: SearchResultsSectionProps) {
  return (
    <section className="pt-32 px-4 md:px-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-8">Search Results for "{searchQuery}"</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {results.map((movie) => (
          <motion.div
            key={movie.id}
            whileHover={{scale: 1.05}}
            onClick={() => onMovieSelect(movie)}
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
  );
}
