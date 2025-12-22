import React, { useEffect, useRef } from 'react';

const DebugConsole = ({ logs, isRedacted }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const redactText = (text, secrets) => {
        if (!text || !secrets || !secrets.length || !isRedacted) return text;
        let redactedText = text;
        secrets.forEach(secret => {
            if (secret && secret.length > 5) {
                // Determine visible part (first 5 chars)
                const visible = secret.substring(0, 5);
                // Create regex to replace exact matches of the secret
                // We escape the secret to ensure special chars don't break regex
                const escapedSecret = secret.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapedSecret, 'g');
                redactedText = redactedText.replace(regex, `${visible}...`);
            }
        });
        return redactedText;
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Debug Console</h2>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {logs.length} events
                </span>
            </div>
            <div style={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: '600px',
                background: 'rgba(15, 23, 42, 0.3)',
                borderRadius: '0.5rem',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                border: '1px solid var(--border-color)'
            }}>
                {logs.length === 0 && (
                    <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                        Waiting for events...
                    </div>
                )}
                {logs.map((log, index) => (
                    <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>[{log.timestamp}]</span>
                            <span style={{
                                color: log.type === 'error' ? 'var(--error-color)' :
                                    log.type === 'init' ? 'var(--success-color)' :
                                        'var(--accent-color)',
                                fontWeight: 'bold'
                            }}>
                                {log.type.toUpperCase()}
                            </span>
                        </div>
                        <div style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                            {redactText(log.message, log.secrets)}
                        </div>
                        {log.payload && (
                            <pre style={{
                                margin: '0.5rem 0 0 0',
                                color: 'var(--text-secondary)',
                                fontSize: '0.75rem',
                                overflowX: 'auto'
                            }}>
                                {redactText(JSON.stringify(log.payload, null, 2), log.secrets)}
                            </pre>
                        )}
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
};

export default DebugConsole;
