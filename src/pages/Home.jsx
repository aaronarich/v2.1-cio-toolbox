import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfigPanel from '../components/ConfigPanel';
import DebugConsole from '../components/DebugConsole';
import IdentityForm from '../components/IdentityForm';
import EventForm from '../components/EventForm';
import { loadSdk, identify, track, reset } from '../utils/sdk';
import '../App.css';

function Home() {
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

  const handleIdentify = (userId, traits, options) => {
    addLog('action', `Identifying user: ${userId || traits.email}`, { userId, traits, options });
    identify(userId, traits, options);
  };

  const handleTrack = (eventName, properties) => {
    addLog('action', `Tracking event: ${eventName}`, properties);
    track(eventName, properties);
  };

  return (
    <div className="app-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">
            Customer.io Pipelines SDK
          </h1>
          <p className="page-subtitle">
            Test and validate your Customer.io integration in real-time.
          </p>
        </div>
        <nav className="page-header-actions">
          <Link to="/hello-world" className="btn-primary page-link-button">
            Go to Hello World
          </Link>
        </nav>
      </header>

      <div className="main-grid">
        <div className="config-column">
          <ConfigPanel
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
            isRedacted={isRedacted}
            onToggleRedaction={setIsRedacted}
          />

          <div
            className={`sdk-actions-panel${isConnected ? '' : ' sdk-actions-panel-disabled'}`}
          >
            <div className="sdk-actions-stack">
              <IdentityForm onIdentify={handleIdentify} disabled={!isConnected} />
              <EventForm onTrack={handleTrack} disabled={!isConnected} />
            </div>
          </div>
        </div>

        <div className="debug-column">
          <DebugConsole logs={logs} isRedacted={isRedacted} />
        </div>
      </div>
    </div>
  );
}

export default Home;
