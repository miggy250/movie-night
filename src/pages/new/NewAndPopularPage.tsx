import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import NewReleasePreviewStack from '../../components/movies/NewReleasePreviewStack';
import { LoadingSpinner } from '../../components/common/LoadingStates';
import {
  getContentSlug,
  getNewReleaseMovies,
  getTrendingMovies,
  type MovieData,
} from '../../services/movieService';

export default function NewAndPopularPage() {
  const navigate = useNavigate();
  const [newReleases, setNewReleases] = useState<MovieData[]>([]);
  const [trending, setTrending] = useState<MovieData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      try {
        const [newData, trendingData] = await Promise.all([
          getNewReleaseMovies(),
          getTrendingMovies(),
        ]);
        if (cancelled) return;
        setNewReleases(newData);
        setTrending(trendingData);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const openMovie = (movie: MovieData) => navigate(`/movies/${getContentSlug(movie)}`);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading new releases..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-3 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <TrendingUp className="h-6 w-6 text-red-300" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">New and Popular Movies</h1>
              <p className="text-sm text-gray-400">Fresh releases and trending films</p>
            </div>
          </div>
        </div>
      </header>

      {newReleases.length > 0 && (
        <section className="px-3 pb-16 sm:px-6 lg:px-8">
          <NewReleasePreviewStack
            movies={newReleases}
            onMovieSelect={openMovie}
            title="Newest first preview"
            subtitle="Fresh arrivals stay at the front, the stack advances on its own, and you can step through pages manually."
            pageSize={10}
          />
        </section>
      )}

      {trending.length > 0 && (
        <section className="px-3 pb-16 sm:px-6 lg:px-8">
          <NewReleasePreviewStack
            movies={trending}
            onMovieSelect={openMovie}
            title="Trending Now"
            subtitle="The most popular movies right now, shown with the same stacked browser."
            sortMovies={false}
            pageSize={10}
          />
        </section>
      )}

      {trending.length === 0 && newReleases.length === 0 && (
        <div className="px-3 pb-16 text-center sm:px-6 lg:px-8">
          <p className="text-gray-400">No titles available right now. Please check back soon.</p>
        </div>
      )}
    </div>
  );
}
