"use client";

import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface RatingByLanguageChartProps {
  data: any[];
}

export default function RatingByLanguageChart({ data }: RatingByLanguageChartProps) {
  return (
    <ChartCard id="rating-by-language" title="🌐 Rating Theo Ngôn Ngữ" subtitle="Weighted rating theo ngôn ngữ">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} layout="vertical" margin={{ left: 80, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            type="number" 
            domain={[5, 7]} 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Rating', position: 'insideBottom', offset: -5, fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            type="category" 
            dataKey="language_name" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 500 }}
            width={80}
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
          <Bar dataKey="avg_weighted_rating" name="Weighted Rating" barSize={15} fill="#14b8a6" radius={[0, 4, 4, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

