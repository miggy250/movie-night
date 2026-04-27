import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Calendar, Star, Film, ChevronDown } from 'lucide-react';
import { getVidsrcUrl } from '../../services/movieService';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  poster?: string;
  overview?: string;
  vidsrcId?: number;
}

// Mock data for demonstration - in a real app, this would come from an API
const mockMoviesByYear: Record<number, Movie[]> = {
  2026: [
    { id: 101, title: "Avatar 3", year: 2026, rating: 8.2, overview: "The final chapter of the Avatar saga...", vidsrcId: 101 },
    { id: 102, title: "The Mandalorian & Grogu", year: 2026, rating: 7.8, overview: "Star Wars cinematic adventure...", vidsrcId: 102 },
    { id: 103, title: "Mission: Impossible 8", year: 2026, rating: 7.9, overview: "Ethan Hunt's final mission...", vidsrcId: 103 },
    { id: 104, title: "The Batman: Part II", year: 2026, rating: 8.3, overview: "Batman faces new villains...", vidsrcId: 104 },
    { id: 105, title: "Frozen III", year: 2026, rating: 7.5, overview: "Elsa and Anna's final chapter...", vidsrcId: 105 },
    { id: 106, title: "Jurassic World 4", year: 2026, rating: 7.1, overview: "New dinosaurs, new adventures...", vidsrcId: 106 },
    { id: 107, title: "Moana 2", year: 2026, rating: 7.6, overview: "Moana's new ocean adventure...", vidsrcId: 107 },
    { id: 108, title: "The Fantastic Four", year: 2026, rating: 8.1, overview: "Marvel's first family arrives...", vidsrcId: 108 },
  ],
  2025: [
    { id: 109, title: "Captain America: Brave New World", year: 2025, rating: 7.7, overview: "Sam Wilson's Captain America adventure..." },
    { id: 110, title: "Marvel's Thunderbolts", year: 2025, rating: 7.4, overview: "Anti-hero team assembles..." },
    { id: 111, title: "The Incredibles 3", year: 2025, rating: 8.0, overview: "Parr family's newest mission..." },
    { id: 112, title: "How to Train Your Dragon 4", year: 2025, rating: 7.3, overview: "Hiccup and Toothless return..." },
    { id: 113, title: "John Wick 5", year: 2025, rating: 7.6, overview: "Wick's final battle..." },
    { id: 114, title: "Pirates of the Caribbean 6", year: 2025, rating: 7.0, overview: "Jack Sparrow's new adventure..." },
    { id: 115, title: "Shrek 5", year: 2025, rating: 7.2, overview: "Shrek returns to the swamp..." },
    { id: 116, title: "Loki: Season 3 Movie", year: 2025, rating: 8.0, overview: "Loki's multiverse journey continues..." },
  ],
  2024: [
    { id: 693134, title: "Dune: Part Two", year: 2024, rating: 8.4, overview: "Paul Atreides unites with Chani and the Fremen..." },
    { id: 921636, title: "Godzilla x Kong: The New Empire", year: 2024, rating: 6.8, overview: "The epic battle continues..." },
    { id: 1011982, title: "Kung Fu Panda 4", year: 2024, rating: 7.2, overview: "Po's new adventure begins..." },
    { id: 848081, title: "Deadpool & Wolverine", year: 2024, rating: 8.1, overview: "The ultimate team-up..." },
    { id: 11374806, title: "Kingdom of the Planet of the Apes", year: 2024, rating: 7.5, overview: "A new era begins..." },
    { id: 1184918, title: "Inside Out 2", year: 2024, rating: 8.0, overview: "New emotions arrive..." },
    { id: 951493, title: "Furiosa: A Mad Max Saga", year: 2024, rating: 7.8, overview: "The origin story of Furiosa..." },
    { id: 1229235, title: "Alien: Romulus", year: 2024, rating: 7.3, overview: "A new chapter in the Alien saga..." },
  ],
  2023: [
    { id: 872585, title: "Oppenheimer", year: 2023, rating: 8.4, overview: "The story of the atomic bomb and J. Robert Oppenheimer..." },
    { id: 347, title: "Barbie", year: 2023, rating: 7.0, overview: "Barbie's journey from Barbieland to the real world..." },
    { id: 447365, title: "Guardians of the Galaxy Vol. 3", year: 2023, rating: 7.9, overview: "The final adventure for the Guardians..." },
    { id: 569094, title: "Spider-Man: Across the Spider-Verse", year: 2023, rating: 8.7, overview: "Miles Morales returns for another multiverse adventure..." },
    { id: 592, title: "The Little Mermaid", year: 2023, rating: 7.1, overview: "Disney's live-action adaptation of the classic tale..." },
    { id: 385687, title: "Fast X", year: 2023, rating: 5.8, overview: "The family races against their greatest threat yet..." },
    { id: 906823, title: "Ant-Man and the Wasp: Quantumania", year: 2023, rating: 6.3, overview: "Journey into the quantum realm..." },
    { id: 298618, title: "The Flash", year: 2023, rating: 6.5, overview: "Flash travels through time to save his family..." },
  ],
  2022: [
    { id: 361743, title: "Top Gun: Maverick", year: 2022, rating: 8.3, overview: "After thirty years, Maverick is still pushing the envelope as a top naval aviator..." },
    { id: 76600, title: "Avatar: The Way of Water", year: 2022, rating: 7.6, overview: "Jake Sully and Neytiri have formed a family..." },
    { id: 414906, title: "The Batman", year: 2022, rating: 7.8, overview: "When the Riddler, a sadistic serial killer, begins murdering key political figures..." },
    { id: 505642, title: "Black Panther: Wakanda Forever", year: 2022, rating: 7.1, overview: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation..." },
    { id: 672, title: "Jurassic World Dominion", year: 2022, rating: 5.6, overview: "Four years after the destruction of Isla Nublar, dinosaurs live and hunt alongside humans..." },
    { id: 453395, title: "Doctor Strange in the Multiverse of Madness", year: 2022, rating: 7.0, overview: "Doctor Strange teams up with a mysterious teenage girl from another dimension..." },
    { id: 616037, title: "Thor: Love and Thunder", year: 2022, rating: 6.2, overview: "Thor enlists the help of Valkyrie, Korg and ex-girlfriend Jane Foster..." },
    { id: 438795, title: "Minions: The Rise of Gru", year: 2022, rating: 7.0, overview: "In the heart of the 1970s, a twelve-year-old Gru dreams of becoming the world's greatest supervillain..." },
  ],
  2021: [
    { id: 634649, title: "Spider-Man: No Way Home", year: 2021, rating: 8.2, overview: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help..." },
    { id: 578, title: "Dune", year: 2021, rating: 8.0, overview: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset..." },
    { id: 566525, title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, rating: 7.5, overview: "Shang-Chi must confront the past he thought he left behind..." },
    { id: 370, title: "No Time to Die", year: 2021, rating: 7.3, overview: "James Bond has left active service but is called back when a new threat emerges..." },
    { id: 38768, title: "F9: The Fast Saga", year: 2021, rating: 5.2, overview: "Dom Toretto is living the quiet life off the grid with Letty and his son..." },
    { id: 524434, title: "Eternals", year: 2021, rating: 6.3, overview: "The Eternals, a race of immortal beings with superhuman powers, live in secret..." },
    { id: 378, title: "Black Widow", year: 2021, rating: 6.7, overview: "Natasha Romanoff confronts the darker parts of her ledger..." },
    { id: 580489, title: "Venom: Let There Be Carnage", year: 2021, rating: 5.9, overview: "Eddie Brock attempts to reignite his career by interviewing serial killer Cletus Kasady..." },
  ],
  2020: [
    { id: 33, title: "Tenet", year: 2020, rating: 7.4, overview: "Armed with only one word, Tenet, and fighting for the survival of the entire world..." },
    { id: 34, title: "The Invisible Man", year: 2020, rating: 7.1, overview: "When Cecilia's abusive ex takes his own life and leaves her his fortune..." },
    { id: 35, title: "Sonic the Hedgehog", year: 2020, rating: 6.5, overview: "Sonic tries to navigate the complexities of life on Earth with his newfound best friend..." },
    { id: 36, title: "Birds of Prey", year: 2020, rating: 6.1, overview: "After splitting with the Joker, Harley Quinn joins forces with other female heroes..." },
    { id: 37, title: "Bad Boys for Life", year: 2020, rating: 6.4, overview: "Mike Lowrey and Marcus Burnett return for one last ride..." },
    { id: 38, title: "The Gentlemen", year: 2020, rating: 7.3, overview: "American expat Mickey Pearson has built a highly profitable marijuana empire in London..." },
  ],
  2019: [
    { id: 299536, title: "Avengers: Endgame", year: 2019, rating: 8.4, overview: "The epic conclusion to the Infinity Saga..." },
    { id: 475557, title: "Joker", year: 2019, rating: 8.4, overview: "Arthur Fleck's transformation into the Joker..." },
    { id: 348350, title: "Star Wars: The Rise of Skywalker", year: 2019, rating: 6.5, overview: "The saga concludes with the Resistance's final stand..." },
    { id: 466272, title: "Once Upon a Time in Hollywood", year: 2019, rating: 7.6, overview: "Tarantino's tale of Hollywood in 1969..." },
    { id: 558002, title: "John Wick: Chapter 3 - Parabellum", year: 2019, rating: 7.5, overview: "Wick is excommunicated and must fight for survival..." },
    { id: 299534, title: "Captain Marvel", year: 2019, rating: 6.8, overview: "Carol Danvers becomes Captain Marvel..." },
  ],
  2018: [
    { id: 299537, title: "Avengers: Infinity War", year: 2018, rating: 8.4, overview: "The Avengers and their allies must be willing to sacrifice all..." },
    { id: 284054, title: "Black Panther", year: 2018, rating: 7.3, overview: "T'Challa becomes the Black Panther and king of Wakanda..." },
    { id: 546554, title: "Mission: Impossible - Fallout", year: 2018, rating: 7.7, overview: "Ethan Hunt and his team must track down stolen nuclear weapons..." },
    { id: 297761, title: "Aquaman", year: 2018, rating: 6.8, overview: "Arthur Curry learns he is the heir to the underwater kingdom of Atlantis..." },
    { id: 478, title: "Bohemian Rhapsody", year: 2018, rating: 7.9, overview: "Freddie Mercury's story from the formation of Queen to Live Aid..." },
    { id: 335983, title: "Venom", year: 2018, rating: 6.7, overview: "Eddie Brock becomes Venom after bonding with an alien symbiote..." },
  ],
  2017: [
    { id: 51, title: "Star Wars: The Last Jedi", year: 2017, rating: 7.0, overview: "Rey's training continues..." },
    { id: 52, title: "Wonder Woman", year: 2017, rating: 7.4, overview: "Diana Prince's origin..." },
    { id: 53, title: "Justice League", year: 2017, rating: 6.1, overview: "DC heroes unite..." },
    { id: 54, title: "Thor: Ragnarok", year: 2017, rating: 7.9, overview: "Thor loses Mjolnir..." },
    { id: 55, title: "Guardians of the Galaxy Vol. 2", year: 2017, rating: 7.6, overview: "Star-Lord meets his father..." },
    { id: 56, title: "Logan", year: 2017, rating: 8.1, overview: "Wolverine's final adventure..." },
  ],
  2016: [
    { id: 57, title: "Rogue One: A Star Wars Story", year: 2016, rating: 7.8, overview: "Rebellion's first victory..." },
    { id: 58, title: "Captain America: Civil War", year: 2016, rating: 7.8, overview: "Heroes fight each other..." },
    { id: 59, title: "Doctor Strange", year: 2016, rating: 7.5, overview: "Strange becomes the Sorcerer Supreme..." },
    { id: 60, title: "Zootopia", year: 2016, rating: 8.0, overview: "Judy Hopps becomes a cop..." },
    { id: 61, title: "The Jungle Book", year: 2016, rating: 7.4, overview: "Mowgli's jungle adventure..." },
    { id: 62, title: "Suicide Squad", year: 2016, rating: 5.9, overview: "Task Force X assembles..." },
  ],
  2015: [
    { id: 63, title: "Star Wars: The Force Awakens", year: 2015, rating: 8.0, overview: "The saga continues..." },
    { id: 64, title: "Avengers: Age of Ultron", year: 2015, rating: 7.3, overview: "Ultron threatens humanity..." },
    { id: 65, title: "Jurassic World", year: 2015, rating: 7.0, overview: "Dinosaurs return..." },
    { id: 66, title: "Furious 7", year: 2015, rating: 7.1, overview: "Paul Walker's final film..." },
    { id: 67, title: "Inside Out", year: 2015, rating: 8.1, overview: "Emotions run Riley's life..." },
    { id: 68, title: "The Martian", year: 2015, rating: 8.0, overview: "Watney survives on Mars..." },
  ],
  2014: [
    { id: 69, title: "Guardians of the Galaxy", year: 2014, rating: 8.0, overview: "The team assembles..." },
    { id: 70, title: "Captain America: The Winter Soldier", year: 2014, rating: 7.7, overview: "The Winter Soldier attacks..." },
    { id: 71, title: "Interstellar", year: 2014, rating: 8.6, overview: "Cooper saves humanity..." },
    { id: 72, title: "The Hunger Games: Mockingjay - Part 1", year: 2014, rating: 6.6, overview: "Katniss leads the rebellion..." },
    { id: 73, title: "X-Men: Days of Future Past", year: 2014, rating: 7.9, overview: "Wolverine travels to the past..." },
    { id: 74, title: "Maleficent", year: 2014, rating: 6.9, overview: "Sleeping Beauty's villain..." },
  ],
  2013: [
    { id: 75, title: "Iron Man 3", year: 2013, rating: 7.1, overview: "Tony faces PTSD..." },
    { id: 76, title: "Thor: The Dark World", year: 2013, rating: 6.8, overview: "Thor fights Malekith..." },
    { id: 77, title: "Man of Steel", year: 2013, rating: 7.0, overview: "Superman's origin..." },
    { id: 78, title: "The Hunger Games: Catching Fire", year: 2013, rating: 7.5, overview: "Katniss enters the arena again..." },
    { id: 79, title: "Gravity", year: 2013, rating: 7.7, overview: "Dr. Stone is lost in space..." },
    { id: 80, title: "World War Z", year: 2013, rating: 6.9, overview: "Zombie pandemic..." },
  ],
  2012: [
    { id: 81, title: "The Avengers", year: 2012, rating: 8.0, overview: "The team assembles..." },
    { id: 82, title: "The Dark Knight Rises", year: 2012, rating: 8.4, overview: "Batman faces Bane..." },
    { id: 83, title: "The Hobbit: An Unexpected Journey", year: 2012, rating: 7.8, overview: "Bilbo's adventure begins..." },
    { id: 84, title: "Skyfall", year: 2012, rating: 7.7, overview: "Bond's 50th anniversary..." },
    { id: 85, title: "The Amazing Spider-Man", year: 2012, rating: 7.0, overview: "Peter Parker's reboot..." },
    { id: 86, title: "Prometheus", year: 2012, rating: 7.0, overview: "Alien prequel..." },
  ],
  2011: [
    { id: 87, title: "Harry Potter and the Deathly Hallows - Part 2", year: 2011, rating: 8.1, overview: "The final battle..." },
    { id: 88, title: "Thor", year: 2011, rating: 7.0, overview: "Thor's banishment..." },
    { id: 89, title: "Captain America: The First Avenger", year: 2011, rating: 7.9, overview: "Steve Rogers becomes Captain America..." },
    { id: 90, title: "Fast Five", year: 2011, rating: 7.3, overview: "The crew assembles in Rio..." },
    { id: 91, title: "Pirates of the Caribbean: On Stranger Tides", year: 2011, rating: 6.6, overview: "Jack's new adventure..." },
    { id: 92, title: "Transformers: Dark of the Moon", year: 2011, rating: 6.2, overview: "The Apollo program conspiracy..." },
  ],
  2010: [
    { id: 93, title: "Toy Story 3", year: 2010, rating: 8.3, overview: "Andy goes to college..." },
    { id: 94, title: "Inception", year: 2010, rating: 8.7, overview: "Cobb enters dreams..." },
    { id: 95, title: "Harry Potter and the Deathly Hallows - Part 1", year: 2010, rating: 7.7, overview: "The hunt for Horcruxes begins..." },
    { id: 96, title: "Iron Man 2", year: 2010, rating: 7.0, overview: "Tony faces the government..." },
    { id: 97, title: "The Twilight Saga: Eclipse", year: 2010, rating: 4.9, overview: "Bella faces Victoria..." },
    { id: 98, title: "Shutter Island", year: 2010, rating: 8.2, overview: "Teddy investigates Ashecliffe..." },
  ],
};

export default function AllMovies() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerUrl, setPlayerUrl] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const years = Object.keys(mockMoviesByYear)
    .map(year => parseInt(year))
    .sort((a, b) => b - a);

  const movies = selectedYear 
    ? mockMoviesByYear[selectedYear] || []
    : [];

  const handlePlay = async (movie: Movie) => {
    try {
      // Use the movie's id as the vidsrcId for streaming
      const url = await getVidsrcUrl(movie.vidsrcId || movie.id);
      setPlayerUrl(url);
      setCurrentMovie(movie);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing movie:', error);
    }
  };

  const closePlayer = () => {
    setIsPlaying(false);
    setPlayerUrl('');
    setCurrentMovie(null);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Popular movies of different years</h1>
          <p className="text-gray-400 text-lg">Browse the most popular movies by year</p>
        </div>

        {/* Year Selector */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full bg-black/60 backdrop-blur-md border border-white/20 rounded-lg px-6 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-red-600 transition-colors text-lg"
            >
              <option value="">Select a year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Movies Grid */}
        {selectedYear && movies.length > 0 ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedYear} Movies</h2>
              <p className="text-gray-400">{movies.length} movies available</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 mb-4">
                    {/* Movie Poster Placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 flex items-center justify-center">
                      <Film className="w-12 h-12 text-white/50" />
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePlay(movie)}
                        className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
                      >
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Movie Info */}
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{movie.year}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    {movie.overview && (
                      <p className="text-gray-400 text-sm line-clamp-2">{movie.overview}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : selectedYear ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No movies found</h3>
            <p className="text-gray-400">No movies available for {selectedYear}</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Select a year</h3>
            <p className="text-gray-400">Choose a year to browse movies from that period</p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
          onClick={closePlayer}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative w-full h-full max-w-6xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full" style={{ height: '100vh', maxHeight: '90vh' }}>
              <iframe
                src={playerUrl}
                className="w-full h-full object-contain"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                title="Movie Player"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="eager"
                style={{ border: 'none' }}
              />
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                whileHover={{ opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closePlayer}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all z-[70]"
              >
                <span className="text-white text-xl">×</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
