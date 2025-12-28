"use client";

import React, { useState } from 'react';
import ChartCard from './ChartCard';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16'];

interface NetworkNode {
  id: string;
  group: number;
  size: number;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

interface NetworkGraphProps {
  data: {
    nodes: NetworkNode[];
    links: NetworkLink[];
  } | null;
}

export default function NetworkGraph({ data }: NetworkGraphProps) {
  const [hoveredLink, setHoveredLink] = useState<{link: NetworkLink, x: number, y: number} | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{node: NetworkNode, x: number, y: number} | null>(null);

  if (!data || !data.nodes || !data.links) {
    return (
      <ChartCard id="network-graph" title="🕸️ Network - Mối Quan Hệ Thể Loại" subtitle="Các thể loại thường đi cùng nhau">
        <div className="relative h-[400px] flex items-center justify-center text-gray-400">
          Không có dữ liệu
        </div>
      </ChartCard>
    );
  }

  // Tính toán vị trí cho nodes và links
  const nodePositions = data.nodes.map((node, i) => {
    const angle = (i / data.nodes.length) * 2 * Math.PI - Math.PI/2;
    const radius = 130;
    const centerX = 200;
    const centerY = 175;
    return {
      node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle
    };
  });

  // Tìm vị trí của link để hiển thị tooltip
  const getLinkMidpoint = (link: NetworkLink) => {
    const sourcePos = nodePositions.find(p => p.node.id === link.source);
    const targetPos = nodePositions.find(p => p.node.id === link.target);
    if (!sourcePos || !targetPos) return null;
    return {
      x: (sourcePos.x + targetPos.x) / 2,
      y: (sourcePos.y + targetPos.y) / 2
    };
  };

  // Sắp xếp links theo value để vẽ các link quan trọng nhất ở trên
  const sortedLinks = [...data.links].sort((a, b) => b.value - a.value);
  const maxLinkValue = Math.max(...data.links.map(l => l.value), 1);

  return (
    <ChartCard id="network-graph" title="🕸️ Network - Mối Quan Hệ Thể Loại" subtitle="Các thể loại thường đi cùng nhau">
      <div className="relative h-[400px] flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 400 350" className="overflow-visible">
          {/* Links - vẽ từ thấp đến cao để link quan trọng nhất ở trên */}
          {sortedLinks.map((link, i) => {
            const sourcePos = nodePositions.find(p => p.node.id === link.source);
            const targetPos = nodePositions.find(p => p.node.id === link.target);
            if (!sourcePos || !targetPos) return null;
            
            const strokeWidth = Math.max(1, Math.min(6, (link.value / maxLinkValue) * 5));
            const opacity = Math.max(0.4, Math.min(0.8, 0.4 + (link.value / maxLinkValue) * 0.4));
            const midpoint = getLinkMidpoint(link);
            
            return (
              <g key={`${link.source}-${link.target}`}>
                <line 
                  x1={sourcePos.x} 
                  y1={sourcePos.y} 
                  x2={targetPos.x} 
                  y2={targetPos.y}
                  stroke="#64748b" 
                  strokeWidth={strokeWidth} 
                  opacity={opacity + 0.1}
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    if (midpoint) {
                      const svg = e.currentTarget.closest('svg');
                      if (svg) {
                        const svgRect = svg.getBoundingClientRect();
                        setHoveredLink({
                          link,
                          x: midpoint.x,
                          y: midpoint.y
                        });
                      }
                    }
                  }}
                  onMouseLeave={() => setHoveredLink(null)}
                />
              </g>
            );
          })}
          
          {/* Nodes */}
          {nodePositions.map(({ node, x, y }, i) => {
            const size = Math.max(12, Math.min(28, (node.size / Math.max(...data.nodes.map(n => n.size), 1)) * 20 + 8));
            
            return (
              <g key={node.id}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size} 
                  fill={COLORS[node.group % COLORS.length]} 
                  stroke="#fff" 
                  strokeWidth={2.5}
                  className="cursor-pointer transition-all hover:stroke-yellow-400 hover:stroke-width-3"
                  onMouseEnter={(e) => {
                    const svg = e.currentTarget.closest('svg');
                    if (svg) {
                      setHoveredNode({
                        node,
                        x: x,
                        y: y - size - 5
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <text 
                  x={x} 
                  y={y + size + 16} 
                  textAnchor="middle" 
                  fill="#ffffff" 
                  fontSize={11} 
                  fontWeight={600}
                  className="pointer-events-none select-none"
                >
                  {node.id}
                </text>
              </g>
            );
          })}

          {/* Tooltip cho link */}
          {hoveredLink && (
            <g>
              {/* Shadow/Backdrop */}
              <rect
                x={hoveredLink.x - 80}
                y={hoveredLink.y - 24}
                width={160}
                height={82}
                fill="rgba(0, 0, 0, 0.95)"
                stroke="#64748b"
                strokeWidth={2}
                rx={8}
                className="pointer-events-none"
              />
              {/* Header line */}
              <line
                x1={hoveredLink.x - 75}
                y1={hoveredLink.y - 8}
                x2={hoveredLink.x + 75}
                y2={hoveredLink.y - 8}
                stroke="#64748b"
                strokeWidth={1}
                opacity={0.5}
                className="pointer-events-none"
              />
              {/* Source genre */}
              <text
                x={hoveredLink.x}
                y={hoveredLink.y + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={13}
                fontWeight={700}
                className="pointer-events-none"
              >
                {hoveredLink.link.source}
              </text>
              {/* Arrow connector */}
              <text
                x={hoveredLink.x}
                y={hoveredLink.y + 20}
                textAnchor="middle"
                fill="#64748b"
                fontSize={14}
                fontWeight={700}
                className="pointer-events-none"
              >
                ↔
              </text>
              {/* Target genre */}
              <text
                x={hoveredLink.x}
                y={hoveredLink.y + 36}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={13}
                fontWeight={700}
                className="pointer-events-none"
              >
                {hoveredLink.link.target}
              </text>
              {/* Count */}
              <text
                x={hoveredLink.x}
                y={hoveredLink.y + 54}
                textAnchor="middle"
                fill="#06b6d4"
                fontSize={11}
                fontWeight={600}
                className="pointer-events-none"
              >
                {hoveredLink.link.value.toLocaleString()} lần xuất hiện cùng nhau
              </text>
            </g>
          )}

          {/* Tooltip cho node */}
          {hoveredNode && (
            <g>
              <rect
                x={hoveredNode.x - 40}
                y={hoveredNode.y - 20}
                width={80}
                height={25}
                fill="rgba(0, 0, 0, 0.85)"
                stroke={COLORS[hoveredNode.node.group % COLORS.length]}
                strokeWidth={1.5}
                rx={6}
                className="pointer-events-none"
              />
              <text
                x={hoveredNode.x}
                y={hoveredNode.y - 5}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={10}
                fontWeight={600}
                className="pointer-events-none"
              >
                {hoveredNode.node.id}
              </text>
              <text
                x={hoveredNode.x}
                y={hoveredNode.y + 10}
                textAnchor="middle"
                fill="#a5a5a5"
                fontSize={9}
                className="pointer-events-none"
              >
                {hoveredNode.node.size.toLocaleString()} phim
              </text>
            </g>
          )}
        </svg>
      </div>
    </ChartCard>
  );
}

