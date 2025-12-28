"use client";

import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface YearlyTrendChartProps {
  data: any[];
}

export default function YearlyTrendChart({ data }: YearlyTrendChartProps) {
  return (
    <ChartCard id="yearly-trend" title="📈 Xu Hướng Theo Năm" subtitle="Số lượng vote và Rating trung bình">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 60, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="release_year" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Năm', position: 'insideBottom', offset: -5, fill: '#ffffff', style: { textAnchor: 'middle' } }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            width={60}
            label={{ value: 'Tổng Vote', angle: -90, position: 'insideLeft', offset: -10, fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            domain={[5, 8]}
            label={{ value: 'Weighted Rating', angle: 90, position: 'insideRight', fill: '#ffffff', style: { textAnchor: 'middle' } }}
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
              if (name === 'Tổng số Vote') {
                return [value?.toLocaleString() || value, name || ''];
              }
              return [typeof value === 'number' ? value.toFixed(2) : value, name || ''];
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="vote_count" name="Tổng số Vote" fill="#8b5cf6" opacity={0.3} />
          <Line yAxisId="right" type="monotone" dataKey="weighted_rating" name="Weighted Rating" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

