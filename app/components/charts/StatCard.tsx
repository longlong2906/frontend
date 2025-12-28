"use client";

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 border border-zinc-800`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-zinc-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-zinc-400 opacity-50">
          {icon}
        </div>
      </div>
    </div>
  );
}

