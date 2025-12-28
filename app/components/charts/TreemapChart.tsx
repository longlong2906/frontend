"use client";

import React, { useState } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'];

interface TreemapChartProps {
  data: any[];
}

export default function TreemapChart({ data }: TreemapChartProps) {
  const [hoveredItem, setHoveredItem] = useState<{name: string, size: number, x: number, y: number} | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const treemapData = data.map((g, i) => ({
    name: g.genre,
    size: g.count,
    fill: COLORS[i % COLORS.length]
  }));

  const handleMouseEnter = (e: React.MouseEvent<SVGRectElement>, name: string, size: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHoveredItem({
        name,
        size,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <ChartCard id="treemap" title="🌳 Treemap Thể Loại" subtitle="Phân bố theo kích thước">
      <div ref={containerRef} className="relative">
        <ResponsiveContainer width="100%" height={350}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4/3}
            stroke="#1a1a1a"
            content={({ x, y, width, height, name, size, fill }: any) => (
              <g>
                <rect 
                  x={x} 
                  y={y} 
                  width={width} 
                  height={height} 
                  fill={fill} 
                  stroke="#1a1a1a" 
                  strokeWidth={2}
                  className="cursor-pointer transition-opacity hover:opacity-90"
                  onMouseEnter={(e) => handleMouseEnter(e, name, size)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
                {width > 50 && height > 30 && (
                  <text 
                    x={x + width/2} 
                    y={y + height/2} 
                    textAnchor="middle" 
                    fill="#fff" 
                    fontSize={11}
                    fontWeight={600}
                    className="pointer-events-none"
                  >
                    {name}
                  </text>
                )}
              </g>
            )}
          />
        </ResponsiveContainer>
        
        {/* Tooltip */}
        {hoveredItem && (
          <div
            className="absolute bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none"
            style={{
              left: `${hoveredItem.x}px`,
              top: `${hoveredItem.y - 45}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="text-white text-sm font-semibold">{hoveredItem.name}</div>
            <div className="text-gray-300 text-xs">Số lượng: {hoveredItem.size.toLocaleString()} phim</div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}

