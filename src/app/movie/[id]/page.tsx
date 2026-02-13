import Link from "next/link";
import { ArrowLeft, Calendar, Star, TrendingUp } from "lucide-react";

export default async function MovieDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  
  if (!res.ok) {
    return <div className="text-white text-center p-10">Movie not found.</div>;
  }

  const movie = await res.json();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Search
      </Link>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3">
           {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl shadow-2xl w-full border border-slate-800"
            />
           )}
        </div>
        
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{movie.title}</h1>
          <p className="text-xl text-gray-400 italic mb-6">{movie.tagline}</p>
          
          <div className="flex flex-wrap gap-6 text-gray-300 mb-8">
            <span className="flex items-center gap-2"><Calendar size={18} className="text-blue-500"/> {movie.release_date}</span>
            <span className="flex items-center gap-2"><Star size={18} className="text-yellow-500"/> {movie.vote_average?.toFixed(1)} / 10</span>
            <span className="flex items-center gap-2"><TrendingUp size={18} className="text-green-500"/> {Math.round(movie.popularity)} Popularity</span>
          </div>
          
          <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-semibold mb-2 text-white">Overview</h3>
                <p className="text-lg leading-relaxed text-gray-300">{movie.overview}</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mt-8">
               <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                 📊 CineAnalytics Data
               </h3>
               <p className="text-gray-400">
                 This movie has been tracked in {movie.production_countries?.length || 0} regions. 
                 Global revenue stands at <span className="text-green-400 font-mono">${movie.revenue?.toLocaleString()}</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
