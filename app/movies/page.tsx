"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MovieRow from '../components/movies/MovieRow';
import HeroSection from '../components/movies/HeroSection';

import API_BASE from '../config';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  vote_average: number;
  vote_count: number;
  weighted_rating: number;
  overview: string;
  original_language: string;
  popularity: number;
  poster_path?: string;
  backdrop_path?: string;
}

interface Genre {
  name: string;
  code: string;
  count: number;
}

interface Language {
  code: string;
  name: string;
  count: number;
}

export default function MoviesPage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [genreMovies, setGenreMovies] = useState<{ [key: string]: Movie[] }>({});
  const [languageMovies, setLanguageMovies] = useState<{ [key: string]: Movie[] }>({});
  const [personalRecs, setPersonalRecs] = useState<{ source_movie: string, movies: Movie[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending movies (for hero carousel)
        const trendingRes = await fetch(`${API_BASE}/movies/trending?limit=5`);
        const trendingData = await trendingRes.json();
        setTrendingMovies(trendingData);

        // Fetch top rated movies
        const topRes = await fetch(`${API_BASE}/movies/top-rated?limit=10`);
        const topData = await topRes.json();
        setTopMovies(topData);

        // Fetch Personal Recommendations (if auth)
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const recRes = await fetch(`${API_BASE}/user/recommendations`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (recRes.ok) {
              const recData = await recRes.json();
              if (recData.movies && recData.movies.length > 0) {
                setPersonalRecs(recData);
              }
            }
          } catch (e) {
            console.error("Error fetching personal recs:", e);
          }
        }

        // Fetch genres
        const genresRes = await fetch(`${API_BASE}/movies/genres`);
        const genresData = await genresRes.json();
        setGenres(genresData.slice(0, 10)); // Top 10 genres

        // Fetch languages
        const languagesRes = await fetch(`${API_BASE}/movies/languages`);
        const languagesData = await languagesRes.json();
        setLanguages(languagesData.slice(0, 10)); // Top 10 languages

        // Fetch movies for each genre
        const genreMoviesData: { [key: string]: Movie[] } = {};
        for (const genre of genresData.slice(0, 10)) {
          try {
            const res = await fetch(`${API_BASE}/movies/by-genre/${genre.code}?limit=10`);
            const movies = await res.json();
            genreMoviesData[genre.code] = movies;
          } catch (e) {
            console.error(`Error fetching movies for genre ${genre.code}:`, e);
          }
        }
        setGenreMovies(genreMoviesData);

        // Fetch movies for each language
        const languageMoviesData: { [key: string]: Movie[] } = {};
        for (const lang of languagesData.slice(0, 10)) {
          try {
            const res = await fetch(`${API_BASE}/movies/by-language/${lang.code}?limit=10`);
            const movies = await res.json();
            languageMoviesData[lang.code] = movies;
          } catch (e) {
            console.error(`Error fetching movies for language ${lang.code}:`, e);
          }
        }
        setLanguageMovies(languageMoviesData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - Carousel với Top 10 Phim Thịnh Hành */}
      {trendingMovies.length > 0 && (
        <HeroSection movies={trendingMovies} />
      )}

      {/* Content */}
      <div className="pt-10 pb-12">
        {/* Personal Recommendations Section */}
        {personalRecs && personalRecs.movies.length > 0 && (
          <MovieRow
            title="Có thể bạn sẽ thích"
            movies={personalRecs.movies}
            key="personal-recs"
          // No viewAllLink for now or could point to a dedicated page
          />
        )}

        {/* Top 10 Movies */}
        {topMovies.length > 0 && (
          <MovieRow
            title="Top 10 Phim Được Đánh Giá Cao Nhất"
            movies={topMovies}
            key="top-movies"
            viewAllLink="/movies/list?type=top-rated&title=Phim được đánh giá cao nhất"
          />
        )}

        {/* Movies by Genre */}
        {genres.map((genre) => (
          genreMovies[genre.code] && genreMovies[genre.code].length > 0 && (
            <MovieRow
              key={`genre-${genre.code}`}
              title={`Thể loại ${genre.name}`}
              movies={genreMovies[genre.code]}
              viewAllLink={`/movies/list?type=genre&code=${genre.code}&title=Phim ${encodeURIComponent(genre.name)}`}
            />
          )
        ))}

        {/* Movies by Language */}
        {languages.map((language) => (
          languageMovies[language.code] && languageMovies[language.code].length > 0 && (
            <MovieRow
              key={`lang-${language.code}`}
              title={`Phim ${language.name}`}
              movies={languageMovies[language.code]}
              viewAllLink={`/movies/list?type=language&code=${language.code}&title=Phim ${encodeURIComponent(language.name)}`}
            />
          )
        ))}
      </div>
    </div>
  );
}

