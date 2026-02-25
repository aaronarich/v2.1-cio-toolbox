import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadSdk } from '../utils/sdk';
import '../App.css';

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
    <div className="hello-world-page">
      <h1 className="hello-world-title">Hello world</h1>
      <p className="hello-world-subtitle">This page is used to test Customer.io page tracking.</p>
      <Link to="/" className="hello-world-back-link">
        Back to Home
      </Link>
    </div>
  );
}

export default HelloWorld;
