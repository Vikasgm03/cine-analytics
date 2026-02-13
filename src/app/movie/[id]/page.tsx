import Link from "next/link";
import { ArrowLeft, Calendar, Star } from "lucide-react";

// 1. Notice we change the type to Promise
export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. We must AWAIT the params to get the ID
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  
  // 3. Handle errors if the ID is wrong
  if (!res.ok) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Movie Not Found</h1>
        <p className="text-gray-400 mb-8">
           Could not fetch data for ID: {id}.
        </p>
        <Link href="/" className="bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition">
          Go Home
        </Link>
      </div>
    );
  }

  const movie = await res.json();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Search
      </Link>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3">
           {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl shadow-2xl w-full border border-slate-800"
            />
           ) : (
             <div className="h-96 bg-slate-900 rounded-xl flex items-center justify-center text-gray-500">No Poster</div>
           )}
        </div>
        
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{movie.title}</h1>
          <p className="text-xl text-gray-400 italic mb-6">{movie.tagline}</p>
          
          <div className="flex flex-wrap gap-6 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-500"/> {movie.release_date}</span>
            <span className="flex items-center gap-2"><Star size={18} className="text-yellow-500"/> {movie.vote_average?.toFixed(1)} / 10</span>
          </div>
          
          <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-semibold mb-2 text-white">Overview</h3>
                <p className="text-lg leading-relaxed text-gray-300">{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
