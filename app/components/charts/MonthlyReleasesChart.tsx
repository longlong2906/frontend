"use client";

import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface MonthlyReleasesChartProps {
  data: any[];
}

export default function MonthlyReleasesChart({ data }: MonthlyReleasesChartProps) {
  return (
    <ChartCard id="monthly-releases" title="📆 Phát Hành Theo Tháng" subtitle="Số phim và Rating trung bình">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="month_name"
            stroke="#aaa"
            tick={{ fill: '#ffffff', fontSize: 12 }}
            label={{ value: 'Tháng', position: 'insideBottom', offset: -5, fill: '#ffffff', style: { textAnchor: 'middle' } }}
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
            domain={[5.5, 6.5]}
            label={{ value: 'Rating', angle: 90, position: 'insideRight', fill: '#ffffff', style: { textAnchor: 'middle' } }}
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
            formatter={(value: any, name: any) => {
              if (name === 'Số phim') {
                return [value?.toLocaleString() || value, name];
              }
              return [typeof value === 'number' ? value.toFixed(2) : value, name];
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="count" name="Số phim" fill="#8b5cf6" />
          <Line yAxisId="right" type="monotone" dataKey="avg_weighted_rating" name="Rating Trung Bình" stroke="#f59e0b" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

