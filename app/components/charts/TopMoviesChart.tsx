"use client";

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';

interface TopMoviesChartProps {
  data: any[];
}

export default function TopMoviesChart({ data }: TopMoviesChartProps) {
  return (
    <ChartCard 
      id="top-movies"
      title="🏆 Top 10 Phim có Weighted Rating cao nhất" 
      subtitle="Điểm đánh giá có trọng số IMDB"
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ left: 200, right: 20, top: 10, bottom: 35 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            type="number" 
            domain={[7.5, 9]} 
            stroke="#aaa" 
            tick={{ fill: '#ffffff', fontSize: 13, fontWeight: 500 }}
            label={{ value: 'Weighted Rating', position: 'bottom', offset: 10, fill: '#ffffff', style: { textAnchor: 'middle', fontSize: 13 } }}
          />
          <YAxis 
            type="category" 
            dataKey="title" 
            stroke="#ffffff"
            tick={{ 
              fill: '#ffffff', 
              fontSize: 13, 
              fontWeight: 500,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }} 
            width={200}
            interval={0}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333', 
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#ffffff', fontWeight: 600, fontSize: 14 }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : value, 'Weighted Rating']}
          />
          <Bar dataKey="weighted_rating" fill="url(#barGradient)" radius={[0, 4, 4, 0]} />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

