import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadSdk } from '../utils/sdk';

function HelloWorld() {
    useEffect(() => {
        const apiKey = localStorage.getItem('cio_api_key');
        const region = localStorage.getItem('cio_region') || 'us';
        const siteId = localStorage.getItem('cio_site_id');

        if (apiKey) {
            console.log('[HelloWorld] Initializing SDK from localStorage');
            loadSdk(apiKey, region, siteId);
        } else {
            console.warn('[HelloWorld] No API Key found in localStorage. SDK not initialized.');
        }
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Hello world 👋</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}> This page is used to test Customer.io page tracking.</p>
            <Link to="/" style={{
                color: '#68826C',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: '1px solid #68826C',
                padding: '0.5rem 1rem',
                borderRadius: '4px'
            }}>
                ← Back to Home
            </Link>
        </div>
    );
}

export default HelloWorld;
