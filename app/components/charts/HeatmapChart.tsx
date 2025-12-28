"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import ChartCard from './ChartCard';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface HeatmapChartProps {
  data: {
    columns: string[];
    data: number[][];
  } | null;
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  return (
    <ChartCard id="heatmap" title="🔥 Ma Trận Tương Quan">
      <div style={{ height: 400 }}>
        {data && (
          <Plot
            data={[{
              z: data.data,
              x: data.columns,
              y: data.columns,
              type: 'heatmap',
              colorscale: 'RdBu',
              reversescale: true,
              zmin: -1,
              zmax: 1,
              hoverongaps: false,
              hovertemplate: '%{x} vs %{y}<br>Correlation: %{z:.2f}<extra></extra>'
            }]}
            layout={{
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: '#ffffff', size: 12 },
              margin: { l: 120, r: 50, t: 30, b: 120 },
              xaxis: { 
                tickangle: -45,
                tickfont: { color: '#ffffff', size: 11 },
                title: { font: { color: '#ffffff', size: 13 } }
              },
              yaxis: { 
                autorange: 'reversed',
                tickfont: { color: '#ffffff', size: 11 },
                title: { font: { color: '#ffffff', size: 13 } }
              },
              coloraxis: {
                colorbar: {
                  tickfont: { color: '#ffffff', size: 11 },
                  title: { font: { color: '#ffffff', size: 12 } }
                }
              }
            }}
            config={{ displayModeBar: true, responsive: true }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
    </ChartCard>
  );
}

