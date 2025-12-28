"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/30 via-black to-fuchsia-950/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo & Title */}
        <div className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl mb-8 shadow-2xl shadow-violet-500/30">
            <span className="text-5xl">🎬</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Movie Recommendation System
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Hệ thống gợi ý phim thông minh
          </p>
        </div>

        {/* Stats Preview */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { label: 'Phim', value: '10,000', icon: '🎥' },
            { label: 'Thể loại', value: '19', icon: '🎭' },
            { label: 'Ngôn ngữ', value: '15+', icon: '🌍' },
            { label: 'Năm', value: '1930-2022', icon: '📅' }
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-4 text-center hover:border-violet-500/50 transition-colors">
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-700 rounded-full font-semibold text-lg hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600 hover:border-transparent hover:shadow-xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Xem Dashboard
          </Link>
          
          <Link
            href="/movies"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-700 rounded-full font-semibold text-lg hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600 hover:border-transparent hover:shadow-xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Xem Danh Sách Phim
          </Link>
        </div>

        {/* Features */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            {
              icon: '📊',
              title: 'Trực quan hóa dữ liệu',
              desc: '20 loại biểu đồ để phân tích dữ liệu phim'
            },
            {
              icon: '🤖',
              title: 'Gợi ý thông minh',
              desc: 'Thuật toán ML gợi ý phim dựa trên sở thích của bạn'
            },
            {
              icon: '🔍',
              title: 'Tìm kiếm nâng cao',
              desc: 'Tìm kiếm phim theo tên. Lọc phim theo thể loại, quốc gia'
            }
          ].map((feature, i) => (
            <div key={i} className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-violet-500/30 transition-colors group">
              <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{feature.icon}</span>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}
