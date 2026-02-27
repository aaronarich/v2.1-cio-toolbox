import React, { useMemo, useState } from 'react';
import TopNav from '../components/TopNav';
import '../App.css';

const prettyJson = (value) => JSON.stringify(value, null, 2);

function WebhookDataTest() {
  const [keyName, setKeyName] = useState('test-user');
  const [payloadText, setPayloadText] = useState(prettyJson({
    first_name: 'Taylor',
    favorite_plan: 'Pro',
    renewal_date: '2026-03-15',
  }));
  const [status, setStatus] = useState('');
  const [loadedData, setLoadedData] = useState(null);
  const [storedKeys, setStoredKeys] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  const webhookUrl = useMemo(() => {
    if (!keyName.trim()) return '';
    return `${window.location.origin}/api/webhook-test-data/${encodeURIComponent(keyName.trim())}`;
  }, [keyName]);

  const fetchKeys = async () => {
    const response = await fetch('/api/webhook-test-data');
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to load saved keys');
    }
    setStoredKeys(result.keys || []);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus('');
    setIsBusy(true);

    try {
      const parsedPayload = JSON.parse(payloadText);
      const response = await fetch('/api/webhook-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: keyName.trim(),
          data: parsedPayload,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Save failed');
      }
      setStatus(`Saved key "${result.key}"`);
      await fetchKeys();
    } catch (error) {
      setStatus(error.message || 'Failed to save');
    } finally {
      setIsBusy(false);
    }
  };

  const handleLoad = async (overrideKey) => {
    const requestedKey = (overrideKey || keyName).trim();
    if (!requestedKey) {
      setStatus('Enter a key before loading');
      return;
    }

    setStatus('');
    setIsBusy(true);
    try {
      const response = await fetch(`/api/webhook-test-data/${encodeURIComponent(requestedKey)}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Load failed');
      }
      setLoadedData(result);
      setStatus(`Loaded key "${result.key}"`);
    } catch (error) {
      setLoadedData(null);
      setStatus(error.message || 'Failed to load');
    } finally {
      setIsBusy(false);
    }
  };

  React.useEffect(() => {
    fetchKeys().catch(() => {
      setStatus('Could not load saved keys');
    });
  }, []);

  return (
    <div className="app-container">
      <TopNav />

      <header className="page-header">
        <div>
          <h1 className="page-title">Webhook Data Test</h1>
          <p className="page-subtitle">
            Save test payloads and retrieve them with a GET webhook from Customer.io.
          </p>
        </div>
      </header>

      <div className="main-grid">
        <div className="config-column">
          <form className="card webhook-form" onSubmit={handleSave}>
            <h2 className="utm-card-title">Test Data Entry</h2>

            <label htmlFor="keyName">Data key</label>
            <input
              id="keyName"
              type="text"
              value={keyName}
              onChange={(event) => setKeyName(event.target.value)}
              placeholder="example-user-123"
              required
            />

            <label htmlFor="payloadText">JSON payload</label>
            <textarea
              id="payloadText"
              value={payloadText}
              onChange={(event) => setPayloadText(event.target.value)}
              rows={10}
              required
            />

            <div className="utm-control-row">
              <button type="submit" className="btn-primary" disabled={isBusy}>
                Save payload
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={isBusy}
                onClick={() => handleLoad()}
              >
                Load by key
              </button>
            </div>

            {status && <p className="webhook-status">{status}</p>}
          </form>

          <div className="card">
            <h2 className="utm-card-title">Webhook URL (GET)</h2>
            <p className="utm-helper-text">
              Use this endpoint in your Customer.io GET webhook to fetch the saved JSON payload.
            </p>
            <pre className="utm-code-block">{webhookUrl || 'Enter a key to generate URL'}</pre>
          </div>
        </div>

        <div className="debug-column">
          <div className="card utm-log-card">
            <div className="utm-row-header">
              <h2 className="utm-card-title">Saved Keys</h2>
              <span className="utm-log-count">{storedKeys.length} keys</span>
            </div>
            <div className="webhook-key-list">
              {storedKeys.length === 0 && <div className="utm-log-empty">No saved keys yet.</div>}
              {storedKeys.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="webhook-key-item"
                  onClick={() => {
                    setKeyName(item.key);
                    handleLoad(item.key);
                  }}
                >
                  <span>{item.key}</span>
                  <span className="utm-log-timestamp">{new Date(item.updatedAt).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="utm-card-title">Loaded Response</h2>
            <pre className="utm-code-block">
              {loadedData ? prettyJson(loadedData) : 'Load a key to see API response.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebhookDataTest;
