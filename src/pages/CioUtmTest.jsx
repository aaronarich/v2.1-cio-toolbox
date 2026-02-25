import React, { useState } from 'react';
import TopNav from '../components/TopNav';
import {
  clearPersistedUtms,
  clearPersistedUtmsCookie,
  clearPersistedUtmsFromLocalStorage,
  getUtmDebugState,
} from '../utils/sdk';
import '../App.css';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function CioUtmTest() {
  const [, setRefreshKey] = useState(0);
  const {
    utmData,
    hasUtms,
    localStorageUtms,
    cookieUtms,
    pagePayload,
  } = getUtmDebugState();
  const currentUrl = window.location.href;

  const timestamp = new Date().toLocaleTimeString();
  const logs = [
    { timestamp, level: 'info', message: `_cio.page("UTM Persistence Test", ${JSON.stringify(pagePayload)})` },
    {
      timestamp,
      level: 'info',
      message: hasUtms
        ? '[cio-utm-persist] Campaign visitor — UTM data attached'
        : '[cio-utm-persist] Organic visitor — no UTM data attached',
    },
  ];
  const refreshView = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="app-container">
      <TopNav />

      <header className="page-header">
        <div>
          <h1 className="page-title">UTM Persistence Test</h1>
          <p className="page-subtitle">
            Validate anonymous in-app message triggering via persisted UTM parameters.
          </p>
        </div>
      </header>

      <div className="main-grid">
        <div className="config-column">
          <div className="card">
            <div className="utm-row-header">
              <h2 className="utm-card-title">Visitor Type</h2>
              <div className={`utm-status ${hasUtms ? 'campaign' : 'organic'}`}>
                {hasUtms ? 'Campaign Visitor' : 'Organic Visitor'}
              </div>
            </div>
            <div className="utm-url-display">{currentUrl}</div>
          </div>

          <div className="card">
            <h2 className="utm-card-title">Stored UTM Values (Persisted)</h2>
            <table className="utm-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {UTM_KEYS.map((key) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td className="utm-value-cell">{utmData[key] || <span className="utm-empty">not set</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 className="utm-card-title">_cio.page() Payload</h2>
            <p className="utm-helper-text">Data that would be sent to Customer.io on this page view:</p>
            <pre className="utm-code-block">{JSON.stringify(pagePayload, null, 2)}</pre>
          </div>

          <div className="card">
            <h2 className="utm-card-title">Test Navigation</h2>
            <p className="utm-helper-text">
              Click these to simulate navigating. UTM data should persist even without query params.
            </p>
            <div className="utm-link-row">
              <a href="?">No UTMs</a>
              <a href="?utm_campaign=aaron_anon_persist">With test UTM</a>
              <a href="?utm_source=google&utm_medium=cpc&utm_campaign=aaron_anon_persist">Full UTM set</a>
            </div>
          </div>

          <div className="card">
            <h2 className="utm-card-title">Storage Controls</h2>
            <p className="utm-helper-text">
              Clear persisted UTM state from localStorage and/or cookie.
            </p>
            <div className="utm-control-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  clearPersistedUtmsFromLocalStorage();
                  refreshView();
                }}
              >
                Clear localStorage
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  clearPersistedUtmsCookie();
                  refreshView();
                }}
              >
                Clear cookie
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  clearPersistedUtms();
                  refreshView();
                }}
              >
                Clear both
              </button>
            </div>
            <div className="utm-storage-panels">
              <div>
                <h3 className="utm-storage-title">localStorage</h3>
                <pre className="utm-code-block">{JSON.stringify(localStorageUtms, null, 2)}</pre>
              </div>
              <div>
                <h3 className="utm-storage-title">Cookie</h3>
                <pre className="utm-code-block">{JSON.stringify(cookieUtms, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        <div className="debug-column">
          <div className="card utm-log-card">
            <div className="utm-row-header">
              <h2 className="utm-card-title">Script Log</h2>
              <span className="utm-log-count">{logs.length} events</span>
            </div>
            <div className="utm-log-body">
              {logs.length === 0 && <div className="utm-log-empty">Waiting for events...</div>}
              {logs.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className="utm-log-entry">
                  <div className="utm-log-heading">
                    <span className="utm-log-timestamp">[{entry.timestamp}]</span>
                    <span className="utm-log-level">{entry.level.toUpperCase()}</span>
                  </div>
                  <div className="utm-log-message">{entry.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CioUtmTest;
