"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

interface WeightedRatingDistributionChartProps {
  data: any[];
}

export default function WeightedRatingDistributionChart({ data }: WeightedRatingDistributionChartProps) {
  return (
    <ChartCard id="weighted-rating-distribution" title="📊 Phân Bố Weighted Rating">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="range"
            stroke="#aaa"
            tick={{
              fontSize: 11,
              fill: '#ffffff',
              angle: -45,
              textAnchor: 'end'
            } as any}
            height={60}
            label={{ value: 'Weighted Rating', position: 'bottom', offset: 10, fill: '#ffffff', style: { textAnchor: 'middle', fontSize: 13 } }}
          />
          <YAxis
            stroke="#aaa"
            tick={{
              fontSize: 12,
              fill: '#ffffff'
            }}
            label={{ value: 'Số lượng', angle: -90, position: 'insideLeft', fill: '#ffffff', style: { textAnchor: 'middle' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: any) => [typeof value === 'number' ? value.toLocaleString() : value, 'Số lượng']}
          />
          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

