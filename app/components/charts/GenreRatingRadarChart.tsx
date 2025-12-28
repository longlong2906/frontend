"use client";

import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface GenreRatingRadarChartProps {
  data: any[];
}

export default function GenreRatingRadarChart({ data }: GenreRatingRadarChartProps) {
  return (
    <ChartCard id="genre-rating-radar" title="⭐ Rating Theo Thể Loại" subtitle="So sánh weighted rating">
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={data.slice(0, 8)}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis 
            dataKey="genre" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[5.5, 7]} 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            tickCount={4} 
          />
          <Radar name="Weighted Rating" dataKey="avg_weighted_rating" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333', 
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#ffffff', fontWeight: 600 }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: any) => [typeof value === 'number' ? value.toFixed(2) : value, 'Rating']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

