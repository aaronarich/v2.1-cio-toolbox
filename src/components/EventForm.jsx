import React, { useState } from 'react';

const EventForm = ({ onTrack, disabled }) => {
    const [mode, setMode] = useState('form'); // 'form' | 'json'
    const [jsonInput, setJsonInput] = useState('');
    const [eventName, setEventName] = useState('');
    const [properties, setProperties] = useState([]);

    const addProperty = () => {
        setProperties([...properties, { key: '', value: '' }]);
    };

    const removeProperty = (index) => {
        setProperties(properties.filter((_, i) => i !== index));
    };

    const updateProperty = (index, field, value) => {
        const newProperties = [...properties];
        newProperties[index][field] = value;
        setProperties(newProperties);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'json') {
            try {
                const data = JSON.parse(jsonInput);
                const { name, event, eventName: eName, properties: props, data: propsData, ...rest } = data;

                const finalEventName = name || event || eName;

                if (!finalEventName) {
                    throw new Error('Event name is required (use key "name", "event", or "eventName")');
                }

                // Determine properties: explicit 'properties'/'data' key, or flattened rest
                let finalProps = {};
                if (props) finalProps = props;
                else if (propsData) finalProps = propsData;
                else finalProps = rest;

                onTrack(finalEventName, finalProps);
            } catch (err) {
                alert('Invalid JSON: ' + err.message);
            }
            return;
        }

        const props = {};
        properties.forEach(prop => {
            if (prop.key) props[prop.key] = prop.value;
        });
        onTrack(eventName, props);
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Track Event</h3>
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
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Event Name</label>
                            <input
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="e.g. purchased_item"
                                style={{ width: '100%', boxSizing: 'border-box' }}
                                required
                                disabled={disabled}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)' }}>Event Properties</label>
                                <button type="button" onClick={addProperty} className="btn-secondary" style={{ fontSize: '0.75rem' }} disabled={disabled}>
                                    + Add Property
                                </button>
                            </div>
                            {properties.map((prop, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Key"
                                        value={prop.key}
                                        onChange={(e) => updateProperty(index, 'key', e.target.value)}
                                        style={{ flex: 1 }}
                                        disabled={disabled}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={prop.value}
                                        onChange={(e) => updateProperty(index, 'value', e.target.value)}
                                        style={{ flex: 1 }}
                                        disabled={disabled}
                                    />
                                    <button type="button" onClick={() => removeProperty(index)} className="btn-danger" disabled={disabled}>
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
                                name: "purchased_item",
                                properties: {
                                    item_id: "123",
                                    price: 99.99,
                                    currency: "USD"
                                }
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
                    Send Track Call
                </button>
            </form>
        </div>
    );
};

export default EventForm;
