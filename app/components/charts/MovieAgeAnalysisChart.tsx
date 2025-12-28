"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface MovieAgeAnalysisChartProps {
  data: any[];
}

export default function MovieAgeAnalysisChart({ data }: MovieAgeAnalysisChartProps) {
  return (
    <ChartCard id="movie-age-analysis" title="📅 Phân Tích Theo Tuổi Phim" subtitle="Rating trung bình theo độ tuổi của phim">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="age_group" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Nhóm tuổi', position: 'insideBottom', offset: -5, fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            domain={[5, 7]}
            label={{ value: 'Weighted Rating', angle: -90, position: 'insideLeft', fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
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
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="avg_weighted_rating" name="Weighted Rating" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

