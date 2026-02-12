module.exports = {
  apps: [
    {
      name: 'fear-admin',
      script: './backend/server.js',
      instances: 4,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
        API_URL: 'http://localhost:4000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
        API_URL: 'https://fear.dedyn.io'
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'efear.shop',
      cwd: '/home/feardread/_workspace/_git/fear-admin/stores/efear',
      script: './server.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        API_URL: 'http://localhost:3000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        API_URL: 'https://www.efear.shop'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }]
}
