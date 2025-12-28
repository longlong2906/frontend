"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

import API_BASE from '../../config';

interface MovieDetail {
  id: number;
  title: string;
  genre: string;
  genre_list: string[];
  release_year: number | null;
  vote_average: number;
  vote_count: number;
  weighted_rating: number;
  overview: string;
  original_language: string;
  language_name: string;
  popularity: number;
}

interface TMDBData {
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  runtime?: number;
  tagline?: string;
  homepage?: string;
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token, favorites, toggleFavorite } = useAuth();
  const id = params?.id;
  const movieId = id ? (Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string)) : 0;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [tmdbData, setTmdbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [userRating, setUserRating] = useState<number>(0); // Keep userRating state

  // Derived favorite state from Context
  const isFavorite = favorites.includes(movieId);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch basic movie info
        const res = await fetch(`${API_BASE}/movies/${id}`);
        if (!res.ok) {
          router.push('/movies');
          return;
        }
        const data = await res.json();
        setMovie(data);

        // Fetch TMDB data (images, etc)
        const tmdbRes = await fetch(`${API_BASE}/movies/${id}/tmdb`);
        if (tmdbRes.ok) {
          const tmdb = await tmdbRes.json();
          setTmdbData(tmdb);
        }

        // Load user rating from localStorage
        const savedRating = localStorage.getItem(`movie_rating_${movieId}`);
        if (savedRating) setUserRating(parseFloat(savedRating));

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, movieId, router]); // Reduced dependencies to avoid loops

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    localStorage.setItem(`movie_rating_${movieId}`, rating.toString());
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    await toggleFavorite(movieId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Không tìm thấy phim</div>
      </div>
    );
  }

  const backdropUrl = tmdbData?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
    : null;

  const posterUrl = tmdbData?.poster_path
    ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Backdrop */}
      {backdropUrl && (
        <div className="fixed inset-0 -z-10">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Content */}
      <div className="pt-10 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Poster */}
            <div className="lg:col-span-1">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20">
                    <span className="text-6xl">🎬</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Movie Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>

                {tmdbData?.tagline && (
                  <p className="text-xl text-zinc-400 italic mb-4">"{tmdbData.tagline}"</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-lg mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold">{movie.weighted_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-zinc-400">•</span>
                  <span>{movie.release_year}</span>
                  {tmdbData?.runtime && (
                    <>
                      <span className="text-zinc-400">•</span>
                      <span>{tmdbData.runtime} phút</span>
                    </>
                  )}
                  <span className="text-zinc-400">•</span>
                  <span>{movie.language_name}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre_list && movie.genre_list.length > 0 ? (
                    movie.genre_list.map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-violet-500/20 border border-violet-500/50 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/50 rounded-full text-sm">
                      {movie.genre}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating and Favorite Section */}
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-6 border border-zinc-800">
                <h2 className="text-2xl font-bold mb-4">Đánh giá của bạn</h2>

                {/* Rating Stars */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    Đánh giá phim (1-5 sao):
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className="w-10 h-10 transition-transform hover:scale-110 focus:outline-none"
                        aria-label={`Đánh giá ${star} sao`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={star <= userRating ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`w-8 h-8 ${star <= userRating
                            ? 'text-yellow-400'
                            : 'text-white'
                            }`}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="mt-2 text-zinc-300">
                      Bạn đã đánh giá: <span className="font-semibold text-yellow-400">{userRating}/5</span>
                    </p>
                  )}
                </div>

                {/* Favorite Button */}
                <div>
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isFavorite
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-zinc-700 hover:bg-zinc-600 text-white'
                      }`}
                  >
                    <svg
                      className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`}
                      fill={isFavorite ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                  </button>
                </div>
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Nội dung</h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  {movie.overview || 'Không có mô tả cho phim này.'}
                </p>
              </div>

              {/* Movie Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-800">
                  <div className="text-sm text-zinc-400 mb-1">Điểm đánh giá</div>
                  <div className="text-2xl font-bold">{movie.vote_average.toFixed(1)}</div>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-800">
                  <div className="text-sm text-zinc-400 mb-1">Số lượt đánh giá</div>
                  <div className="text-2xl font-bold">{movie.vote_count.toLocaleString()}</div>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-800">
                  <div className="text-sm text-zinc-400 mb-1">Điểm trọng số</div>
                  <div className="text-2xl font-bold">{movie.weighted_rating.toFixed(1)}</div>
                </div>
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-800">
                  <div className="text-sm text-zinc-400 mb-1">Độ phổ biến</div>
                  <div className="text-2xl font-bold">{movie.popularity.toFixed(1)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

