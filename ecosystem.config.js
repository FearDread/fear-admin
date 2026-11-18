
// ecosystem.config.js
module.exports = {
    apps: [        // ── Main site: everything except the agent routes ───────────────────────
        {
            name: 'fear-main',
            script: 'backend/server.js',
            cwd: __dirname,
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            max_memory_restart: '512M',
            // Must exceed SHUTDOWN_TIMEOUT (10s) in FEARServer.js so graceful shutdown can finish
            kill_timeout: 12000,
            time: true,
            env: {
                NODE_ENV: 'development',
                NODE_PORT: 4000,
                BIND_HOST: '127.0.0.1',
                TRUST_PROXY: '1',
                EXCLUDE_ROUTES: 'agent'
            },
            env_production: {
                NODE_ENV: 'production'
            },
            out_file: './logs/fear-main.out.log',
            error_file: './logs/fear-main.err.log',
            merge_logs: true
        },
    ]
};
