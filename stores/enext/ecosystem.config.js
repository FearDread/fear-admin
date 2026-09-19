const WEB_PORT = 3000;
const API_PORT = 4000;

module.exports = {
 exec_mode: 'cluster',
  instances: 2,
  autorestart: true,
  watch: false,
  time: true,                       // timestamp every log line
  merge_logs: true,                 // one log file instead of one per instance
  min_uptime: '20s',                // must stay up this long to count as a good start
  max_restarts: 10,                 // stop crash-looping after 10 fast failures
  exp_backoff_restart_delay: 200,   // back off between restarts (ms, grows exponentially)
  kill_timeout: 10000,              // let in-flight requests / ISR renders finish on reload

      name: 'efear.next',
      cwd: '/home/feardread/_workspace/_git/fear-admin/store/enext',
      script: 'node_modules/next/dist/bin/next',
      args: `start -H 127.0.0.1 -p ${WEB_PORT}`,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
 INTERNAL_API_BASE_URL: `http://127.0.0.1:${API_PORT}/fear/api`,
      }
}
