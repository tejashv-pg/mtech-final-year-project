import React from 'react';

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low backdrop-blur-xl border-r border-outline-variant/20 shadow-lg fixed left-0 top-0 z-[60] p-md space-y-base_unit">
      <div className="mb-xl px-sm">
        <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">FedHealth AI</h1>
        <p className="font-mono-label text-mono-label text-on-surface-variant mt-1">v1.0.4 Aggregator</p>
      </div>
      <nav className="flex-grow space-y-1">
        <a className="flex items-center gap-3 px-md py-sm bg-secondary-container/20 text-secondary-fixed-dim font-bold rounded-lg transition-all" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-body-sm text-body-sm">Dashboard</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 rounded-lg transition-all group" href="#">
          <span className="material-symbols-outlined group-hover:translate-x-1 duration-300">hub</span>
          <span className="font-body-sm text-body-sm">Models</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 rounded-lg transition-all group" href="#">
          <span className="material-symbols-outlined group-hover:translate-x-1 duration-300">local_hospital</span>
          <span className="font-body-sm text-body-sm">Hospitals</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 rounded-lg transition-all group" href="#">
          <span className="material-symbols-outlined group-hover:translate-x-1 duration-300">verified_user</span>
          <span className="font-body-sm text-body-sm">Security</span>
        </a>
      </nav>
      <div className="mt-auto pt-md border-t border-outline-variant/10 space-y-1">
        <div className="flex items-center gap-3 p-sm mb-md rounded-xl bg-surface-container-high/30">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">DS</div>
          <div>
            <p className="font-body-sm text-body-sm font-bold text-on-surface">Dr. Sterling</p>
            <p className="font-mono-label text-[10px] text-on-surface-variant">Protocol Admin</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-sm bg-primary text-on-primary font-bold rounded-lg cursor-pointer active:scale-95 duration-200">
          <span className="material-symbols-outlined text-[18px]">history_edu</span>
          <span className="text-body-sm">View Audit Logs</span>
        </button>
        <a className="flex items-center gap-3 px-md py-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-sm text-body-sm">Settings</span>
        </a>
        <a className="flex items-center gap-3 px-md py-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined">help</span>
          <span className="font-body-sm text-body-sm">Support</span>
        </a>
      </div>
    </aside>
  );
}
