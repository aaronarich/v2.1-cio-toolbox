import React, { useState } from 'react';

const ConfigPanel = ({ onConnect, onDisconnect, isConnected, isRedacted, onToggleRedaction }) => {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('cio_api_key') || '');
    const [region, setRegion] = useState(() => localStorage.getItem('cio_region') || 'us');
    const [siteId, setSiteId] = useState(() => localStorage.getItem('cio_site_id') || '');

    const handleConnect = (e) => {
        e.preventDefault();
        if (apiKey) {
            localStorage.setItem('cio_api_key', apiKey);
            localStorage.setItem('cio_region', region);
            if (siteId) localStorage.setItem('cio_site_id', siteId);
            onConnect(apiKey, region, siteId);
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('cio_api_key');
        localStorage.removeItem('cio_region');
        localStorage.removeItem('cio_site_id');
        setApiKey('');
        setRegion('us');
        setSiteId('');
        onDisconnect();
    };

    const getDisplayValue = (value) => {
        if (!isRedacted || !value) return value;
        return `${value.substring(0, 5)}...`;
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0 }}>Configuration</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input
                        type="checkbox"
                        checked={isRedacted}
                        onChange={(e) => onToggleRedaction(e.target.checked)}
                    />
                    Redact Keys
                </label>
            </div>
            <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            API Key (Write Key)
                        </label>
                        <input
                            type="text"
                            value={getDisplayValue(apiKey)}
                            onChange={(e) => !isRedacted && setApiKey(e.target.value)}
                            placeholder="Enter your Write Key"
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            disabled={isConnected}
                            readOnly={isRedacted}
                        />
                    </div>
                    <div style={{ width: '120px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Region
                        </label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            disabled={isConnected}
                        >
                            <option value="us">US</option>
                            <option value="eu">EU</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Site ID (Optional - for In-App Messaging)
                    </label>
                    <input
                        type="text"
                        value={getDisplayValue(siteId)}
                        onChange={(e) => !isRedacted && setSiteId(e.target.value)}
                        placeholder="Enter your Site ID (optional)"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        disabled={isConnected}
                        readOnly={isRedacted}
                    />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {!isConnected ? (
                        <button type="submit" className="btn-primary">
                            Connect SDK
                        </button>
                    ) : (
                        <button type="button" onClick={handleDisconnect} className="btn-danger">
                            Disconnect & Clear
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ConfigPanel;
