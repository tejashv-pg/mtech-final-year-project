import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

ChartJS.defaults.color = '#8d90a0';
ChartJS.defaults.font.family = 'Inter';

export function LossChart({ lossHistory, currentLoss }) {
  const data = {
    labels: lossHistory.map(h => `Round ${h.round}`),
    datasets: [
      {
        label: 'Global Loss',
        data: lossHistory.map(h => h.value),
        borderColor: '#b4c5ff',
        backgroundColor: 'rgba(180, 197, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return (
    <div className="glass-card p-lg rounded-xl">
      <div className="flex justify-between items-start mb-md">
        <div>
          <p className="font-mono-label text-mono-label text-on-surface-variant">Global Model Loss</p>
          <div className="flex items-end gap-2">
            <h4 className="font-headline-lg text-headline-lg font-bold">{currentLoss ? currentLoss.toFixed(4) : '0.0000'}</h4>
          </div>
        </div>
        <span className="material-symbols-outlined text-primary">trending_down</span>
      </div>
      <div className="h-32 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export function AccuracyChart({ accuracyHistory, currentAccuracy }) {
  const data = useMemo(() => {
    return {
      labels: accuracyHistory.map(h => `Round ${h.round}`),
      datasets: [
        {
          label: 'Accuracy (%)',
          data: accuracyHistory.map(h => h.value),
          borderColor: '#68dba9',
          backgroundColor: 'rgba(104, 219, 169, 0.2)', // simplified gradient
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }
      ]
    };
  }, [accuracyHistory]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } }
  };

  return (
    <div className="glass-card p-lg rounded-xl">
      <div className="flex justify-between items-start mb-md">
        <div>
          <p className="font-mono-label text-mono-label text-on-surface-variant">Model Accuracy</p>
          <div className="flex items-end gap-2">
            <h4 className="font-headline-lg text-headline-lg font-bold">{currentAccuracy ? currentAccuracy.toFixed(1) : '0.0'}%</h4>
          </div>
        </div>
        <span className="material-symbols-outlined text-secondary">trending_up</span>
      </div>
      <div className="h-32 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export function ContributionsChart({ perNodeContributions, currentRound }) {
  const colors = ['#b4c5ff', '#68dba9', '#ddb8ff', '#ffb4ab', '#b4c5ff'];
  
  const data = useMemo(() => {
    const nodes = Object.keys(perNodeContributions);
    // Find all unique rounds across all nodes
    const roundsSet = new Set();
    nodes.forEach(node => {
      perNodeContributions[node].forEach(entry => roundsSet.add(`Round ${entry.round}`));
    });
    const labels = Array.from(roundsSet).sort();
    
    const datasets = nodes.map((node, i) => {
      // Map data to the correct round label
      const dataPoints = labels.map(label => {
        const roundNum = parseInt(label.replace('Round ', ''));
        const entry = perNodeContributions[node].find(e => e.round === roundNum);
        return entry ? entry.value : 0;
      });

      return {
        label: node,
        data: dataPoints,
        borderColor: colors[i % colors.length],
        backgroundColor: colors[i % colors.length],
        fill: false,
        tension: 0.3,
        borderWidth: 2,
      };
    });

    return { labels, datasets };
  }, [perNodeContributions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  const nodes = Object.keys(perNodeContributions);

  return (
    <div className="glass-card p-lg rounded-xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-xl">
        <h4 className="font-headline-md text-headline-md">Hospital Loss Contributions</h4>
        <div className="flex gap-md">
          {nodes.map((node, i) => (
            <div key={node} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></span>
              <span className="font-mono-label text-mono-label">{node}</span>
            </div>
          ))}
          {nodes.length === 0 && (
            <span className="font-mono-label text-on-surface-variant">Waiting for data...</span>
          )}
        </div>
      </div>
      <div className="flex-grow w-full py-md">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
