"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface GenreByDecadeChartProps {
  data: any[];
}

export default function GenreByDecadeChart({ data }: GenreByDecadeChartProps) {
  return (
    <ChartCard id="genre-by-decade" title="📚 Thể Loại Theo Thập Kỷ" subtitle="Xu hướng thể loại qua các thời kỳ">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="decade" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Thập kỷ', position: 'insideBottom', offset: -5, fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Số lượng', angle: -90, position: 'insideLeft', fill: '#ffffff', style: { textAnchor: 'middle' } }}
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
            formatter={(value: any, name: string | undefined) => {
              if (value === null || value === undefined || value === 0) return null;
              return [value?.toLocaleString() || value, name || 'Số lượng'];
            }}
            labelFormatter={(label) => `Thập kỷ: ${label}`}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Drama" stackId="a" fill="#8b5cf6" />
          <Bar dataKey="Comedy" stackId="a" fill="#06b6d4" />
          <Bar dataKey="Action" stackId="a" fill="#10b981" />
          <Bar dataKey="Thriller" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Romance" stackId="a" fill="#ec4899" />
          <Bar dataKey="Horror" stackId="a" fill="#ef4444" />
          <Bar dataKey="Adventure" stackId="a" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

