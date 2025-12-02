import React, { useState } from 'react';

const IdentityForm = ({ onIdentify, disabled }) => {
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState('');
    const [attributes, setAttributes] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const traits = {};
        if (email) traits.email = email;
        attributes.forEach(attr => {
            if (attr.key) traits[attr.key] = attr.value;
        });
        onIdentify(userId, traits);
    };

    return (
        <div className="card">
            <h3>Identify User</h3>
            <form onSubmit={handleSubmit}>
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

                <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={disabled}>
                    Send Identify Call
                </button>
            </form>
        </div>
    );
};

export default IdentityForm;
