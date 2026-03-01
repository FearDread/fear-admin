/**
 * Google OAuth 2.0 — Backend Auth Methods
 * Stack: Node.js / Express + googleapis
 *
 * Install dependencies:
 *   npm install googleapis express-session jsonwebtoken cookie-parser
 *
 * Required environment variables (.env):
 *   GOOGLE_CLIENT_ID=
 *   GOOGLE_CLIENT_SECRET=
 *   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
 *   SESSION_SECRET=your-secret-here
 *   JWT_SECRET=your-jwt-secret-here
 *   CLIENT_ORIGIN=http://localhost:5173   (your frontend URL)
 */

import { google } from "googleapis";
import jwt from "jsonwebtoken";

// ─── OAuth2 Client ────────────────────────────────────────────────────────────

function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

// ─── 1. Generate Auth URL ─────────────────────────────────────────────────────
// GET /api/auth/google/url
// Returns the Google OAuth consent-screen URL for the frontend to open in a popup.

export async function getGoogleAuthUrl(req, res) {
  try {
    const oauth2Client = createOAuthClient();

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",       // request refresh_token
      prompt: "consent",            // always show consent screen (ensures refresh_token)
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
      ],
      // Pass a CSRF state token — in production, store this in the session
      state: generateStateToken(),
    });

    res.json({ url });
  } catch (err) {
    console.error("[getGoogleAuthUrl]", err);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
}


// ─── 2. Handle OAuth Callback ─────────────────────────────────────────────────
// GET /api/auth/google/callback?code=...&state=...
// Google redirects here after the user approves. Exchanges the code for tokens,
// fetches the user profile, and closes the popup by posting a message back.

export async function handleGoogleCallback(req, res) {
    console.log('callback request = ', req.body);
  const { code, state, error } = req.query;

  // User denied access
  if (error) {
    return sendPopupMessage(res, {
      type: "GOOGLE_AUTH_ERROR",
      message: "Access was denied.",
    });
  }

  if (!code) {
    return sendPopupMessage(res, {
      type: "GOOGLE_AUTH_ERROR",
      message: "Missing authorization code.",
    });
  }

  // Optional: validate `state` against session to prevent CSRF
  // if (state !== req.session.oauthState) { ... }

  try {
    const oauth2Client = createOAuthClient();

    // Exchange code → tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch Google user profile
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();

    // Find or create the user in your database
    const user = await findOrCreateUser({
      googleId: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,  // store securely — used to refresh later
    });

    // Issue a JWT (or set a session cookie)
    const jwtToken = issueJwt(user);

    // Close popup and send success + JWT back to the opener window
    return sendPopupMessage(res, {
      type: "GOOGLE_AUTH_SUCCESS",
      token: jwtToken,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("[handleGoogleCallback]", err);
    return sendPopupMessage(res, {
      type: "GOOGLE_AUTH_ERROR",
      message: "Authentication failed. Please try again.",
    });
  }
}


// ─── 3. Refresh Access Token ──────────────────────────────────────────────────
// POST /api/auth/google/refresh
// Silently refresh an expired Google access token using the stored refresh token.

export async function refreshGoogleToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();

    res.json({
      accessToken: credentials.access_token,
      expiresAt: credentials.expiry_date,
    });
  } catch (err) {
    console.error("[refreshGoogleToken]", err);
    res.status(401).json({ error: "Could not refresh token — re-authentication required" });
  }
}


// ─── 4. Revoke & Sign Out ─────────────────────────────────────────────────────
// POST /api/auth/google/logout
// Revokes the Google token and clears the session/cookie.

export async function logoutGoogle(req, res) {
  const { accessToken } = req.body;

  if (accessToken) {
    try {
      const oauth2Client = createOAuthClient();
      await oauth2Client.revokeToken(accessToken);
    } catch (err) {
      // Non-fatal — token may have already expired
      console.warn("[logoutGoogle] Token revocation failed:", err.message);
    }
  }

  // Clear session / JWT cookie
  req.session?.destroy?.();
  res.clearCookie("token");

  res.json({ success: true });
}


// ─── 5. Auth Middleware ───────────────────────────────────────────────────────
// Attach to any protected route: router.get('/profile', requireAuth, handler)

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
}


// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Closes the OAuth popup and sends a postMessage to the parent window.
 * The React component listens for this via window.addEventListener('message', ...).
 */
function sendPopupMessage(res, payload) {
  const origin = process.env.CLIENT_ORIGIN || "*";
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <script>
          window.opener?.postMessage(${JSON.stringify(payload)}, "${origin}");
          window.close();
        </script>
      </body>
    </html>
  `);
}

/** Issue a signed JWT containing safe user fields. */
function issueJwt(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/** Strip sensitive fields before sending user to the client. */
function sanitizeUser(user) {
  const { refreshToken, accessToken, ...safe } = user;
  return safe;
}

/** Simple random state string for CSRF protection. */
function generateStateToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Stub: replace with your actual DB logic (Prisma, Mongoose, etc.)
 *
 * @param {{ googleId, email, name, picture, accessToken, refreshToken }} profile
 * @returns {Promise<User>}
 */
async function findOrCreateUser({ googleId, email, name, picture, accessToken, refreshToken }) {
  // Example with Prisma:
  // return prisma.user.upsert({
  //   where: { googleId },
  //   update: { accessToken, refreshToken, name, picture },
  //   create: { googleId, email, name, picture, accessToken, refreshToken },
  // });

  // Placeholder — returns a mock user object:
  return { id: googleId, googleId, email, name, picture };
}

export const GA = {
    auth: getGoogleAuthUrl,
    callback: handleGoogleCallback,

}
export default GA;

