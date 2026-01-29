import React, { useState } from 'react';

const IdentityForm = ({ onIdentify, disabled }) => {
    const [mode, setMode] = useState('form'); // 'form' | 'json'
    const [jsonInput, setJsonInput] = useState('');
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [attributes, setAttributes] = useState([]);
    const [contextAttributes, setContextAttributes] = useState([]);

    const addAttribute = () => {
        setAttributes([...attributes, { key: '', value: '' }]);
    };

    const removeAttribute = (index) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    const updateAttribute = (index, field, value) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const addContextAttribute = () => {
        setContextAttributes([...contextAttributes, { key: '', value: '' }]);
    };

    const removeContextAttribute = (index) => {
        setContextAttributes(contextAttributes.filter((_, i) => i !== index));
    };

    const updateContextAttribute = (index, field, value) => {
        const newAttributes = [...contextAttributes];
        newAttributes[index][field] = value;
        setContextAttributes(newAttributes);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (mode === 'json') {
            try {
                const data = JSON.parse(jsonInput);
                // Extract common ID fields
                const { id, userId: uid, context, ...rest } = data;
                const finalId = id || uid;
                
                // Everything else goes into traits
                onIdentify(finalId, rest, context ? { context } : undefined);
            } catch (err) {
                alert('Invalid JSON: ' + err.message);
            }
            return;
        }

        const traits = {};
        if (email) traits.email = email;
        attributes.forEach(attr => {
            if (attr.key) traits[attr.key] = attr.value;
        });

        const context = {};
        contextAttributes.forEach(attr => {
            if (attr.key) context[attr.key] = attr.value;
        });

        onIdentify(userId, traits, Object.keys(context).length > 0 ? { context } : undefined);
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Identify User</h3>
                <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => setMode('form')}
                        className={mode === 'form' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', border: 'none' }}
                        disabled={disabled}
                    >
                        Form
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('json')}
                        className={mode === 'json' ? 'btn-primary' : 'btn-secondary'}
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', border: 'none' }}
                        disabled={disabled}
                    >
                        JSON
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {mode === 'form' ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>User ID</label>
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="e.g. 12345"
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                    disabled={disabled}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                    disabled={disabled}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>Custom Attributes</label>
                                <button type="button" onClick={addAttribute} className="btn-secondary" style={{ fontSize: '0.75rem' }} disabled={disabled}>
                                    + Add Attribute
                                </button>
                            </div>
                            {attributes.map((attr, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Key"
                                        value={attr.key}
                                        onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                                        style={{ flex: 1 }}
                                        disabled={disabled}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={attr.value}
                                        onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                                        style={{ flex: 1 }}
                                        disabled={disabled}
                                    />
                                    <button type="button" onClick={() => removeAttribute(index)} className="btn-danger" disabled={disabled}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>Custom Context</label>
                                <button type="button" onClick={addContextAttribute} className="btn-secondary" style={{ fontSize: '0.75rem' }} disabled={disabled}>
                                    + Add Context
                                </button>
                            </div>
                            {contextAttributes.map((attr, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Context Key"
                                        value={attr.key}
                                        onChange={(e) => updateContextAttribute(index, 'key', e.target.value)}
                                        style={{ flex: 1 }}
                                        disabled={disabled}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Context Value"
                                        value={attr.value}
                                        onChange={(e) => updateContextAttribute(index, 'value', e.target.value)}
                                        style={{ flex: 1 }}
                                        disabled={disabled}
                                    />
                                    <button type="button" onClick={() => removeContextAttribute(index)} className="btn-danger" disabled={disabled}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ marginBottom: '1rem' }}>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder={JSON.stringify({
                                id: "user_123",
                                email: "user@example.com",
                                first_name: "Jane",
                                last_name: "Doe",
                                plan: "premium"
                            }, null, 2)}
                            style={{
                                width: '100%',
                                height: '200px',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                boxSizing: 'border-box',
                                resize: 'vertical',
                                background: 'rgba(15, 23, 42, 0.5)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.5rem',
                                padding: '1rem'
                            }}
                            disabled={disabled}
                        />
                    </div>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={disabled}>
                    Send Identify Call
                </button>
            </form>
        </div>
    );
};

export default IdentityForm;
