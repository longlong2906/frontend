"use client";

import React from 'react';

interface ChartCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ id, title, subtitle, children, className = '' }: ChartCardProps) {
  return (
    <div 
      id={id}
      className={`bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 scroll-mt-20 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
