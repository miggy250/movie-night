/// <reference types="vite/client" />
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// User provided credentials for the demo
const FALLBACK_API_KEY = "8cb4712984e3c0d68f880b04c4d4f278";
const FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4Y2I0NzEyOTg0ZTNjMGQ2OGY4ODBiMDRjNGQ0ZjI3OCIsIm5iZiI6MTc3NjkzNDY1Ni4xNzgsInN1YiI6IjY5ZTlkZjAwZjY0NjE2ZGNmZmJiMWNjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kwHMCXgkOcz8pjX-sdIvrPB9D_7vWIYvoND0RvByB1A";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || FALLBACK_API_KEY;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN || FALLBACK_TOKEN;

export interface MovieData {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

const getHeaders = () => ({
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
});

export const getTrendingMovies = async (): Promise<MovieData[]> => {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/trending/movie/day`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.results || getFallbackMovies();
  } catch (err) {
    console.error('TMDB Fetch Error:', err);
    return getFallbackMovies();
  }
};

export const searchMovies = async (query: string): Promise<MovieData[]> => {
  if (!query) return [];
  try {
    const res = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('TMDB Search Error:', err);
    return [];
  }
};

const getFallbackMovies = (): MovieData[] => [
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6EszQwQvK6t6fxYvbtS.jpg",
    backdrop_path: "/rAiY_pUm9v9qEMpep9p4j70OESt.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    genre_ids: [12, 18, 878]
  },
  {
    id: 634649,
    title: "Spider-Man: No Way Home",
    overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    poster_path: "/1g0dhYtWyWtSSTvTOB3U9zY9Vv6.jpg",
    backdrop_path: "/iQFcwSG7CZpOMIuRYrSTP3pFCDf.jpg",
    release_date: "2021-12-15",
    vote_average: 8.0,
    genre_ids: [28, 12, 878]
  },
  {
    id: 438631,
    title: "Dune",
    overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster_path: "/d5NXSklZfsNcSR9pWhv97NVpms6.jpg",
    backdrop_path: "/lz21LZEjG7mS7AgmQO0LYG9YmQQ.jpg",
    release_date: "2021-09-15",
    vote_average: 7.8,
    genre_ids: [12, 18, 878]
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tW6WMUDp9aqSbtmNrkGv93ky.jpg",
    backdrop_path: "/oXUunYhnun0D7VfIqX0Z6V87clw.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    genre_ids: [18, 28, 80, 53]
  },
  {
    id: 19995,
    title: "Avatar",
    overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following his orders and protecting the world he feels is his home.",
    poster_path: "/6EiRUJp6vSbtxq9ZqcH0CbkKp0s.jpg",
    backdrop_path: "/8rm3S4cr9m0STu9Y8Xp2Z8YNo9q.jpg",
    release_date: "2009-12-10",
    vote_average: 7.5,
    genre_ids: [28, 12, 14, 878]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who steals corporate secrets from use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/edv5CZv0jH9NX186R3yq7vLcQ9u.jpg",
    backdrop_path: "/8Z79vS8Inp6FmR3w5K8XfH6SrtS.jpg",
    release_date: "2010-07-15",
    vote_average: 8.3,
    genre_ids: [28, 878, 12]
  },
  {
    id: 671,
    title: "Harry Potter and the Philosopher's Stone",
    overview: "Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard—with a place waiting for him at the Hogwarts School of Witchcraft and Wizardry.",
    poster_path: "/wuMc08IPKEatv9rnMNXv3BCI9Y2.jpg",
    backdrop_path: "/hziRFr3uYp1zY9vK3j9B6wOUAsT.jpg",
    release_date: "2001-11-16",
    vote_average: 7.9,
    genre_ids: [12, 14]
  }
];

export const getImageUrl = (path: string, size: 'w500' | 'original' = 'w500') => {
  if (!path) return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getEmbedUrl = (id: number) => {
  return `https://vidsrc.to/embed/movie/${id}`;
};

export const genreMap: { [key: number]: string } = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

export const getGenreNames = (ids: number[] = []) => {
  return ids.map(id => genreMap[id]).filter(Boolean).join(', ');
};
