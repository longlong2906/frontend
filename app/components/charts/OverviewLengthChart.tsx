"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface OverviewLengthChartProps {
  data: any[];
}

export default function OverviewLengthChart({ data }: OverviewLengthChartProps) {
  return (
    <ChartCard id="overview-length" title="📝 Phân Tích Độ Dài Mô Tả" subtitle="Rating theo số từ trong overview">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="length_group" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Nhóm độ dài', position: 'insideBottom', offset: -5, fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            domain={[5, 7]}
            label={{ value: 'Rating', angle: -90, position: 'insideLeft', fill: '#ffffff', style: { textAnchor: 'middle' } }}
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
          <Bar dataKey="avg_weighted_rating" name="Weighted Rating" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

