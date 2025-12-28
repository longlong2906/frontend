"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/movies/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const isActive = (path: string) => pathname === path;
    const showSearchBar = pathname?.startsWith('/movies') && pathname !== '/movies/recommend';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl">🎬</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 hidden sm:block">
                        MovieRecSys
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors hover:text-white ${isActive('/') ? 'text-white' : 'text-zinc-400'}`}
                    >
                        Trang chủ
                    </Link>
                    <Link
                        href="/movies"
                        className={`text-sm font-medium transition-colors hover:text-white ${isActive('/movies') ? 'text-white' : 'text-zinc-400'}`}
                    >
                        Danh sách phim
                    </Link>
                    <Link
                        href="/movies/recommend"
                        className={`text-sm font-medium transition-colors hover:text-white ${isActive('/movies/recommend') ? 'text-white' : 'text-zinc-400'}`}
                    >
                        Gợi ý phim
                    </Link>
                    <Link
                        href="/dashboard"
                        className={`text-sm font-medium transition-colors hover:text-white ${isActive('/dashboard') ? 'text-white' : 'text-zinc-400'}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/evaluation"
                        className={`text-sm font-medium transition-colors hover:text-white ${isActive('/evaluation') ? 'text-white' : 'text-zinc-400'}`}
                    >
                        Đánh giá mô hình
                    </Link>
                </div>

                {/* Search Bar */}
                {showSearchBar && (
                    <form onSubmit={handleSearch} className="relative hidden md:block group">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phim..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/20 text-white text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 w-64 border border-white/10 transition-all focus:w-72 focus:bg-black/50"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                )}

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white">
                                        {user?.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-white hidden sm:block">
                                        {user?.fullName}
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={logout}
                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-zinc-800 text-white text-sm font-bold rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
