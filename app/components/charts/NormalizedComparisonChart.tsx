"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface NormalizedComparisonChartProps {
  data: any[];
}

export default function NormalizedComparisonChart({ data }: NormalizedComparisonChartProps) {
  return (
    <ChartCard id="normalized-comparison" title="📊 So Sánh Normalized" subtitle="Các giá trị đã chuẩn hóa [0-1]">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
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
            domain={[0, 0.5]}
            label={{ value: 'Giá trị chuẩn hóa', angle: -90, position: 'insideLeft', fill: '#ffffff', style: { textAnchor: 'middle' } }}
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
              const formattedValue = typeof value === 'number' ? value.toFixed(4) : value;
              const nameMap: { [key: string]: string } = {
                'popularity_normalized': 'Popularity',
                'vote_average_normalized': 'Vote Average',
                'vote_count_normalized': 'Vote Count'
              };
              return [formattedValue, nameMap[name] || name];
            }}
            labelFormatter={(label: string) => `Thập kỷ: ${label}`}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line type="monotone" dataKey="popularity_normalized" name="Popularity" stroke="#8b5cf6" strokeWidth={2} />
          <Line type="monotone" dataKey="vote_average_normalized" name="Vote Avg" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="vote_count_normalized" name="Vote Count" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

