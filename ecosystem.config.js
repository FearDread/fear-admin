
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'fear-api',
    merge_logs: true,                 // one log file instead of one per instance
    min_uptime: '20s',                // must stay up this long to count as a good start
    max_restarts: 10,                 // stop crash-looping after 10 fast failures
    exp_backoff_restart_delay: 200,   // back off between restarts (ms, grows exponentially)
    kill_timeout: 10000,              // let in-flight requests / ISR renders finish on reload
    script: './backend/server.js',
    max_memory_restart: '512M',
    instances: '4',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    env_production: {
      NODE_ENV: 'production',
      NODE_PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
};
