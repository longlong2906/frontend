"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'];

interface LanguageDistributionChartProps {
  data: any[];
}

export default function LanguageDistributionChart({ data }: LanguageDistributionChartProps) {
  return (
    <ChartCard id="language-distribution" title="🌍 Phân Bố Ngôn Ngữ" subtitle="Top 10 ngôn ngữ phổ biến">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="count"
            nameKey="language"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            labelStyle={{ color: '#ffffff' }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: any, name: any, props: any) => {
              const total = data.reduce((sum, item) => sum + item.count, 0);
              const percent = ((value / total) * 100).toFixed(1);
              return [`${value} phim (${percent}%)`, name];
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={80}
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const item = data.find(d => d.language === value);
              if (item) {
                const total = data.reduce((sum, d) => sum + d.count, 0);
                const percent = ((item.count / total) * 100).toFixed(1);
                return `${value} (${percent}%)`;
              }
              return value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

