/**
 * PM2 ecosystem :: vchat, two instances.
 *
 * Why exec_mode is "fork", not "cluster": vchat keeps its rooms in each process's memory.
 * PM2 cluster mode puts both workers on ONE port and round-robins connections between
 * them, so two people in the same room would usually land on different workers and never
 * see each other. Instead each instance gets its own port (increment_var: 3001, 3002) and
 * nginx routes every WebSocket for a room to the same instance (deploy/nginx-vchat.conf).
 *
 *   npm run build && pm2 startOrReload ecosystem.config.js --env production
 *   pm2 logs vchat      pm2 status      pm2 save && pm2 startup
 */
module.exports = {
    apps: [
        {
            name: 'vchat',
            script: 'server.js',
            cwd: __dirname, // FEAR reads ./.env relative to the working directory

            exec_mode: 'fork',
            instances: 2,
            increment_var: 'NODE_PORT', // instance 0 -> NODE_PORT, instance 1 -> NODE_PORT + 1

            env: {
                NODE_ENV: 'development',
                NODE_PORT: 3001,
            },
            env_production: {
                NODE_ENV: 'production',
                NODE_PORT: 3001,
                TRUST_PROXY: 1, // nginx in front: real client IPs for the login limiter and lastLoginIP
            },

            // restarts
            autorestart: true,
            min_uptime: '10s',
            max_restarts: 10,
            exp_backoff_restart_delay: 200,
            max_memory_restart: '512M',
            kill_timeout: 10000, // server.js closes sockets and the DB on SIGINT/SIGTERM
            watch: false,

            // logs: one merged file pair for both instances
            time: true,
            merge_logs: true,
            out_file: './logs/vchat-out.log',
            error_file: './logs/vchat-error.log',
        },
    ],
};