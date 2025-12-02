import React, { useState, useEffect } from 'react';

const ConfigPanel = ({ onConnect, onDisconnect, isConnected }) => {
    const [apiKey, setApiKey] = useState('');
    const [region, setRegion] = useState('us');

    useEffect(() => {
        const storedKey = localStorage.getItem('cio_api_key');
        const storedRegion = localStorage.getItem('cio_region');
        if (storedKey) setApiKey(storedKey);
        if (storedRegion) setRegion(storedRegion);
    }, []);

    const handleConnect = (e) => {
        e.preventDefault();
        if (apiKey) {
            localStorage.setItem('cio_api_key', apiKey);
            localStorage.setItem('cio_region', region);
            onConnect(apiKey, region);
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem('cio_api_key');
        localStorage.removeItem('cio_region');
        setApiKey('');
        setRegion('us');
        onDisconnect();
    };

    return (
        <div className="card">
            <h2>Configuration</h2>
            <form onSubmit={handleConnect} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
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
                {!isConnected ? (
                    <button type="submit" className="btn-primary">
                        Connect SDK
                    </button>
                ) : (
                    <button type="button" onClick={handleDisconnect} className="btn-danger">
                        Disconnect & Clear
                    </button>
                )}
            </form>
        </div>
    );
};

export default ConfigPanel;
