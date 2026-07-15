import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://13.200.249.7:8000", { 
  autoConnect: false,
  query: { client_type: 'dashboard' }
});

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);
  const [round, setRound] = useState(0);
  const [loss, setLoss] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [connectedHospitals, setConnectedHospitals] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  
  // Historical data for charts
  const [lossHistory, setLossHistory] = useState([]);
  const [accuracyHistory, setAccuracyHistory] = useState([]);
  
  // Real-time tracking per node
  const [perNodeContributions, setPerNodeContributions] = useState({});
  const [receivedCount, setReceivedCount] = useState(0);
  
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((source, msg, type = 'text-on-surface-variant', sourceColor = 'text-primary') => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const log = { id: Date.now() + Math.random(), time, source, msg, type, sourceColor };
    setLogs(prev => [log, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      addLog('SYS', 'Connected to Aggregator Service', 'text-on-surface-variant', 'text-secondary');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      addLog('SYS', 'Disconnected from Aggregator Service', 'text-error', 'text-error');
    };

    const onNodeCountUpdate = (data) => {
      setNodeCount(data.nodeCount);
      addLog('SYS', `Nodes connected: ${data.nodeCount}`);
    };

    const onHospitalsUpdate = (data) => {
      setConnectedHospitals(data);
    };

    const onWeightReceived = (data) => {
      addLog(`NODE_${data.sid.substring(0,4)}`, `Weights uploaded (loss: ${data.loss.toFixed(4)})`, 'text-on-surface-variant', 'text-tertiary');
      setReceivedCount(data.receivedCount);
      setNodeCount(data.nodeCount);
    };

    const onDashboardUpdate = (data) => {
      setRound(data.round);
      setLoss(data.loss);
      setAccuracy(data.accuracy);
      setReceivedCount(0);
      
      setLossHistory(prev => {
        const next = [...prev, { round: data.round, value: data.loss }];
        return next.slice(-10);
      });
      
      setAccuracyHistory(prev => {
        const next = [...prev, { round: data.round, value: data.accuracy }];
        return next.slice(-10);
      });

      setPerNodeContributions(prev => {
        const next = { ...prev };
        Object.keys(data.perNode).forEach(node => {
          if (!next[node]) next[node] = [];
          next[node].push({ round: data.round, value: data.perNode[node] });
          if (next[node].length > 5) next[node].shift();
        });
        return next;
      });

      setIsTraining(false);
      addLog('AGG', `Round ${data.round} complete. Global model updated.`, 'text-secondary', 'text-secondary');
    };

    const onUpdateGlobalModel = () => {
      setIsTraining(true);
      addLog('AGG', 'Global weights broadcasted to nodes.', 'text-on-surface-variant', 'text-secondary');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('node_count_update', onNodeCountUpdate);
    socket.on('hospitals_update', onHospitalsUpdate);
    socket.on('weight_received', onWeightReceived);
    socket.on('dashboard_update', onDashboardUpdate);
    socket.on('update_global_model', onUpdateGlobalModel);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('node_count_update', onNodeCountUpdate);
      socket.off('hospitals_update', onHospitalsUpdate);
      socket.off('weight_received', onWeightReceived);
      socket.off('dashboard_update', onDashboardUpdate);
      socket.off('update_global_model', onUpdateGlobalModel);
      socket.disconnect();
    };
  }, [addLog]);

  const triggerTraining = async () => {
    addLog('USER', 'Initiated manual training round.', 'text-primary', 'text-primary');
    try {
      await fetch('http://13.200.249.7:8000/start-training', { method: 'POST' });
    } catch (e) {
      addLog('ERROR', 'Failed to trigger training.', 'text-error', 'text-error');
    }
  };

  return {
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
    connectedHospitals,
    isTraining
  };
}
