"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import ChartCard from './ChartCard';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ScatterItem {
  title: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre: string;
  weighted_rating: number;
  release_year: number;
  movie_age: number;
  overview_length: number;
}

interface ScatterPlotChartProps {
  data: ScatterItem[];
}

export default function ScatterPlotChart({ data }: ScatterPlotChartProps) {
  return (
    <ChartCard id="scatter-plot" title="🎯 Scatter: Votes vs Rating vs Age" >
      <div style={{ height: 350 }}>
        {data.length > 0 && (
          <Plot
            data={[{
              x: data.map((d) => d.vote_count),
              y: data.map((d) => d.weighted_rating),
              text: data.map((d) => `${d.title} (${d.release_year})`),
              mode: 'markers',
              type: 'scatter',
              marker: {
                size: data.map((d) => Math.max(8, 30 - d.movie_age / 3)),
                color: data.map((d) => d.movie_age),
                colorscale: 'Viridis',
                showscale: true,
                colorbar: { 
                  title: { 
                    text: 'Age',
                    font: { color: '#ffffff', size: 13 }
                  },
                  tickfont: { color: '#ffffff', size: 11 },
                  outlinewidth: 0
                }
              },
              hovertemplate: '<b>%{text}</b><br>Votes: %{x}<br>Weighted Rating: %{y:.2f}<extra></extra>'
            }]}
            layout={{
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: '#ffffff', size: 12 },
              xaxis: { 
                title: { text: 'Vote Count', font: { color: '#ffffff', size: 13 } },
                tickfont: { color: '#ffffff', size: 11 },
                gridcolor: '#333', 
                zerolinecolor: '#555',
                linecolor: '#666'
              },
              yaxis: { 
                title: { text: 'Weighted Rating', font: { color: '#ffffff', size: 13 } },
                tickfont: { color: '#ffffff', size: 11 },
                gridcolor: '#333', 
                zerolinecolor: '#555',
                linecolor: '#666'
              },
              margin: { l: 70, r: 80, t: 30, b: 70 },
              hovermode: 'closest'
            }}
            config={{ displayModeBar: true, responsive: true }}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
    </ChartCard>
  );
}

