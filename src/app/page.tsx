"use client";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (searchQuery: string) => {
    setLoading(true);
    const endpoint = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?query=${searchQuery}`
      : `https://api.themoviedb.org/3/trending/movie/week`;
    
    try {
      const res = await fetch(
        `${endpoint}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce((q: string) => fetchMovies(q), 500), []);

  useEffect(() => {
    if (query) debouncedSearch(query);
    else fetchMovies(""); 
  }, [query, debouncedSearch]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-blue-500 mb-6 tracking-tight">CineAnalytics</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for movies..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-xl text-white placeholder-gray-500"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {movies.map((movie: any) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="group">
              <div className="bg-slate-900 rounded-xl overflow-hidden hover:scale-105 transition-transform shadow-lg border border-slate-800 h-full flex flex-col">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-slate-800 flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="font-bold text-sm truncate mb-1">{movie.title}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                    <span className="text-yellow-500 flex items-center gap-1">★ {movie.vote_average?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
