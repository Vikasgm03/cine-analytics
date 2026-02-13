"use client";
import { useState, useEffect } from "react"; 
import { Search, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Failed to fetch trending:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleSearch = useDebouncedCallback(async (term: string) => {
    if (!term) {
        setIsSearching(false);
        // Reload to show trending again if search is cleared
        window.location.reload(); 
        return;
    }
    
    setIsSearching(true);
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${term}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            CineAnalytics
          </h1>
          <p className="text-gray-400">Discover movies, analyze trends, find your next watch.</p>
          
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search for a movie..."
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-2 text-2xl font-bold border-b border-slate-800 pb-2">
            {isSearching ? <Search className="text-blue-500"/> : <TrendingUp className="text-purple-500"/>}
            {isSearching ? `Results for "${query}"` : "Trending This Week"}
        </div>

        {/* Grid */}
        {loading ? (
           <div className="text-center py-20 text-gray-500 animate-pulse">Loading movies...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="group relative bg-slate-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-xl border border-slate-800/50 hover:border-blue-500/50">
                <div className="aspect-[2/3] relative">
                    {movie.poster_path ? (
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-gray-500">No Image</div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <span className="text-white font-bold">{movie.title}</span>
                        <span className="text-yellow-400 flex items-center gap-1 text-sm">
                            <Star size={12} fill="currentColor"/> {movie.vote_average.toFixed(1)}
                        </span>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
