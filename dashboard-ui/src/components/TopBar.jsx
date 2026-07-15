import React from 'react';

export function TopBar({ isConnected, onStartRound }) {
  return (
    <header className="docked full-width top-0 sticky z-50 bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm flex justify-between items-center w-full px-lg py-sm">
      <div className="flex flex-col">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">FedHealth AI</h2>
        <p className="font-mono-label text-mono-label text-on-surface-variant uppercase tracking-widest">Privacy-Preserving Federated Learning</p>
      </div>
      <div className="flex items-center gap-xl">
        <div className="hidden lg:flex items-center gap-3 px-md py-1.5 rounded-full bg-surface-container-highest/40 border border-outline-variant/20">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-secondary pulse-emerald' : 'bg-error'}`}></span>
          <span className={`font-mono-label text-mono-label font-bold ${isConnected ? 'text-secondary' : 'text-error'}`}>
            {isConnected ? 'Aggregator Online' : 'Aggregator Offline'}
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <button className="p-sm text-on-surface-variant hover:bg-surface-bright/10 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">sensors</span>
          </button>
          <button className="p-sm text-on-surface-variant hover:bg-surface-bright/10 rounded-full transition-all cursor-pointer">
            <span className="material-symbols-outlined">security</span>
          </button>
          <button 
            onClick={onStartRound}
            className="ml-sm bg-primary-container text-on-primary-container font-bold px-lg py-sm rounded-lg shadow-lg hover:shadow-primary-container/20 active:scale-95 transition-all cursor-pointer"
          >
            Start Federated Round
          </button>
        </div>
      </div>
    </header>
  );
}
