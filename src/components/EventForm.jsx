import React, { useState } from 'react';

const EventForm = ({ onTrack, disabled }) => {
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
        const props = {};
        properties.forEach(prop => {
            if (prop.key) props[prop.key] = prop.value;
        });
        onTrack(eventName, props);
    };

    return (
        <div className="card">
            <h3>Track Event</h3>
            <form onSubmit={handleSubmit}>
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

                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={disabled}>
                    Send Track Call
                </button>
            </form>
        </div>
    );
};

export default EventForm;
