"use client";

import React, { useState } from 'react';
import ChartCard from './ChartCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'];

interface WordCloudItem {
  text: string;
  value: number;
}

interface WordCloudChartProps {
  data: WordCloudItem[];
}

export default function WordCloudChart({ data }: WordCloudChartProps) {
  const [hoveredWord, setHoveredWord] = useState<{text: string, value: number, x: number, y: number} | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>, word: WordCloudItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const container = e.currentTarget.closest('[data-wordcloud-container]') as HTMLElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      setHoveredWord({
        text: word.text,
        value: word.value,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredWord(null);
  };

  return (
    <ChartCard id="wordcloud" title="☁️ Word Cloud - Overview" subtitle="Từ khóa từ mô tả phim">
      <div 
        data-wordcloud-container
        className="relative flex flex-wrap gap-2 justify-center items-center min-h-[300px] p-4"
        onMouseLeave={handleMouseLeave}
      >
        {data.slice(0, 60).map((word, index) => (
          <span
            key={index}
            className="transition-transform hover:scale-110 cursor-default relative z-10"
            onMouseEnter={(e) => handleMouseEnter(e, word)}
            style={{
              fontSize: `${Math.max(12, Math.min(48, word.value / 50))}px`,
              color: COLORS[index % COLORS.length],
              opacity: 0.7 + (word.value / (data[0]?.value || 1)) * 0.3,
              fontWeight: word.value > 1000 ? 'bold' : 'normal'
            }}
          >
            {word.text}
          </span>
        ))}
        
        {hoveredWord && (
          <div
            className="absolute bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none"
            style={{
              left: `${hoveredWord.x}px`,
              top: `${hoveredWord.y - 35}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-white text-sm font-semibold">{hoveredWord.text}</div>
            <div className="text-gray-300 text-xs">Số lần xuất hiện: {hoveredWord.value.toLocaleString()}</div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}

