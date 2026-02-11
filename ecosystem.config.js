module.exports = {
  apps: [{
    name: 'fear-api',
    script: 'backend/server.js',
    instances: '4',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'efear.store',
    script: 'stores/efear/server.js',
    instances: '2',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
  }]
}
