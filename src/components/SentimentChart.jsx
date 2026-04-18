import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { formatChartDate } from '../utils/date-helpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function SentimentChart({ data, height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height, color: 'var(--text-tertiary)' }}>
        <p>No sentiment data yet. Start journaling to see trends.</p>
      </div>
    );
  }

  const labels = data.map(d => formatChartDate(d.date));
  const scores = data.map(d => Math.round(d.score * 100));
  const clarityScores = data.map(d => d.clarity);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sentiment',
        data: scores,
        borderColor: '#7B61C4',
        backgroundColor: 'rgba(123, 97, 196, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: scores.map(s => {
          if (s >= 70) return '#4CAF50';
          if (s >= 40) return '#FF9800';
          return '#EF5350';
        }),
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Clarity',
        data: clarityScores,
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.05)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
        pointBackgroundColor: '#38BDF8',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#9E9E9E',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(13, 27, 42, 0.9)',
        titleFont: { family: "'Inter', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label;
            const value = context.parsed.y;
            if (label === 'Sentiment') {
              let mood = 'Neutral';
              if (value >= 70) mood = 'Positive';
              else if (value < 40) mood = 'Concerning';
              return `${label}: ${value}% (${mood})`;
            }
            return `${label}: ${value}/100`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#9E9E9E',
          callback: (value) => `${value}%`,
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: '#9E9E9E',
          maxRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height, position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
