const axios = require("axios");
const qs    = require("qs");

const CLIENT_ID     = process.env.GA_CLIENT_ID;
const CLIENT_SECRET = process.env.GA_CLIENT_SECRET;
const REDIRECT_URI  = process.env.GA_REDIRECT_URI;

const GOOGLE_AUTH_URL  = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

const GA_API_BASE      = "https://analyticsdata.googleapis.com/v1beta";
const GA_ADMIN_BASE    = "https://analyticsadmin.googleapis.com/v1alpha";

const SCOPES = [
      "https://www.googleapis.com/auth/analytics.readonly",
      "openid",
      "email",
      "profile",
].join(" ");

// ── In-memory token store (replace with DB for production) ────────────────────

let tokenStore = {
      accessToken:  null,
      refreshToken: null,
      expiresAt:    null,
};

const getToken    = ()     => tokenStore;
const saveToken   = (data) => { tokenStore = { ...tokenStore, ...data }; };
const clearToken  = ()     => { tokenStore = { accessToken: null, refreshToken: null, expiresAt: null }; };
const isConnected = ()     => !!tokenStore.accessToken && tokenStore.expiresAt > Date.now();

const ensureValidToken = async () => {
      if (!tokenStore.accessToken) throw new Error("Google Analytics account not connected.");

      const BUFFER_MS = 5 * 60 * 1000; // refresh 5 minutes before expiry
      if (tokenStore.expiresAt - Date.now() < BUFFER_MS) {
            await refreshAccessToken();
      }
};

const fetchTokenFromCode = async (code) => {
      const { data } = await axios.post(
            GOOGLE_TOKEN_URL,
            qs.stringify({
                  code,
                  client_id:     CLIENT_ID,
                  client_secret: CLIENT_SECRET,
                  redirect_uri:  REDIRECT_URI,
                  grant_type:    "authorization_code",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      return data;
};

const refreshAccessToken = async () => {
      const { refreshToken } = getToken();
      if (!refreshToken) throw new Error("No refresh token. User must reconnect.");

      const { data } = await axios.post(
            GOOGLE_TOKEN_URL,
            qs.stringify({
                  client_id:     CLIENT_ID,
                  client_secret: CLIENT_SECRET,
                  refresh_token: refreshToken,
                  grant_type:    "refresh_token",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      saveToken({
            accessToken: data.access_token,
            expiresAt:   Date.now() + data.expires_in * 1000,
      });

      return data.access_token;
};

// ── Shared GA4 API client ─────────────────────────────────────────────────────

const gaClient = () => {
      const { accessToken } = getToken();
      return axios.create({
            baseURL: GA_API_BASE,
            headers: { Authorization: `Bearer ${accessToken}` },
      });
};

const gaAdminClient = () => {
      const { accessToken } = getToken();
      return axios.create({
            baseURL: GA_ADMIN_BASE,
            headers: { Authorization: `Bearer ${accessToken}` },
      });
};

// ── Shared report runner ──────────────────────────────────────────────────────
// Sends a GA4 runReport request and returns the raw rows.

const runReport = async (propertyId, body) => {
      await ensureValidToken();
      const client = gaClient();
      const { data } = await client.post(`/properties/${propertyId}:runReport`, body);
      return data;
};

// ── Row parsers ───────────────────────────────────────────────────────────────

const parseRows = (data) => {
      const dimHeaders    = data.dimensionHeaders?.map(h => h.name) || [];
      const metricHeaders = data.metricHeaders?.map(h => h.name)    || [];

      return (data.rows || []).map(row => {
            const obj = {};
            row.dimensionValues?.forEach((v, i) => { obj[dimHeaders[i]]    = v.value; });
            row.metricValues?.forEach((v, i)    => { obj[metricHeaders[i]] = v.value; });
            return obj;
      });
};

// ── Controller ────────────────────────────────────────────────────────────────

const Analytics = {

      // ── GET /auth/connect
      // Redirects the user's browser to Google's OAuth consent page.
      connect: async (req, res) => {
        console.log('google analytics connect :: ', req);
            const params = new URLSearchParams({
                  client_id:     CLIENT_ID,
                  redirect_uri:  REDIRECT_URI,
                  response_type: "code",
                  scope:         SCOPES,
                  access_type:   "offline",   // required to receive a refresh_token
                  prompt:        "consent",   // force consent screen so refresh_token is always returned
            });
            return res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
      },

      // ── GET /auth/callback
      // Google posts the auth code here after the user grants consent.
      callback: async (req, res) => {
            const { code, error } = req.query;

            if (error) {
                  return res.status(400).send(`<script>
                        window.opener?.postMessage({ gaConnected: false, error: "${error}" }, "*");
                        window.close();
                  </script>`);
            }

            if (!code) {
                  return res.status(400).json({ success: false, message: "Missing authorization code." });
            }

            const data = await fetchTokenFromCode(code);

            saveToken({
                  accessToken:  data.access_token,
                  refreshToken: data.refresh_token,       // only present on first consent
                  expiresAt:    Date.now() + data.expires_in * 1000,
            });

            return res.send(`
                  <script>
                        if (window.opener) {
                              window.opener.postMessage({ gaConnected: true }, "*");
                        }
                        window.close();
                  </script>
                  <p>Google Analytics connected! You can close this window.</p>
            `);
      },

      // ── GET /auth/status
      status: async (req, res) => {
            const connected = isConnected();
            return res.json({
                  success:   true,
                  connected,
                  expiresAt: connected ? new Date(tokenStore.expiresAt).toISOString() : null,
            });
      },

      // ── POST /auth/disconnect
      disconnect: async (req, res) => {
            // Best-effort: revoke the token with Google
            if (tokenStore.accessToken) {
                  try {
                        await axios.post(
                              `https://oauth2.googleapis.com/revoke?token=${tokenStore.accessToken}`
                        );
                  } catch { /* ignore revocation errors — clear locally regardless */ }
            }
            clearToken();
            return res.json({ success: true, message: "Disconnected from Google Analytics." });
      },

      // ── POST /auth/refresh
      refresh: async (req, res) => {
            const newToken = await refreshAccessToken();
            return res.json({ success: true, message: "Token refreshed.", accessToken: newToken });
      },

      // ── GET /properties
      // Returns the list of GA4 properties accessible to the authenticated account.
      properties: async (req, res) => {
            await ensureValidToken();
            const client = gaAdminClient();
            const { data } = await client.get("/accountSummaries");

            const properties = [];
            for (const account of (data.accountSummaries || [])) {
                  for (const prop of (account.propertySummaries || [])) {
                        properties.push({
                              id:          prop.property.replace("properties/", ""),
                              displayName: prop.displayName,
                              account:     account.displayName,
                        });
                  }
            }

            return res.json({ success: true, properties });
      },

      // ── GET /report/overview
      // Returns headline KPIs: sessions, users, pageviews, bounce rate, avg session duration.
      overview: async (req, res) => {
            const { propertyId, startDate = "30daysAgo", endDate = "today" } = req.query;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required." });

            const data = await runReport(propertyId, {
                  dateRanges: [{ startDate, endDate }],
                  metrics: [
                        { name: "sessions"              },
                        { name: "totalUsers"            },
                        { name: "newUsers"              },
                        { name: "screenPageViews"       },
                        { name: "bounceRate"            },
                        { name: "averageSessionDuration"},
                  ],
            });

            const m = data.rows?.[0]?.metricValues || [];
            const get = (i) => parseFloat(m[i]?.value || 0);

            return res.json({
                  success: true,
                  overview: {
                        sessions:              get(0),
                        users:                 get(1),
                        newUsers:              get(2),
                        pageviews:             get(3),
                        bounceRate:            (get(4) * 100).toFixed(2),
                        avgSessionDuration:    get(5).toFixed(0),
                  },
            });
      },

      // ── GET /report/traffic
      // Returns sessions and users grouped by date (for time-series charts).
      traffic: async (req, res) => {
            const { propertyId, startDate = "30daysAgo", endDate = "today" } = req.query;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required." });

            const data = await runReport(propertyId, {
                  dateRanges: [{ startDate, endDate }],
                  dimensions: [{ name: "date" }],
                  metrics:    [
                        { name: "sessions"        },
                        { name: "totalUsers"      },
                        { name: "screenPageViews" },
                  ],
                  orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
            });

            const rows = parseRows(data).map(r => ({
                  date:      r.date,          // YYYYMMDD
                  sessions:  parseInt(r.sessions      || 0),
                  users:     parseInt(r.totalUsers    || 0),
                  pageviews: parseInt(r.screenPageViews || 0),
            }));

            return res.json({ success: true, traffic: rows });
      },

      // ── GET /report/pages
      // Returns top N pages ranked by pageviews with time-on-page and bounce rate.
      topPages: async (req, res) => {
            const { propertyId, startDate = "30daysAgo", endDate = "today", limit = 20 } = req.query;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required." });

            const data = await runReport(propertyId, {
                  dateRanges: [{ startDate, endDate }],
                  dimensions: [{ name: "pagePath" }],
                  metrics:    [
                        { name: "screenPageViews"           },
                        { name: "averageSessionDuration"    },
                        { name: "bounceRate"                },
                  ],
                  orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
                  limit:    parseInt(limit),
            });

            const rows = parseRows(data).map(r => ({
                  page:       r.pagePath,
                  pageviews:  parseInt(r.screenPageViews || 0),
                  avgTime:    parseFloat(r.averageSessionDuration || 0).toFixed(0),
                  bounceRate: ((parseFloat(r.bounceRate || 0)) * 100).toFixed(1) + "%",
            }));

            return res.json({ success: true, pages: rows });
      },

      // ── GET /report/devices
      // Returns session count by device category (mobile / desktop / tablet).
      devices: async (req, res) => {
            const { propertyId, startDate = "30daysAgo", endDate = "today" } = req.query;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required." });

            const data = await runReport(propertyId, {
                  dateRanges: [{ startDate, endDate }],
                  dimensions: [{ name: "deviceCategory" }],
                  metrics:    [{ name: "sessions" }],
                  orderBys:   [{ metric: { metricName: "sessions" }, desc: true }],
            });

            const rows   = parseRows(data);
            const total  = rows.reduce((s, r) => s + parseInt(r.sessions), 0) || 1;

            const devices = rows.map((r, i) => ({
                  name:     r.deviceCategory.charAt(0).toUpperCase() + r.deviceCategory.slice(1),
                  sessions: parseInt(r.sessions),
                  value:    Math.round((parseInt(r.sessions) / total) * 100),
            }));

            return res.json({ success: true, devices });
      },

      // ── GET /report/geo
      // Returns sessions grouped by country.
      geo: async (req, res) => {
            const { propertyId, startDate = "30daysAgo", endDate = "today", limit = 10 } = req.query;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required." });

            const data = await runReport(propertyId, {
                  dateRanges: [{ startDate, endDate }],
                  dimensions: [{ name: "country" }],
                  metrics:    [{ name: "sessions" }],
                  orderBys:   [{ metric: { metricName: "sessions" }, desc: true }],
                  limit:      parseInt(limit),
            });

            const rows  = parseRows(data);
            const total = rows.reduce((s, r) => s + parseInt(r.sessions), 0) || 1;

            const geo = rows.map(r => ({
                  country:  r.country,
                  sessions: parseInt(r.sessions),
                  pct:      ((parseInt(r.sessions) / total) * 100).toFixed(1) + "%",
            }));

            return res.json({ success: true, geo });
      },

      // ── GET /report/sources
      // Returns sessions grouped by traffic source and medium.
      sources: async (req, res) => {
            const { propertyId, startDate = "30daysAgo", endDate = "today" } = req.query;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required." });

            const data = await runReport(propertyId, {
                  dateRanges: [{ startDate, endDate }],
                  dimensions: [
                        { name: "sessionSource" },
                        { name: "sessionMedium" },
                  ],
                  metrics: [
                        { name: "sessions"   },
                        { name: "totalUsers" },
                        { name: "bounceRate" },
                  ],
                  orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
                  limit:    20,
            });

            const rows = parseRows(data).map(r => ({
                  source:     r.sessionSource,
                  medium:     r.sessionMedium,
                  sessions:   parseInt(r.sessions   || 0),
                  users:      parseInt(r.totalUsers  || 0),
                  bounceRate: ((parseFloat(r.bounceRate || 0)) * 100).toFixed(1) + "%",
            }));

            return res.json({ success: true, sources: rows });
      },

      // ── GET /report/realtime
      // Returns the number of users active in the last 30 minutes + their top pages.
      realtime: async (req, res) => {
            const { propertyId } = req.query;
            if (!propertyId) return res.status(400).json({ success: false, message: "propertyId required." });

            await ensureValidToken();
            const client = gaClient();

            const { data } = await client.post(`/properties/${propertyId}:runRealtimeReport`, {
                  dimensions: [{ name: "unifiedPagePathScreen" }],
                  metrics:    [{ name: "activeUsers"           }],
                  orderBys:   [{ metric: { metricName: "activeUsers" }, desc: true }],
                  limit:      5,
            });

            const rows = parseRows(data).map(r => ({
                  page:  r.unifiedPagePathScreen,
                  users: parseInt(r.activeUsers || 0),
            }));

            const activeUsers = rows.reduce((s, r) => s + r.users, 0);

            return res.json({
                  success:         true,
                  activeUsers,
                  topActivePages:  rows,
            });
      },

};

module.exports = Analytics;