export const loadSdk = (siteId, region = 'us') => {
    return new Promise((resolve, reject) => {
        if (window.analytics) {
            resolve();
            return;
        }

        var t = window.analytics = [];
        t.invoked = !1;
        t._writeKey = siteId; // Explicitly set the write key
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
        for (var e = 0; e < t.methods.length; e++) {
            var key = t.methods[e];
            t[key] = t.factory(key);
        }
        t.load = function (n, e) {
            var t = document.createElement("script");
            t.type = "text/javascript";
            t.async = !0;
            const domain = region === 'eu' ? 'cdp-eu.customer.io' : 'cdp.customer.io';
            t.src = "https://" + domain + "/v1/analytics-js/snippet/" + n + "/analytics.min.js";
            var a = document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(t, a);
            t.onload = () => resolve();
            t.onerror = () => reject(new Error("Failed to load Customer.io SDK"));
        };

        t.load(siteId);
        t.page();
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
