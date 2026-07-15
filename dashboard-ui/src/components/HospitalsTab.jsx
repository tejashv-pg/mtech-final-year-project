import React from 'react';

export function HospitalsTab({ hospitals }) {
  return (
    <div className="p-margin flex flex-col gap-gutter max-w-[1600px] mx-auto w-full flex-grow">
      <div className="mb-md">
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Connected Hospitals</h2>
        <p className="font-body-md text-on-surface-variant mt-1">Live overview of participating nodes in the federated network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {hospitals.length === 0 ? (
          <div className="col-span-full py-xl text-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-lowest/50">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">signal_disconnected</span>
            <p className="font-headline-sm font-bold text-on-surface-variant">No Hospitals Connected</p>
            <p className="font-body-sm text-outline">Waiting for nodes to join the aggregator server...</p>
          </div>
        ) : (
          hospitals.map((hospital, index) => (
            <div key={hospital.id || index} className="p-md bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col gap-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">local_hospital</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm font-bold text-on-surface">{hospital.name || `Hospital ${hospital.id}`}</h3>
                    <p className="font-mono-label text-xs text-on-surface-variant">ID: {hospital.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary-container/30 border border-secondary/20">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{hospital.status || 'Connected'}</span>
                </div>
              </div>
              
              <div className="mt-sm pt-sm border-t border-outline-variant/10 grid grid-cols-2 gap-2 z-10">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Role</p>
                  <p className="font-body-sm text-on-surface">Training Node</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Protocol</p>
                  <p className="font-body-sm text-on-surface">FedAvg v2.1</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
