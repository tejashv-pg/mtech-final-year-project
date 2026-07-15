import React, { useEffect, useState } from 'react';

export function AuditLogsTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('http://13.200.249.7:8000/api/audit-logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSourceConfig = (source, type) => {
    if (source === 'SYS') return { icon: 'settings_system_daydream', color: 'bg-primary text-on-primary', dot: 'bg-primary', ring: 'ring-primary/30' };
    if (source === 'AGG') return { icon: 'hub', color: 'bg-tertiary text-on-tertiary', dot: 'bg-tertiary', ring: 'ring-tertiary/30' };
    if (source.startsWith('NODE')) return { icon: 'local_hospital', color: 'bg-secondary text-on-secondary', dot: 'bg-secondary', ring: 'ring-secondary/30' };
    return { icon: 'info', color: 'bg-surface-variant text-on-surface-variant', dot: 'bg-outline', ring: 'ring-outline/30' };
  };

  const getTypeStyle = (type) => {
    if (type === 'error') return 'text-error font-bold';
    if (type === 'success') return 'text-primary font-bold';
    if (type === 'warning') return 'text-tertiary font-bold';
    return 'text-on-surface';
  };

  return (
    <div className="p-margin flex flex-col gap-gutter max-w-[1200px] mx-auto w-full flex-grow animate-fade-in h-[calc(100vh-120px)]">
      <div className="flex flex-col mb-lg flex-shrink-0">
        <h2 className="font-display-sm text-display-sm text-on-surface font-bold">System Audit Logs</h2>
        <p className="text-on-surface-variant font-body-lg mt-2">Comprehensive timeline of all server events, training lifecycles, and node connections.</p>
      </div>

      <div className="bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/20 rounded-3xl p-xl shadow-xl flex-grow overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[64px] mb-4 opacity-50">history_off</span>
            <p className="font-headline-sm">No audit logs found</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-4">
            <div className="relative border-l-2 border-outline-variant/30 ml-6 space-y-8 pb-8 pt-4">
              {logs.map((log, index) => {
                const config = getSourceConfig(log.source, log.type);
                return (
                  <div key={log.id || index} className="relative pl-10 group hover:translate-x-2 transition-transform duration-300">
                    <div className={`absolute -left-[13px] top-1 w-6 h-6 rounded-full ${config.dot} ring-4 ${config.ring} flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-300`}>
                      <span className="material-symbols-outlined text-[12px] text-white font-bold">{config.icon}</span>
                    </div>
                    
                    <div className="bg-surface-container/50 hover:bg-surface-container-high/80 border border-outline-variant/10 rounded-2xl p-4 shadow-sm transition-colors duration-300 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider ${config.color}`}>
                            {log.source}
                          </span>
                          <span className="font-mono-label text-xs text-on-surface-variant">{log.time}</span>
                        </div>
                        {log.type && (
                           <span className={`text-[10px] uppercase font-bold tracking-widest ${getTypeStyle(log.type)}`}>
                             {log.type}
                           </span>
                        )}
                      </div>
                      <p className={`font-body-md ${getTypeStyle(log.type)}`}>
                        {log.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
