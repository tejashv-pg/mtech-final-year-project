import React from 'react';

export function StatCards({ nodeCount, round }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      <div className="glass-card p-lg rounded-xl flex items-center gap-md">
        <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[32px]">local_hospital</span>
        </div>
        <div>
          <p className="font-mono-label text-mono-label text-on-surface-variant">Hospitals</p>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{nodeCount}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Active nodes</p>
        </div>
      </div>
      <div className="glass-card p-lg rounded-xl flex items-center gap-md">
        <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
          <span className="material-symbols-outlined text-[32px]">history</span>
        </div>
        <div>
          <p className="font-mono-label text-mono-label text-on-surface-variant">Rounds</p>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{round}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Training cycles</p>
        </div>
      </div>
      <div className="glass-card p-lg rounded-xl flex items-center gap-md">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[32px]">groups</span>
        </div>
        <div>
          <p className="font-mono-label text-mono-label text-on-surface-variant">Patients</p>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">~{nodeCount * 303}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Across all nodes</p>
        </div>
      </div>
      <div className="glass-card p-lg rounded-xl flex items-center gap-md">
        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[32px]">security</span>
        </div>
        <div>
          <p className="font-mono-label text-mono-label text-on-surface-variant">Privacy</p>
          <h3 className="font-headline-md text-headline-md font-bold text-secondary">SECURED</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">End-to-end encrypted</p>
        </div>
      </div>
    </div>
  );
}
