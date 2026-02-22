const Analytics = require("../libs/analytics");

module.exports = (fear) => {
      const router  = fear.createRouter();
      const handler = fear.getHandler();

      // ── OAuth / Connection ─────────────────────────────────────────────────
      router.route("/auth/connect")
            .get(handler.async(Analytics.connect));           // Redirect browser to Google OAuth consent

      router.route("/auth/callback")
            .get(handler.async(Analytics.callback));          // Google redirects back with auth code

      router.route("/auth/status")
            .get(handler.async(Analytics.status));            // Check if token is valid

      router.route("/auth/disconnect")
            .post(handler.async(Analytics.disconnect));       // Revoke & clear stored token

      router.route("/auth/refresh")
            .post(handler.async(Analytics.refresh));          // Force-refresh the access token

      // ── GA4 Properties ────────────────────────────────────────────────────
      router.route("/properties")
            .get(handler.async(Analytics.properties));        // List all GA4 properties for the account

      // ── Reports ───────────────────────────────────────────────────────────
      router.route("/report/overview")
            .get(handler.async(Analytics.overview));          // Sessions, users, pageviews, bounce rate

      router.route("/report/traffic")
            .get(handler.async(Analytics.traffic));           // Sessions & users over time (for charts)

      router.route("/report/pages")
            .get(handler.async(Analytics.topPages));          // Top pages by pageviews + engagement

      router.route("/report/devices")
            .get(handler.async(Analytics.devices));           // Device category breakdown

      router.route("/report/geo")
            .get(handler.async(Analytics.geo));               // Sessions by country

      router.route("/report/sources")
            .get(handler.async(Analytics.sources));           // Traffic source / medium breakdown

      router.route("/report/realtime")
            .get(handler.async(Analytics.realtime));          // Active users right now

      return router;
};