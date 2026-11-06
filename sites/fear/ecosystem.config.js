/* FEAR SPA RESUME / PORTFOLIO SITE */
module.exports = {
    apps: [{
        name: 'fear-spa',
        merge_logs: true,                 // one log file instead of one per instance
        min_uptime: '10s',                // must stay up this long to count as a good start
        max_restarts: 5,                 // stop crash-looping after 10 fast failures
        exp_backoff_restart_delay: 200,   // back off between restarts (ms, grows exponentially)
        kill_timeout: 10000,              // let in-flight requests / ISR renders finish on reload
        script: './server.js',
        max_memory_restart: '256M',
        instances: '2',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            NODE_PORT: 5000
        },
        env_production: {
            NODE_ENV: 'production',
            NODE_PORT: 4000
        },

        // logs: one merged file pair for both instances
        time: true,
        merge_logs: true,
        out_file: './logs/fear-spa-out.log',
        error_file: './logs/fear-spa-error.log',
    },
    }]
};