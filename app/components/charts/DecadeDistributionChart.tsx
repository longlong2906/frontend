"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'];

interface DecadeDistributionChartProps {
  data: any[];
}

export default function DecadeDistributionChart({ data }: DecadeDistributionChartProps) {
  return (
    <ChartCard id="decade-distribution" title="📆 Phim Theo Thập Kỷ" subtitle="Phân bố số lượng phim">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            dataKey="count"
            nameKey="decade"
            label={({ name }: { name?: string }) => name || ''}
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
            labelStyle={{ color: '#ffffff', fontWeight: 600 }}
            itemStyle={{ color: '#ffffff' }}
            formatter={(value: any, name: any, props: any) => {
              const total = data.reduce((sum, item) => sum + item.count, 0);
              const percent = ((value / total) * 100).toFixed(1);
              return [`${value} phim (${percent}%)`, name];
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            contentStyle={{ color: '#ffffff', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

