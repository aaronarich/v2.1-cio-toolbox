import React, { useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import DebugConsole from './components/DebugConsole';
import IdentityForm from './components/IdentityForm';
import EventForm from './components/EventForm';
import { loadSdk, identify, track, reset } from './utils/sdk';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isRedacted, setIsRedacted] = useState(false);

  const addLog = (type, message, payload = null, secrets = []) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, type, message, payload, secrets }]);
  };

  const handleConnect = async (apiKey, region, siteId) => {
    try {
      const siteIdMsg = siteId ? ` with Site ID for In-App Messaging` : '';
      const secrets = [apiKey];
      if (siteId) secrets.push(siteId);

      addLog('info', `Initializing SDK with key: ${apiKey} (${region.toUpperCase()})${siteIdMsg}...`, null, secrets);
      await loadSdk(apiKey, region, siteId);
      setIsConnected(true);
      addLog('init', 'SDK initialized successfully' + (siteId ? ' (In-App Messaging enabled)' : ''));
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
    <div className="app-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2rem', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <header>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #68826C, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
          isRedacted={isRedacted}
          onToggleRedaction={setIsRedacted}
        />

        <div style={{ opacity: isConnected ? 1 : 0.5, pointerEvents: isConnected ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <IdentityForm onIdentify={handleIdentify} disabled={!isConnected} />
            <EventForm onTrack={handleTrack} disabled={!isConnected} />
          </div>
        </div>
      </div>

      <div style={{ position: 'sticky', top: '2rem' }}>
        <DebugConsole logs={logs} isRedacted={isRedacted} />
      </div>
    </div>
  );
}

export default App;
