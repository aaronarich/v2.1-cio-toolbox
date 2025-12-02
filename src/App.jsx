import React, { useState, useEffect } from 'react';
import ConfigPanel from './components/ConfigPanel';
import DebugConsole from './components/DebugConsole';
import IdentityForm from './components/IdentityForm';
import EventForm from './components/EventForm';
import { loadSdk, identify, track, reset } from './utils/sdk';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (type, message, payload = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, type, message, payload }]);
  };

  const handleConnect = async (apiKey, region) => {
    try {
      addLog('info', `Initializing SDK with key: ${apiKey} (${region.toUpperCase()})...`);
      await loadSdk(apiKey, region);
      setIsConnected(true);
      addLog('init', 'SDK initialized successfully');
    } catch (error) {
      addLog('error', 'Failed to initialize SDK', error.message);
    }
  };

  const handleDisconnect = () => {
    reset();
    setIsConnected(false);
    addLog('info', 'SDK disconnected and reset');
    // Note: We can't easily unload the script tag, but we can reset the state
    window.location.reload();
  };

  const handleIdentify = (userId, traits) => {
    addLog('action', `Identifying user: ${userId || traits.email}`, { userId, traits });
    identify(userId, traits);
  };

  const handleTrack = (eventName, properties) => {
    addLog('action', `Tracking event: ${eventName}`, properties);
    track(eventName, properties);
  };

  return (
    <div className="app-container" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', height: 'calc(100vh - 4rem)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        <header>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Customer.io Pipelines SDK
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            Test and validate your Customer.io integration in real-time.
          </p>
        </header>

        <ConfigPanel
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          isConnected={isConnected}
        />

        <div style={{ opacity: isConnected ? 1 : 0.5, pointerEvents: isConnected ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <IdentityForm onIdentify={handleIdentify} disabled={!isConnected} />
            <EventForm onTrack={handleTrack} disabled={!isConnected} />
          </div>
        </div>
      </div>

      <div style={{ height: '100%' }}>
        <DebugConsole logs={logs} />
      </div>
    </div>
  );
}

export default App;
