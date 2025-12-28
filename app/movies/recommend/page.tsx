"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    overview: string;
    poster_path?: string;
}

export default function RecommendPage() {
    const [query, setQuery] = useState('');
    const [sourceMovie, setSourceMovie] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setSearched(true);
        setMovies([]);
        setSourceMovie('');

        try {
            const res = await fetch(`${API_BASE}/recommend?title=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (res.ok) {
                setSourceMovie(data.source_movie);
                setMovies(data.movies);
            } else {
                setError(data.error || 'Không tìm thấy phim này. Vui lòng thử tên khác.');
            }
        } catch (err) {
            console.error(err);
            setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Hero / Search Section */}
                <div className="flex flex-col items-center justify-center mb-16 text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 pb-2">
                        Gợi Ý Phim
                    </h1>
                    <p className="text-zinc-400 max-w-2xl text-lg">
                        Nhập tên bộ phim bạn yêu thích, hệ thống sẽ phân tích nội dung và gợi ý cho bạn những bộ phim tương tự nhất.
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ví dụ: The Avengers, Titanic..."
                                className="w-full bg-zinc-900 text-white pl-6 pr-32 py-4 rounded-full border border-zinc-700 outline-none focus:border-violet-500 font-medium placeholder:text-zinc-600 shadow-xl"
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white font-bold px-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang tìm...' : 'Gợi ý ngay'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {searched && (
                    <div className="animate-fade-in-up">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 bg-zinc-900/50 rounded-2xl border border-red-900/30">
                                <span className="text-4xl mb-4 block">😕</span>
                                <h3 className="text-xl font-bold text-red-400 mb-2">Rất tiếc!</h3>
                                <p className="text-zinc-400">{error}</p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-end gap-3 mb-8 pb-4 border-b border-zinc-800">
                                    <span className="text-2xl">✨</span>
                                    <h2 className="text-2xl font-bold">
                                        Kết quả gợi ý dựa trên <span className="text-violet-400">"{sourceMovie}"</span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {movies.map((movie) => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
