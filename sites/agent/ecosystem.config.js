/**
 * PM2 ecosystem for FEAR.
 *
 * Run from the repo root (server.js resolves 'backend/admin/build' and FEAR.js reads
 * ./.env relative to the working directory):
 *
 *   pm2 start ecosystem.config.js --env production
 *   pm2 start ecosystem.config.js --only fear-agent --env production
 *   pm2 save && pm2 startup
 *
 * Values set here win over .env (FEAR.js lets real environment variables override it),
 * so SESSION_SECRET, JWT_SECRET, etc. still come from .env.
 */
module.exports = {
    apps: [
        // ── Agent site: only /fear/api/agent/* ──────────────────────────────────
        // The agent API has no authentication and can read files, scan ports and
        // run the card/proxy tooling, so this instance is loopback-only. Put nginx
        // in front of it with auth (basic auth / IP allowlist / VPN) — never expose
        // port 4001 directly.
        {
            name: 'fear-agent',
            script: 'server.js',
            cwd: __dirname,
            // The agent keeps command history, services and console capture in process
            // memory, so it must be a single fork instance (no cluster mode).
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            max_memory_restart: '512M',
            kill_timeout: 12000,
            time: true,
            env: {
                NODE_ENV: 'development',
                NODE_PORT: 4001,
                BIND_HOST: '127.0.0.1',
                TRUST_PROXY: '1',
                // Skip every route file except agent
                EXCLUDE_ROUTES: '*,!agent',
                // The agent doesn't use Mongo; an empty DB_LINK skips the connection and
                // falls back to the in-memory session store instead of sharing the main DB.
                DB_LINK: ''
            },
            env_production: {
                NODE_ENV: 'production'
            },
            out_file: './logs/fear-agent.out.log',
            error_file: './logs/fear-agent.err.log',
            merge_logs: true
        }
    ]
};
