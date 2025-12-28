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
    weighted_rating: number;
    overview: string;
    poster_path?: string;
}

function MovieListContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const type = searchParams.get('type');
    const code = searchParams.get('code');
    const title = searchParams.get('title') || 'Danh sách phim';

    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError('');
            try {
                let endpoint = '';

                switch (type) {
                    case 'genre':
                        if (code) endpoint = `/movies/by-genre/${code}`;
                        break;
                    case 'language':
                        if (code) endpoint = `/movies/by-language/${code}`;
                        break;
                    case 'top-rated':
                        endpoint = '/movies/top-rated';
                        break;
                    case 'trending':
                        endpoint = '/movies/trending';
                        break;
                    default:
                        endpoint = '/movies/trending';
                }

                if (endpoint) {
                    // Use paged=true to request pagination object from API
                    const url = `${API_BASE}${endpoint}?page=${currentPage}&limit=24&paged=true`;

                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        // Handle pagination response format
                        if (data.movies && Array.isArray(data.movies)) {
                            setMovies(data.movies);
                            setTotalPages(data.total_pages || 1);
                            setTotalResults(data.total_results || 0);
                        } else if (Array.isArray(data)) {
                            // Fallback in case paged=true is ignored
                            setMovies(data);
                        } else {
                            console.error("Invalid API response format:", data);
                            setError("API trả về dữ liệu không hợp lệ");
                        }
                    } else {
                        setError(`API Error: ${res.status} ${res.statusText}`);
                    }
                } else {
                    setError('Invalid endpoint configuration');
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError(error instanceof Error ? error.message : 'Unknown network error');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [type, code, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-6 pb-10">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold">{title}</h1>
                </div>

                {loading ? (
                    <div className="min-h-[50vh] flex items-center justify-center">
                        <div className="text-xl text-zinc-400">Đang tải...</div>
                    </div>
                ) : error ? (
                    <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-400">
                        <div className="text-xl font-bold mb-2">Đã xảy ra lỗi</div>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700 text-white"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <>
                        {movies.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                {movies.map(movie => (
                                    <div key={movie.id} className="flex justify-center">
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-zinc-500 mt-20">
                                <p className="text-xl">Không tìm thấy phim nào.</p>
                                <p className="text-sm mt-2">API trả về danh sách rỗng.</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Trước
                                </button>

                                <span className="text-zinc-400">
                                    Trang <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Floating Back Button */}
            <button
                onClick={() => router.back()}
                className="fixed bottom-8 right-8 p-4 bg-white text-black rounded-full shadow-lg z-50 transition-all hover:scale-110 hover:bg-zinc-200 active:scale-95 group"
                title="Quay lại"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </button>
        </div>
    );
}

export default function MovieListPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Đang tải...</div>}>
            <MovieListContent />
        </Suspense>
    );
}
