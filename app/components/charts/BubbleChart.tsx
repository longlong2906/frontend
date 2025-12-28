"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import ChartCard from './ChartCard';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface BubbleItem {
  title: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre: string;
  release_year: number;
  weighted_rating: number;
  movie_age: number;
  decade: number;
}

interface BubbleChartProps {
  data: BubbleItem[];
}

export default function BubbleChart({ data }: BubbleChartProps) {
  return (
    <ChartCard id="bubble-chart" title="🫧 Bubble Chart - Top 50 Phim theo Popularity">
      <div style={{ height: 400 }}>
        {data.length > 0 && (
          <Plot
            data={[{
              x: data.map((d) => d.weighted_rating),
              y: data.map((d) => d.popularity),
              text: data.map((d) => `${d.title} (${d.release_year})`),
              customdata: data.map((d) => d.vote_count),
              mode: 'markers',
              type: 'scatter',
              marker: {
                size: data.map((d) => Math.sqrt(d.vote_count) / 5),
                color: data.map((d) => d.decade),
                colorscale: 'Portland',
                showscale: true,
                colorbar: { 
                  title: { 
                    text: 'Decade', 
                    font: { color: '#ffffff', size: 12 },
                    side: 'bottom'
                  },
                  tickfont: { color: '#ffffff', size: 11 }
                },
                opacity: 0.7,
                line: { width: 1, color: '#fff' }
              },
              hovertemplate: '<b>%{text}</b><br>Weighted Rating: %{x:.2f}<br>Popularity: %{y:,.2f}<br>Vote Count: %{customdata:,}<extra></extra>'
            }]}
            layout={{
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'transparent',
              font: { color: '#ffffff', size: 12 },
              xaxis: { 
                title: { text: 'Weighted Rating', font: { color: '#ffffff', size: 13 } },
                tickfont: { color: '#ffffff', size: 11 },
                gridcolor: '#333', 
                zerolinecolor: '#555',
                linecolor: '#666'
              },
              yaxis: { 
                title: { 
                  text: 'Popularity', 
                  font: { color: '#ffffff', size: 13 },
                  standoff: 15
                },
                tickfont: { color: '#ffffff', size: 11 },
                tickformat: ',.0f',
                gridcolor: '#333', 
                zerolinecolor: '#555',
                linecolor: '#666'
              },
              margin: { l: 70, r: 50, t: 30, b: 70 },
              hovermode: 'closest',
              coloraxis: {
                colorbar: {
                  tickfont: { color: '#ffffff', size: 11 },
                  title: { 
                    text: 'Decade', 
                    font: { color: '#ffffff', size: 12 },
                    side: 'bottom'
                  }
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

