export const loadSdk = (writeKey, region = 'us', siteId = null) => {
    return new Promise((resolve, reject) => {
        if (window.analytics) {
            // SDK already loaded, just send a page call
            window.analytics.page();
            resolve();
            return;
        }

        var t = window.analytics = [];
        t.invoked = !1;
        t._writeKey = writeKey;

        // Build load options for in-app messaging if siteId is provided
        const loadOptions = siteId ? {
            integrations: {
                'Customer.io In-App Plugin': {
                    siteId: siteId,
                    events: (e) => {
                        console.log('[In-App Message Event]', e.type, e);
                    }
                }
            }
        } : {};

        t.methods = [
            "trackSubmit", "trackClick", "trackLink", "trackForm", "pageview",
            "identify", "reset", "group", "track", "ready", "alias", "debug",
            "page", "once", "off", "on", "addSourceMiddleware",
            "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"
        ];
        t.factory = function (e) {
            return function () {
                var n = Array.prototype.slice.call(arguments);
                n.unshift(e);
                t.push(n);
                return t;
            };
        };
        for (var i = 0; i < t.methods.length; i++) {
            var key = t.methods[i];
            t[key] = t.factory(key);
        }
        t.load = function (writeKey, options) {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = !0;
            const domain = region === 'eu' ? 'cdp-eu.customer.io' : 'cdp.customer.io';
            s.src = "https://" + domain + "/v1/analytics-js/snippet/" + writeKey + "/analytics.min.js";
            var a = document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(s, a);
            t._loadOptions = options;
            s.onload = () => {
                // Send page call after SDK is fully loaded
                if (window.analytics && window.analytics.page) {
                    window.analytics.page();
                }
                resolve();
            };
            s.onerror = () => reject(new Error("Failed to load Customer.io SDK"));
        };

        t.load(writeKey, loadOptions);
    });
};

export const identify = (userId, traits) => {
    if (window.analytics) {
        window.analytics.identify(userId, traits);
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
