"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface UserProfile {
    username: string;
    fullName: string;
    email: string;
    dob: string;
    address: string;
    favorites: any[];
}

export default function ProfilePage() {
    const { token, isAuthenticated, logout, isLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // Wait for auth check to finish

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                } else {
                    // If token invalid
                    logout();
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [isAuthenticated, token, router, logout, isLoading]);

    if (isLoading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* User Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sticky top-24">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-violet-500/20">
                                {profile.fullName.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                            <p className="text-zinc-400">@{profile.username}</p>
                        </div>

                        <div className="space-y-4 border-t border-zinc-800 pt-6">
                            <div>
                                <label className="text-xs text-zinc-500 uppercase font-semibold">Email</label>
                                <p className="text-zinc-200">{profile.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 uppercase font-semibold">Ngày sinh</label>
                                <p className="text-zinc-200">{profile.dob || 'Chưa cập nhật'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 uppercase font-semibold">Địa chỉ</label>
                                <p className="text-zinc-200">{profile.address || 'Chưa cập nhật'}</p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full mt-8 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Favorites Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Danh sách yêu thích
                        <span className="text-sm font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                            {profile.favorites.length}
                        </span>
                    </h2>

                    {profile.favorites.length === 0 ? (
                        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-12 text-center">
                            <span className="text-4xl mb-4 block">💔</span>
                            <h3 className="text-xl font-bold mb-2">Chưa có phim yêu thích</h3>
                            <p className="text-zinc-400 mb-6">Hãy khám phá và thêm phim vào bộ sưu tập của bạn!</p>
                            <Link
                                href="/movies"
                                className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors"
                            >
                                Khám phá phim ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {profile.favorites.map((movie: any) => (
                                <Link href={`/movies/${movie.id}`} key={movie.id} className="group">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-violet-500/50 transition-colors">
                                        <div className="aspect-[2/3] bg-zinc-800 relative">
                                            {movie.poster_path ? (
                                                <Image
                                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                    alt={movie.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 group-hover:scale-105 transition-transform duration-500">
                                                    <span className="text-4xl group-hover:scale-110 transition-transform">🎬</span>
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                                                <h3 className="font-semibold text-white line-clamp-1">{movie.title}</h3>
                                                <div className="flex items-center justify-between text-xs text-zinc-400 mt-1">
                                                    <span>{movie.release_year}</span>
                                                    <span className="flex items-center gap-1">
                                                        ⭐ {movie.vote_average?.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
