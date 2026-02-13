import Link from "next/link";
import { ArrowLeft, Calendar, Star, PlayCircle, ExternalLink } from "lucide-react";

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Fetch Movie Details AND Videos (append_to_response is a TMDB trick)
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos`
  );
  
  if (!res.ok) return <div>Movie not found</div>;

  const movie = await res.json();

  // Find the first YouTube Trailer
  const trailer = movie.videos?.results.find(
    (vid: any) => vid.site === "YouTube" && vid.type === "Trailer"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Background with slight blur using the backdrop image */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors bg-slate-900/50 px-4 py-2 rounded-full">
            <ArrowLeft size={20} /> Back to Search
        </Link>
        
        <div className="flex flex-col md:flex-row gap-10 bg-slate-900/60 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
            {/* Poster */}
            <div className="w-full md:w-1/3 shrink-0">
                {movie.poster_path ? (
                    <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-xl shadow-2xl w-full border border-slate-700"
                    />
                ) : (
                    <div className="h-96 bg-slate-800 rounded-xl flex items-center justify-center">No Poster</div>
                )}
            </div>
            
            {/* Content */}
            <div className="w-full md:w-2/3 flex flex-col justify-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {movie.title}
                </h1>
                <p className="text-xl text-gray-400 italic mb-6">{movie.tagline}</p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 text-gray-300 mb-8 p-4 bg-slate-800/50 rounded-xl">
                    <span className="flex items-center gap-2"><Calendar size={20} className="text-blue-500"/> {movie.release_date}</span>
                    <span className="flex items-center gap-2"><Star size={20} className="text-yellow-500"/> {movie.vote_average?.toFixed(1)} / 10</span>
                    <span className="px-3 py-1 bg-slate-700 rounded-lg text-sm">{movie.runtime} min</span>
                </div>
                
                <h3 className="text-2xl font-semibold mb-3 text-white">Overview</h3>
                <p className="text-lg leading-relaxed text-gray-300 mb-8">{movie.overview}</p>

                {/* Buttons */}
                <div className="flex gap-4">
                    {trailer ? (
                        <a 
                            href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105"
                        >
                            <PlayCircle size={24} /> Watch Trailer
                        </a>
                    ) : (
                        <button disabled className="bg-slate-700 text-gray-400 px-8 py-3 rounded-full font-bold cursor-not-allowed">
                            No Trailer Available
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
