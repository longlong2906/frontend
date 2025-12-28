"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  vote_average: number;
  weighted_rating: number;
  overview: string;
  poster_path?: string;
}

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    toggleFavorite(movie.id);
  };

  const isFavorite = favorites.includes(movie.id);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const handleClick = () => {
    router.push(`/movies/${movie.id}`);
  };

  return (
    <div
      className="relative flex-shrink-0 w-[200px] transition-transform duration-300 hover:scale-110 z-20 cursor-pointer group/card"
      onClick={handleClick}
    >
      {/* Poster */}
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-zinc-900">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Badges Container */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          {/* Rating Badge */}
          <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-white text-xs font-semibold">
              {movie.weighted_rating.toFixed(1)}
            </span>
          </div>

          {/* Heart Button */}
          <button
            onClick={handleToggle}
            className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 ${isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-black/40 text-white hover:bg-black/60'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              className="w-5 h-5"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Movie Title - Always Visible */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 drop-shadow-lg">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <span>{movie.release_year}</span>
            <span>•</span>
            <span className="line-clamp-1">{movie.genre.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

