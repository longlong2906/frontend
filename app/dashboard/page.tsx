"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  StatCard,
  ChartNavigation,
  TopMoviesChart,
  LanguageDistributionChart,
  WeightedRatingDistributionChart,
  YearlyTrendChart,
  ScatterPlotChart,
  MovieAgeAnalysisChart,
  GenreDistributionChart,
  GenreRatingRadarChart,
  DecadeDistributionChart,
  HeatmapChart,
  OverviewLengthChart,
  DayOfWeekChart,
  GenreByDecadeChart,
  MonthlyReleasesChart,
  BubbleChart,
  WordCloudChart,
  NetworkGraph,
  TreemapChart,
  NormalizedComparisonChart,
  RatingByLanguageChart,
} from '../components/charts';

const API_BASE = 'http://localhost:5000/api';

interface Stats {
  total_movies: number;
  avg_rating: number;
  avg_weighted_rating: number;
  total_votes: number;
  genres_count: number;
  languages_count: number;
  year_range: { min: number; max: number };
  avg_movie_age: number;
  avg_overview_length: number;
}

interface ScatterItem {
  title: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre: string;
  weighted_rating: number;
  release_year: number;
  movie_age: number;
  overview_length: number;
}

interface BubbleItem {
  title: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre: string;
  release_year: number;
  weighted_rating: number;
  movie_age: number;
  decade: number;
}

interface WordCloudItem {
  text: string;
  value: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [genreDistribution, setGenreDistribution] = useState<any[]>([]);
  const [weightedRatingDistribution, setWeightedRatingDistribution] = useState<any[]>([]);
  const [popularityByYear, setPopularityByYear] = useState<any[]>([]);
  const [languageDistribution, setLanguageDistribution] = useState<any[]>([]);
  const [decadeDistribution, setDecadeDistribution] = useState<any[]>([]);
  const [scatterData, setScatterData] = useState<ScatterItem[]>([]);
  const [genreRating, setGenreRating] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ columns: string[], data: number[][] } | null>(null);
  const [wordcloudData, setWordcloudData] = useState<WordCloudItem[]>([]);
  const [networkData, setNetworkData] = useState<{ nodes: any[], links: any[] } | null>(null);
  const [bubbleData, setBubbleData] = useState<BubbleItem[]>([]);
  const [genreByDecade, setGenreByDecade] = useState<any[]>([]);
  const [monthlyReleases, setMonthlyReleases] = useState<any[]>([]);
  const [ratingByLanguage, setRatingByLanguage] = useState<any[]>([]);
  const [movieAgeAnalysis, setMovieAgeAnalysis] = useState<any[]>([]);
  const [overviewLengthAnalysis, setOverviewLengthAnalysis] = useState<any[]>([]);
  const [normalizedComparison, setNormalizedComparison] = useState<any[]>([]);
  const [dayOfWeekAnalysis, setDayOfWeekAnalysis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const endpoints = [
          'stats', 'top-movies', 'genre-distribution',
          'weighted-rating-distribution', 'popularity-by-year',
          'language-distribution', 'decade-distribution', 'scatter-data', 'genre-rating',
          'heatmap-data', 'wordcloud-data', 'network-data', 'bubble-data',
          'genre-by-decade', 'monthly-releases', 'rating-by-language',
          'movie-age-analysis', 'overview-length-analysis', 'normalized-comparison', 'dayofweek-analysis'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            fetch(`${API_BASE}/${endpoint}`).then(res => res.json()).catch(() => null)
          )
        );

        setStats(responses[0]);
        setTopMovies(responses[1] || []);
        setGenreDistribution(responses[2] || []);
        setWeightedRatingDistribution(responses[3] || []);
        setPopularityByYear(responses[4] || []);
        setLanguageDistribution(responses[5] || []);
        setDecadeDistribution(responses[6] || []);
        setScatterData(responses[7] || []);
        setGenreRating(responses[8] || []);
        setHeatmapData(responses[9]);
        setWordcloudData(responses[10] || []);
        setNetworkData(responses[11]);
        setBubbleData(responses[12] || []);
        setGenreByDecade(responses[13] || []);
        setMonthlyReleases(responses[14] || []);
        setRatingByLanguage(responses[15] || []);
        setMovieAgeAnalysis(responses[16] || []);
        setOverviewLengthAnalysis(responses[17] || []);
        setNormalizedComparison(responses[18] || []);
        setDayOfWeekAnalysis(responses[19] || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-400 mt-4 text-lg">Đang tải dữ liệu ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Sidebar */}
      <ChartNavigation />

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Link
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all duration-200 group"
                title="Về trang chủ"
              >
                <svg
                  className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>

              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🎬</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Movie Analytics Dashboard
                </h1>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                href="/dashboard"
                className="text-white font-semibold border-b-2 border-violet-500 pb-1"
              >
                Dashboard
              </Link>
              <Link
                href="/movies"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Danh Sách Phim
              </Link>
              <Link
                href="/movies/recommend"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Gợi ý phim
              </Link>
              <Link
                href="/evaluation"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Đánh giá mô hình
              </Link>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-8 lg:pl-80">
        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Tổng số phim"
            value={stats?.total_movies?.toLocaleString() || '0'}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /></svg>}
            color="from-violet-900/50 to-violet-950/50"
          />
          <StatCard
            title="Rating TB"
            value={stats?.avg_weighted_rating || '0'}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
            color="from-amber-900/50 to-amber-950/50"
          />
          <StatCard
            title="Tổng lượt vote"
            value={stats?.total_votes ? `${(stats.total_votes / 1000000).toFixed(1)}M` : '0'}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>}
            color="from-cyan-900/50 to-cyan-950/50"
          />
          <StatCard
            title="Tuổi phim TB"
            value={`${stats?.avg_movie_age || 0} năm`}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
            color="from-emerald-900/50 to-emerald-950/50"
          />
          <StatCard
            title="Độ dài mô tả TB"
            value={`${stats?.avg_overview_length || 0} từ`}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>}
            color="from-rose-900/50 to-rose-950/50"
          />
          <StatCard
            title="Số thể loại"
            value={stats?.genres_count || '0'}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>}
            color="from-fuchsia-900/50 to-fuchsia-950/50"
          />
        </section>

        {/* Charts Grid - Mỗi biểu đồ một hàng */}
        <div className="flex flex-col gap-6">
          {/* 1. Top Movies */}
          <TopMoviesChart data={topMovies} />

          {/* 2. Language Distribution */}
          <LanguageDistributionChart data={languageDistribution} />

          {/* 3. Weighted Rating Distribution */}
          <WeightedRatingDistributionChart data={weightedRatingDistribution} />

          {/* 4. Yearly Trend */}
          <YearlyTrendChart data={popularityByYear} />

          {/* 5. Scatter Plot (Plotly) */}
          <ScatterPlotChart data={scatterData} />

          {/* 7. Movie Age Analysis */}
          <MovieAgeAnalysisChart data={movieAgeAnalysis} />

          {/* 8. Genre Distribution */}
          <GenreDistributionChart data={genreDistribution} />

          {/* 9. Genre Rating Radar */}
          <GenreRatingRadarChart data={genreRating} />

          {/* 10. Decade Distribution */}
          <DecadeDistributionChart data={decadeDistribution} />

          {/* 11. Heatmap (Plotly) */}
          <HeatmapChart data={heatmapData} />

          {/* 12. Overview Length */}
          <OverviewLengthChart data={overviewLengthAnalysis} />

          {/* 13. Day of Week */}
          <DayOfWeekChart data={dayOfWeekAnalysis} />

          {/* 14. Genre by Decade */}
          <GenreByDecadeChart data={genreByDecade} />

          {/* 15. Monthly Releases */}
          <MonthlyReleasesChart data={monthlyReleases} />

          {/* 16. Bubble Chart (Plotly) */}
          <BubbleChart data={bubbleData} />

          {/* 17. Word Cloud */}
          <WordCloudChart data={wordcloudData} />

          {/* 18. Network Graph */}
          <NetworkGraph data={networkData} />

          {/* 19. Treemap */}
          <TreemapChart data={genreDistribution} />

          {/* 20. Normalized Comparison */}
          <NormalizedComparisonChart data={normalizedComparison} />

          {/* 21. Rating by Language */}
          <RatingByLanguageChart data={ratingByLanguage} />
        </div>
      </main>


    </div>
  );
}
