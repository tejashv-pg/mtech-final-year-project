import React from 'react';
import { useSocket } from './hooks/useSocket';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StatCards } from './components/StatCards';
import { SystemStatus } from './components/SystemStatus';
import { ActivityLog } from './components/ActivityLog';
import { LossChart, AccuracyChart, ContributionsChart } from './components/Charts';
import { HospitalsTab } from './components/HospitalsTab';
import './index.css';

function App() {
  const {
    isConnected,
    nodeCount,
    round,
    loss,
    accuracy,
    lossHistory,
    accuracyHistory,
    perNodeContributions,
    receivedCount,
    logs,
    triggerTraining,
    connectedHospitals
  } = useSocket();

  const [activeTab, setActiveTab] = React.useState('dashboard');

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow md:ml-64 flex flex-col min-h-screen">
        <TopBar isConnected={isConnected} onStartRound={triggerTraining} />
        
        {activeTab === 'dashboard' ? (
          <div className="p-margin flex flex-col gap-gutter max-w-[1600px] mx-auto w-full flex-grow">
            <StatCards nodeCount={nodeCount} round={round} />
            
            <div className="grid grid-cols-12 gap-gutter">
              <div className="col-span-12 lg:col-span-8 space-y-gutter flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <LossChart lossHistory={lossHistory} currentLoss={loss} />
                  <AccuracyChart accuracyHistory={accuracyHistory} currentAccuracy={accuracy} />
                </div>
                <div className="flex-grow min-h-[400px]">
                  <ContributionsChart perNodeContributions={perNodeContributions} currentRound={round} />
                </div>
              </div>
              
              <div className="col-span-12 lg:col-span-4 space-y-gutter">
                <SystemStatus isConnected={isConnected} nodeCount={nodeCount} round={round} receivedCount={receivedCount} />
                <ActivityLog logs={logs} />
              </div>
            </div>
          </div>
        ) : activeTab === 'hospitals' ? (
          <HospitalsTab hospitals={connectedHospitals} />
        ) : (
          <div className="p-margin flex flex-col items-center justify-center flex-grow text-on-surface-variant font-headline-md">
            View under construction...
          </div>
        )}

        <footer className="full-width py-xl mt-auto bg-surface-container-lowest border-t border-outline-variant/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-7xl mx-auto px-margin items-center">
            <div className="text-center md:text-left">
              <p className="font-headline-md text-headline-md font-bold text-on-surface mb-2">FedHealth AI</p>
              <p className="font-mono-label text-mono-label text-on-surface-variant">© 2024 FedHealth AI. HIPAA Compliant Federated Protocol.</p>
            </div>
            <div className="flex justify-center gap-xl">
              <a className="font-mono-label text-mono-label text-on-surface-variant hover:text-primary transition-colors underline-offset-4" href="#">Platform Info</a>
              <a className="font-mono-label text-mono-label text-on-surface-variant hover:text-primary transition-colors underline-offset-4" href="#">Protocol Details</a>
              <a className="font-mono-label text-mono-label text-on-surface-variant hover:text-primary transition-colors underline-offset-4" href="#">Security &amp; Encryption</a>
            </div>
            <div className="text-center md:text-right space-y-1">
              <div className="flex items-center justify-center md:justify-end gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="font-mono-label text-mono-label">FedAvg Protocol v2.1</span>
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span className="font-mono-label text-mono-label">TLS 1.3 / AES-256-GCM</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Decorative Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>
    </>
  );
}

export default App;
