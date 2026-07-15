import React from 'react';

export function SystemStatus({ isConnected, nodeCount, round, receivedCount }) {
  const isCollecting = receivedCount > 0 && receivedCount < nodeCount;
  const percent = nodeCount > 0 ? Math.round((receivedCount / nodeCount) * 100) : 0;
  const offset = 282.7 - (282.7 * percent / 100);

  return (
    <div className="glass-card p-lg rounded-xl">
      <h4 className="font-headline-md text-headline-md mb-lg">System Status</h4>
      <div className="space-y-md mb-xl">
        <div className="flex justify-between items-center p-md bg-surface-dim rounded-lg border border-outline-variant/10">
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${isConnected ? 'text-secondary' : 'text-error'}`}>
              {isConnected ? 'cloud_done' : 'cloud_off'}
            </span>
            <span className="font-body-sm text-body-sm">Aggregator Service</span>
          </div>
          <span className={`${isConnected ? 'text-secondary' : 'text-error'} font-mono-data text-mono-data uppercase`}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex justify-between items-center p-md bg-surface-dim rounded-lg border border-outline-variant/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">router</span>
            <span className="font-body-sm text-body-sm">Nodes Connected</span>
          </div>
          <span className="text-on-surface font-mono-data text-mono-data">
            {nodeCount} / {nodeCount}
          </span>
        </div>
        <div className="flex justify-between items-center p-md bg-surface-dim rounded-lg border border-outline-variant/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary">slow_motion_video</span>
            <span className="font-body-sm text-body-sm">Training State</span>
          </div>
          <span className="text-tertiary font-mono-data text-mono-data uppercase">
            {isCollecting ? 'Collecting...' : 'Active'}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center py-xl border-t border-outline-variant/10">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle className="text-outline-variant/20" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="4"></circle>
            <circle 
              className="text-primary-container drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
              cx="50" cy="50" fill="transparent" r="45" 
              stroke="currentColor" 
              strokeDasharray="282.7" 
              strokeDashoffset={offset} 
              strokeWidth="6" 
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-headline-lg text-headline-lg">{percent}%</span>
            <span className="font-mono-label text-mono-label text-on-surface-variant uppercase">Current round</span>
          </div>
        </div>
        <div className="mt-md text-center">
          <p className="font-body-lg text-body-lg font-bold">Round {round + (isCollecting ? 1 : 0)} {isCollecting ? 'Collecting...' : 'Idle'}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {isCollecting ? `${receivedCount}/${nodeCount} hospitals responded` : 'Waiting for hospitals...'}
          </p>
        </div>
      </div>
    </div>
  );
}
