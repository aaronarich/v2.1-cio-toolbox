/**
 * Customer.io Anonymous In-App Message — UTM Persistence Script
 *
 * Purpose: Captures UTM parameters on landing and persists them via
 * sessionStorage so that Customer.io page calls carry the UTM data
 * on every page view — not just the landing page.
 *
 * Uses sessionStorage so values clear when the tab/browser closes.
 * Swap to localStorage if you want persistence across sessions.
 *
 * Test UTM value: aaron_anon_persist
 * Example test URL: https://yoursite.com/?utm_campaign=aaron_anon_persist
 */

(function () {
  'use strict';

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  // --- 1. Capture UTMs from the current URL and store them ---------------------
  function captureUtms() {
    var params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        sessionStorage.setItem(key, value);
      }
    });
  }

  // --- 2. Retrieve any stored UTMs --------------------------------------------
  function getStoredUtms() {
    var data = {};
    UTM_KEYS.forEach(function (key) {
      var value = sessionStorage.getItem(key);
      if (value) {
        data[key] = value;
      }
    });
    return data;
  }

  // --- 3. Check whether we have ANY stored UTMs (i.e. not organic) ------------
  function hasUtms() {
    return UTM_KEYS.some(function (key) {
      return sessionStorage.getItem(key) !== null;
    });
  }

  // --- 4. Send a Customer.io page call with UTM data attached -----------------
  function sendCioPage() {
    var cio = window._cio;
    if (!cio || typeof cio.page !== 'function') {
      console.warn('[cio-utm-persist] _cio not found — is the Customer.io snippet loaded?');
      return;
    }

    var utmData = getStoredUtms();

    // Only send UTM-enriched page calls for paid/campaign traffic
    if (!hasUtms()) {
      // Organic visitor — send a normal page call (no UTM data)
      cio.page(document.title, { url: window.location.href });
      return;
    }

    // Campaign visitor — attach UTM data so in-app message rules can match
    var pageData = Object.assign(
      { url: window.location.href },
      utmData
    );

    cio.page(document.title, pageData);

    console.log('[cio-utm-persist] Page call sent with UTM data:', pageData);
  }

  // --- Run on load ------------------------------------------------------------
  captureUtms();
  sendCioPage();
})();
