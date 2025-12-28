"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '../../components/movies/MovieCard';

import API_BASE from '../../config';

interface Movie {
    id: number;
    title: string;
    genre: string;
    release_year: number;
    vote_average: number;
    vote_count: number;
    weighted_rating: number;
    poster_path?: string;
    overview: string;
}

interface Genre {
    name: string;
    code: string;
}

interface Language {
    code: string;
    name: string;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get params
    const query = searchParams.get('q') || '';
    const genreParam = searchParams.get('genre') || '';
    const languageParam = searchParams.get('language') || '';
    const pageParam = parseInt(searchParams.get('page') || '1');

    // State
    const [movies, setMovies] = useState<Movie[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const [genres, setGenres] = useState<Genre[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);

    // Filter Filters State (local for dropdowns)
    const [selectedGenre, setSelectedGenre] = useState(genreParam);
    const [selectedLanguage, setSelectedLanguage] = useState(languageParam);

    // Fetch filters on mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [genresRes, languagesRes] = await Promise.all([
                    fetch(`${API_BASE}/movies/genres`),
                    fetch(`${API_BASE}/movies/languages`)
                ]);
                const genresData = await genresRes.json();
                const languagesData = await languagesRes.json();
                setGenres(genresData);
                setLanguages(languagesData);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };
        fetchFilters();
    }, []);

    // Sync state with URL params
    useEffect(() => {
        setSelectedGenre(genreParam);
        setSelectedLanguage(languageParam);
    }, [genreParam, languageParam]);

    // Fetch movies when params change
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (query) params.append('q', query);
                if (genreParam) params.append('genre', genreParam);
                if (languageParam) params.append('language', languageParam);
                params.append('page', pageParam.toString());
                params.append('limit', '20');

                const res = await fetch(`${API_BASE}/movies/search?${params.toString()}`);
                const data = await res.json();

                setMovies(data.movies);
                setTotalResults(data.total_results);
                setTotalPages(data.total_pages);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [query, genreParam, languageParam, pageParam]);

    const handleFilterChange = (newGenre: string, newLanguage: string) => {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (newGenre) params.append('genre', newGenre);
        if (newLanguage) params.append('language', newLanguage);
        params.append('page', '1'); // Reset to page 1

        router.push(`/movies/search?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (genreParam) params.append('genre', genreParam);
        if (languageParam) params.append('language', languageParam);
        params.append('page', newPage.toString());

        router.push(`/movies/search?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {query ? `Kết quả tìm kiếm cho: "${query}"` : 'Tìm kiếm & Lọc phim'}
                        </h1>
                        <p className="text-zinc-400">Found {totalResults} movies</p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={selectedGenre}
                            onChange={(e) => handleFilterChange(e.target.value, selectedLanguage)}
                            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-violet-500 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả Thể loại</option>
                            {genres.map(g => (
                                <option key={g.code} value={g.code}>{g.name}</option>
                            ))}
                        </select>

                        <select
                            value={selectedLanguage}
                            onChange={(e) => handleFilterChange(selectedGenre, e.target.value)}
                            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 outline-none focus:border-violet-500 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả Quốc gia</option>
                            {languages.map(l => (
                                <option key={l.code} value={l.code}>{l.name}</option>
                            ))}
                        </select>

                        {(selectedGenre || selectedLanguage) && (
                            <button
                                onClick={() => handleFilterChange('', '')}
                                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : movies.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <button
                                    onClick={() => handlePageChange(pageParam - 1)}
                                    disabled={pageParam <= 1}
                                    className="px-4 py-2 bg-zinc-800 rounded-lg disabled:opacity-50 hover:bg-zinc-700 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 border border-zinc-800">
                                    Page {pageParam} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(pageParam + 1)}
                                    disabled={pageParam >= totalPages}
                                    className="px-4 py-2 bg-zinc-800 rounded-lg disabled:opacity-50 hover:bg-zinc-700 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-zinc-500">Không tìm thấy phim nào phù hợp.</p>
                        <button
                            onClick={() => handleFilterChange('', '')}
                            className="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-full transition-colors font-medium"
                        >
                            Xem tất cả phim
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white pt-20 flex justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
