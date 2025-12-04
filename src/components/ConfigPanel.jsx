import React, { useState } from 'react';

const ConfigPanel = ({ onConnect, onDisconnect, isConnected }) => {
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

    return (
        <div className="card">
            <h2>Configuration</h2>
            <form onSubmit={handleConnect} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            API Key (Write Key)
                        </label>
                        <input
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Write Key"
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            disabled={isConnected}
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
                        value={siteId}
                        onChange={(e) => setSiteId(e.target.value)}
                        placeholder="Enter your Site ID (optional)"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        disabled={isConnected}
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
