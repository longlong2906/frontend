"use client";

import React, { useState, useEffect } from 'react';

interface ChartItem {
  id: string;
  title: string;
  icon: string;
}

const CHART_ITEMS: ChartItem[] = [
  { id: 'top-movies', title: 'Top 10 Phim', icon: '🏆' },
  { id: 'language-distribution', title: 'Phân Bố Ngôn Ngữ', icon: '🌍' },
  { id: 'weighted-rating-distribution', title: 'Phân Bố Rating', icon: '📊' },
  { id: 'yearly-trend', title: 'Xu Hướng Theo Năm', icon: '📈' },
  { id: 'scatter-plot', title: 'Scatter Plot', icon: '🎯' },
  { id: 'movie-age-analysis', title: 'Phân Tích Theo Tuổi Phim', icon: '📅' },
  { id: 'genre-distribution', title: 'Phân Bố Thể Loại', icon: '🎭' },
  { id: 'genre-rating-radar', title: 'Rating Theo Thể Loại', icon: '⭐' },
  { id: 'decade-distribution', title: 'Phim Theo Thập Kỷ', icon: '📆' },
  { id: 'heatmap', title: 'Ma Trận Tương Quan', icon: '🔥' },
  { id: 'overview-length', title: 'Phân Tích Độ Dài Mô Tả', icon: '📝' },
  { id: 'dayofweek', title: 'Phân Tích Ngày Phát Hành', icon: '📅' },
  { id: 'genre-by-decade', title: 'Thể Loại Theo Thập Kỷ', icon: '📚' },
  { id: 'monthly-releases', title: 'Phát Hành Theo Tháng', icon: '📆' },
  { id: 'bubble-chart', title: 'Bubble Chart - Top 50 Phim theo Popularity', icon: '🫧' },
  { id: 'wordcloud', title: 'Word Cloud - Overview', icon: '☁️' },
  { id: 'network-graph', title: 'Mối Quan Hệ Thể Loại', icon: '🕸️' },
  { id: 'treemap', title: 'Treemap Theo Thể Loại', icon: '🌳' },
  { id: 'normalized-comparison', title: 'So Sánh Normalized', icon: '📊' },
  { id: 'rating-by-language', title: 'Rating Theo Ngôn Ngữ', icon: '🌐' },
];

export default function ChartNavigation() {
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = window.scrollY + viewportHeight / 2; // Vị trí giữa viewport
      
      // Tìm section đang ở gần center của viewport nhất
      let activeItemId: string | null = null;
      let minDistance = Infinity;
      
      for (const item of CHART_ITEMS) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          const elementBottom = elementTop + rect.height;
          const elementCenter = elementTop + rect.height / 2;
          
          // Tính khoảng cách từ center của viewport đến center của element
          const distance = Math.abs(viewportCenter - elementCenter);
          
          // Ưu tiên element đang trong viewport hoặc gần viewport nhất
          // Kiểm tra nếu element đang ở trong viewport hoặc phần lớn của nó đang hiển thị
          const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
          const isNearViewport = Math.abs(rect.top) < viewportHeight * 1.5;
          
          if ((isInViewport || isNearViewport) && distance < minDistance) {
            minDistance = distance;
            activeItemId = item.id;
          }
        }
      }
      
      // Fallback: Nếu không tìm thấy, tìm section có phần đầu gần với top của viewport nhất
      if (!activeItemId) {
        let closestTopDistance = Infinity;
        for (const item of CHART_ITEMS) {
          const element = document.getElementById(item.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const distanceFromTop = Math.abs(rect.top);
            
            if (distanceFromTop < closestTopDistance) {
              closestTopDistance = distanceFromTop;
              activeItemId = item.id;
            }
          }
        }
      }
      
      if (activeItemId) {
        setActiveId(activeItemId);
      }
    };

    // Gọi ngay lần đầu để set active item
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToChart = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsExpanded(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-violet-600 hover:bg-violet-500 rounded-full shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all duration-200"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Navigation Sidebar */}
      <nav 
        className={`fixed top-20 z-40 transition-all duration-300 
          ${isExpanded ? 'left-0' : '-left-full lg:left-4'}
          lg:left-4 w-64 lg:w-72 max-h-[calc(100vh-6rem)] overflow-y-auto
          bg-zinc-900/95 backdrop-blur-lg border border-zinc-800 rounded-xl shadow-xl`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Biểu đồ</h2>
            <span className="text-sm font-bold text-white bg-cyan-500 px-3 py-1.5 rounded-full shadow-lg shadow-cyan-500/30">
              {CHART_ITEMS.length} biểu đồ
            </span>
          </div>
          
          <div className="space-y-1">
            {CHART_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToChart(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200
                  ${activeId === item.id 
                    ? 'bg-violet-600 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span className="flex-1 min-w-0 break-words leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}

