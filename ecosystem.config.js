// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'fear-api',
    script: './backend/server.js',
    instances: '4',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
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