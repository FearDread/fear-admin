module.exports = {
  apps: [
    {
      name: 'efear-next',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: './stores/efear-next',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'efear-api',
      script: './server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
};