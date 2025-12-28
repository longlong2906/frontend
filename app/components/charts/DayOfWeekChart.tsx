"use client";

import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface DayOfWeekChartProps {
  data: any[];
}

export default function DayOfWeekChart({ data }: DayOfWeekChartProps) {
  return (
    <ChartCard id="dayofweek" title="📅 Phân Tích Ngày Phát Hành">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="day_name" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 500 }}
            label={{ value: 'Ngày trong tuần', position: 'insideBottom', offset: -5, fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            yAxisId="left" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Số phim', angle: -90, position: 'insideLeft', fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            domain={[5, 7]}
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
              if (name === 'Số phim') {
                return [value?.toLocaleString() || value, name || ''];
              }
              return [typeof value === 'number' ? value.toFixed(2) : value, name || ''];
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="count" name="Số phim" fill="#ec4899" opacity={0.6} />
          <Line yAxisId="right" type="monotone" dataKey="avg_weighted_rating" name="Weighted Rating" stroke="#10b981" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

