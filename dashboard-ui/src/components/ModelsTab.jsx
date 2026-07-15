import React from 'react';

export function ModelsTab({ round = 150, accuracy = 96.8, loss = 0.082, accuracyHistory = [], lossHistory = [] }) {
  const milestones = [];
  if (round > 0) {
    milestones.push({ round: round, version: 'v2.1', acc: accuracy, loss: loss, isCurrent: true });
    
    if (round > 5 && accuracyHistory.length > 2) {
      const idx60 = Math.floor(accuracyHistory.length * 0.6);
      milestones.push({
        round: accuracyHistory[idx60]?.round || Math.floor(round * 0.6),
        version: 'v2.0',
        acc: accuracyHistory[idx60]?.value || accuracy * 0.9,
        loss: lossHistory[idx60]?.value || loss * 1.5,
        isCurrent: false
      });
      
      const idx20 = Math.floor(accuracyHistory.length * 0.2);
      milestones.push({
        round: accuracyHistory[idx20]?.round || Math.floor(round * 0.2),
        version: 'v1.1',
        acc: accuracyHistory[idx20]?.value || accuracy * 0.8,
        loss: lossHistory[idx20]?.value || loss * 2.0,
        isCurrent: false
      });
    } else {
      // Fallback if not enough history
      milestones.push({ round: Math.max(1, round - 1), version: 'v2.0', acc: accuracy * 0.9, loss: loss * 1.5, isCurrent: false });
    }
  } else {
    milestones.push({ round: 0, version: 'v1.0', acc: 0, loss: 0, isCurrent: true });
  }

  return (
    <div className="p-margin flex flex-col gap-gutter max-w-[1600px] mx-auto w-full flex-grow animate-fade-in">
      <div className="mb-md">
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Global Model Details</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Technical specifications and federated configuration for the collaborative AI model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Left Column: Model Architecture */}
        <div className="space-y-gutter flex flex-col">
          {/* Visual Network Graph */}
          <div className="glass-card rounded-xl p-lg flex flex-col border border-outline-variant/20 shadow-sm relative overflow-hidden group">
             {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">account_tree</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Network Architecture</h3>
            </div>
            
            <div className="flex-grow flex items-center py-xl relative z-10 w-full overflow-x-auto custom-scrollbar">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center min-w-max m-auto px-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface-variant mb-2">
                    <span className="material-symbols-outlined text-[32px]">image</span>
                  </div>
                  <span className="font-mono-label text-mono-label text-on-surface-variant">Input<br/>(224x224x3)</span>
                </div>
                
                <span className="material-symbols-outlined text-primary/50 rotate-90 md:rotate-0">arrow_forward</span>
                
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 rounded-xl bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined text-[32px]">layers</span>
                  </div>
                  <span className="font-mono-label text-mono-label text-primary">Conv2D<br/>Blocks</span>
                </div>

                <span className="material-symbols-outlined text-primary/50 rotate-90 md:rotate-0">arrow_forward</span>
                
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface-variant mb-2">
                    <span className="material-symbols-outlined text-[32px]">compress</span>
                  </div>
                  <span className="font-mono-label text-mono-label text-on-surface-variant">Pooling<br/>Layers</span>
                </div>

                <span className="material-symbols-outlined text-primary/50 rotate-90 md:rotate-0">arrow_forward</span>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl bg-secondary-container/20 border border-secondary-fixed-dim/30 flex items-center justify-center text-secondary-fixed-dim mb-2">
                    <span className="material-symbols-outlined text-[32px]">scatter_plot</span>
                  </div>
                  <span className="font-mono-label text-mono-label text-secondary-fixed-dim">Dense<br/>(1024)</span>
                </div>
                
                <span className="material-symbols-outlined text-primary/50 rotate-90 md:rotate-0">arrow_forward</span>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface-variant mb-2">
                    <span className="material-symbols-outlined text-[32px]">output</span>
                  </div>
                  <span className="font-mono-label text-mono-label text-on-surface-variant">Output<br/>(3 Classes)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
            <div className="glass-card rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <span className="material-symbols-outlined text-primary mb-2 text-[28px]">memory</span>
              <p className="font-mono-label text-mono-label text-on-surface-variant mb-1">BASE ARCHITECTURE</p>
              <p className="font-headline-md text-headline-md font-bold text-on-surface">ResNet-50</p>
            </div>
            <div className="glass-card rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <span className="material-symbols-outlined text-secondary-fixed-dim mb-2 text-[28px]">timeline</span>
              <p className="font-mono-label text-mono-label text-on-surface-variant mb-1">TOTAL PARAMETERS</p>
              <p className="font-headline-md text-headline-md font-bold text-on-surface">23.5M</p>
            </div>
            <div className="glass-card rounded-xl p-md border border-outline-variant/20 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <span className="material-symbols-outlined text-tertiary-fixed-dim mb-2 text-[28px]">sd_card</span>
              <p className="font-mono-label text-mono-label text-on-surface-variant mb-1">MODEL SIZE</p>
              <p className="font-headline-md text-headline-md font-bold text-on-surface">94 MB</p>
            </div>
          </div>

          {/* Hyperparameters */}
          <div className="glass-card rounded-xl p-lg border border-outline-variant/20 shadow-sm relative overflow-hidden group flex-shrink-0 min-h-[220px] flex flex-col justify-between">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-tl-full pointer-events-none group-hover:bg-secondary/10 transition-colors duration-500"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary-fixed-dim shrink-0">
                <span className="material-symbols-outlined">tune</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Hyperparameter Configuration</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-surface-container/50 rounded-lg p-4 border border-outline-variant/10">
                <p className="font-mono-label text-[11px] text-on-surface-variant mb-1 uppercase tracking-wider">Learning Rate</p>
                <p className="font-body-lg text-lg font-bold text-on-surface font-mono-data">0.001</p>
              </div>
              <div className="bg-surface-container/50 rounded-lg p-4 border border-outline-variant/10">
                <p className="font-mono-label text-[11px] text-on-surface-variant mb-1 uppercase tracking-wider">Optimizer</p>
                <p className="font-body-lg text-lg font-bold text-on-surface font-mono-data">Adam</p>
              </div>
              <div className="bg-surface-container/50 rounded-lg p-4 border border-outline-variant/10">
                <p className="font-mono-label text-[11px] text-on-surface-variant mb-1 uppercase tracking-wider">Local Epochs</p>
                <p className="font-body-lg text-lg font-bold text-on-surface font-mono-data">5</p>
              </div>
              <div className="bg-surface-container/50 rounded-lg p-4 border border-outline-variant/10">
                <p className="font-mono-label text-[11px] text-on-surface-variant mb-1 uppercase tracking-wider">Batch Size</p>
                <p className="font-body-lg text-lg font-bold text-on-surface font-mono-data">32</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Aggregation & Security */}
        <div className="space-y-gutter flex flex-col">
          {/* Protocol & Security */}
          <div className="glass-card rounded-xl p-lg border border-outline-variant/20 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-bl-full pointer-events-none group-hover:bg-tertiary/10 transition-colors duration-500"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary-fixed-dim">
                <span className="material-symbols-outlined">security</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Aggregation & Security</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center p-sm bg-surface-container/50 rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">hub</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Protocol</span>
                </div>
                <span className="font-body-lg text-body-lg font-bold text-on-surface">FedAvg (Federated Averaging)</span>
              </div>
              
              <div className="flex justify-between items-center p-sm bg-surface-container/50 rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary-fixed-dim">lock</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim pulse-emerald"></span>
                  <span className="font-body-sm text-body-sm font-bold text-secondary-fixed-dim">Secure Multi-Party Computation</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-sm bg-surface-container/50 rounded-lg border border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim">blur_on</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Differential Privacy</span>
                </div>
                <span className="font-body-sm text-body-sm font-bold text-on-surface px-2 py-1 bg-tertiary-container/20 text-tertiary-fixed-dim rounded-md">ε = 0.5 (Active)</span>
              </div>
            </div>
          </div>

          {/* Version History */}
          <div className="glass-card rounded-xl p-lg border border-outline-variant/20 shadow-sm flex-grow relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">update</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Version History</h3>
            </div>

            <div className="relative border-l-2 border-outline-variant/30 ml-4 space-y-6 mt-4 z-10">
              {milestones.map((m, i) => (
                <div key={`${m.round}-${i}`} className={`relative pl-6 ${!m.isCurrent ? (i === 1 ? 'opacity-70' : 'opacity-50') : ''}`}>
                  <div className={`absolute w-4 h-4 rounded-full ${m.isCurrent ? 'bg-primary' : 'bg-outline-variant'} -left-[9px] top-1 border-4 border-surface-container-low`}></div>
                  <p className={`font-mono-label text-mono-label ${m.isCurrent ? 'text-primary' : 'text-on-surface-variant'} mb-1 uppercase tracking-wider`}>
                    ROUND {m.round} {m.isCurrent ? '(CURRENT)' : ''}
                  </p>
                  <p className="font-body-lg text-body-lg font-bold text-on-surface">Global Model {m.version}</p>
                  <div className="flex gap-4 mt-2">
                     <div className="text-sm"><span className="text-on-surface-variant">Acc:</span> <span className="text-secondary-fixed-dim font-bold">{Number(m.acc).toFixed(1)}%</span></div>
                     <div className="text-sm"><span className="text-on-surface-variant">Loss:</span> <span className="text-error font-bold">{Number(m.loss).toFixed(3)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
