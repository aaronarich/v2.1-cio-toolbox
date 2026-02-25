const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_PREFIX = 'cio_utm_';
const UTM_ELIGIBLE_KEY = 'cio_utm_eligible';

const captureUtmsFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    let capturedAny = false;

    UTM_KEYS.forEach((key) => {
        const value = params.get(key);
        if (value) {
            sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
            capturedAny = true;
        }
    });

    if (capturedAny) {
        sessionStorage.setItem(UTM_ELIGIBLE_KEY, 'true');
    }
};

const getStoredUtms = () => {
    const utmData = {};

    UTM_KEYS.forEach((key) => {
        const value = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
        if (value) {
            utmData[key] = value;
        }
    });

    return utmData;
};

const buildPagePayload = () => {
    captureUtmsFromUrl();
    const utmData = getStoredUtms();
    const isEligible = sessionStorage.getItem(UTM_ELIGIBLE_KEY) === 'true' && Object.keys(utmData).length > 0;

    if (!isEligible) {
        return {
            url: window.location.href,
        };
    }

    return {
        url: window.location.href,
        utm_eligible: true,
        ...utmData,
    };
};

const sendPage = () => {
    if (!window.analytics || !window.analytics.page) {
        return;
    }

    window.analytics.page(document.title, buildPagePayload());
};

export const loadSdk = (writeKey, region = 'us', siteId = null) => {
    return new Promise((resolve) => {
        if (window.analytics && window.analytics.initialized) {
            // SDK already loaded, send a page call with persisted campaign context
            sendPage();
            resolve();
            return;
        }

        // Build load options for in-app messaging if siteId is provided
        const loadOptions = siteId ? {
            integrations: {
                'Customer.io In-App Plugin': {
                    siteId: siteId,
                    anonymousInApp: true,
                    events: function(event) {
                        switch (event.type) {
                            case "in-app:message-opened":
                                console.log('[CIO SDK] Message Opened', event);
                                break;
                            case "in-app:message-dismissed":
                                console.log('[CIO SDK] Message Dismissed', event);
                                break;
                            case "in-app:message-action":
                                console.log('[CIO SDK] Message Action', event);
                                break;
                            case "in-app:message-error":
                                console.error('[CIO SDK] Message Error', event);
                                break;
                            case "in-app:message-changed":
                                console.log('[CIO SDK] Message Changed', event);
                                break;
                        }
                    }
                }
            }
        } : {};

        // Customer.io analytics.js stub
        var analytics = window.analytics = window.analytics || [];
        if (!analytics.initialize) {
            if (analytics.invoked) {
                window.console && console.error && console.error("Customer.io snippet included twice.");
            } else {
                analytics.invoked = !0;
                analytics.methods = [
                    "trackSubmit", "trackClick", "trackLink", "trackForm", "pageview",
                    "identify", "reset", "group", "track", "ready", "alias", "debug",
                    "page", "once", "off", "on", "addSourceMiddleware",
                    "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"
                ];
                analytics.factory = function (method) {
                    return function () {
                        var args = Array.prototype.slice.call(arguments);
                        args.unshift(method);
                        analytics.push(args);
                        return analytics;
                    };
                };
                for (var i = 0; i < analytics.methods.length; i++) {
                    var key = analytics.methods[i];
                    analytics[key] = analytics.factory(key);
                }
                analytics.load = function (key, options) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.async = true;
                    const domain = region === 'eu' ? 'cdp-eu.customer.io' : 'cdp.customer.io';
                    script.src = "https://" + domain + "/v1/analytics-js/snippet/" + key + "/analytics.min.js";
                    var first = document.getElementsByTagName("script")[0];
                    first.parentNode.insertBefore(script, first);
                    analytics._loadOptions = options;
                };
                analytics._writeKey = writeKey;
                analytics.SNIPPET_VERSION = "4.15.3";

                // Load the SDK with options
                analytics.load(writeKey, loadOptions);

                // Send initial page call
                sendPage();

                // Use ready callback to know when SDK is fully initialized
                analytics.ready(function () {
                    if (siteId) {
                        console.log('[CIO SDK] In-App Messaging enabled with Site ID:', siteId);
                    }
                    resolve();
                });

                // Set a timeout in case ready never fires
                setTimeout(() => {
                    resolve();
                }, 5000);
            }
        } else {
            // Already initialized
            sendPage();
            resolve();
        }
    });
};

export const trackPage = () => {
    sendPage();
};

export const identify = (userId, traits, options) => {
    if (window.analytics) {
        window.analytics.identify(userId, traits, options);
    }
};

export const track = (eventName, properties) => {
    if (window.analytics) {
        window.analytics.track(eventName, properties);
    }
};

export const reset = () => {
    if (window.analytics) {
        window.analytics.reset();
    }
}
