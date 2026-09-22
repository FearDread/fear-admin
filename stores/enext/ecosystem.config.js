module.exports = {
  apps: [
    {
  autorestart: true,
  watch: false,
  time: true,                       // timestamp every log line
  merge_logs: true,                 // one log file instead of one per instance
  min_uptime: '20s',                // must stay up this long to count as a good start
  max_restarts: 10,                 // stop crash-looping after 10 fast failures
  exp_backoff_restart_delay: 200,   // back off between restarts (ms, grows exponentially)
  kill_timeout: 10000,              // let in-flight requests / ISR renders finish on reload
      name: "efear.shop",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      instances: '2',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: "production",
	INTERNAL_API_BASE_URL: 'http://127.0.0.1:4000/fear/api'
      },
    },
  ],
};
