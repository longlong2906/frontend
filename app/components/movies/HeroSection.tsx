"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import API_BASE from '../../config';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  vote_average: number;
  weighted_rating: number;
  overview: string;
  backdrop_path?: string;
  poster_path?: string;
}

interface HeroSectionProps {
  movies: Movie[];
}

export default function HeroSection({ movies }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tmdbData, setTmdbData] = useState<{ [key: number]: any }>({});
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  const currentMovie = movies[currentIndex];

  // Fetch TMDB data for all movies
  useEffect(() => {
    const fetchAllTMDB = async () => {
      const data: { [key: number]: any } = {};
      for (const movie of movies) {
        try {
          const res = await fetch(`${API_BASE}/movies/${movie.id}/tmdb`);
          if (res.ok) {
            const tmdbInfo = await res.json();
            data[movie.id] = tmdbInfo;
          }
        } catch (error) {
          console.error(`Error fetching TMDB data for movie ${movie.id}:`, error);
        }
      }
      setTmdbData(data);
    };

    if (movies.length > 0) {
      fetchAllTMDB();
    }
  }, [movies]);

  // Auto-play carousel
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  if (!currentMovie) return null;

  const backdropUrl = tmdbData[currentMovie.id]?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tmdbData[currentMovie.id].backdrop_path}`
    : null;

  return (
    <div className="relative w-full h-[90vh] min-h-[600px] overflow-hidden group">
      {/* Backdrop Image with transition */}
      {backdropUrl ? (
        <div className="absolute inset-0">
          <Image
            key={currentMovie.id}
            src={backdropUrl}
            alt={currentMovie.title}
            fill
            className="object-cover object-top transition-opacity duration-1000"
            priority
            quality={100}
            onLoad={() => setImageLoaded({ ...imageLoaded, [currentMovie.id]: true })}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-fuchsia-900/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
      )
      }

      {/* Navigation Arrows */}
      {
        movies.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20 hover:border-white/40"
              aria-label="Previous movie"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20 hover:border-white/40"
              aria-label="Next movie"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )
      }

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-10 px-6 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentMovie.title}
          </h1>
          <div className="flex items-center gap-4 mb-4 text-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <span className="text-violet-400 font-semibold">
              ⭐ {currentMovie.weighted_rating.toFixed(1)}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300">{currentMovie.release_year}</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300">{currentMovie.genre.split(',')[0]}</span>
          </div>
          <p className="text-lg text-zinc-200 leading-relaxed mb-6 line-clamp-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {currentMovie.overview || 'Không có mô tả'}
          </p>
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <Link
              href={`/movies/${currentMovie.id}`}
              className="inline-block px-8 py-3 bg-zinc-700/50 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors border border-zinc-600"
            >
              Chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {
        movies.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )
      }
    </div >
  );
}
