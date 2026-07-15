import React from 'react';

export function ActivityLog({ logs }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[400px]">
      <div className="px-lg py-md border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/20">
        <h4 className="font-headline-md text-headline-md">Activity Log</h4>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">terminal</span>
      </div>
      <div className="flex-grow p-md font-mono-data text-mono-data space-y-2 overflow-y-auto custom-scrollbar bg-black/20">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 animate-pulse">
            <span className="text-outline">[{log.time}]</span>
            <span className={log.sourceColor}>[{log.source}]</span>
            <span className={log.type}>{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
