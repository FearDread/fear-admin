module.exports = {
  apps : [{
    name   : "efear",
    script : "yarn run start",
    instances: '2',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    }
  }]
}
