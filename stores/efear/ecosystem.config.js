
module.exports = {
  apps: [{
      name: "efear.shop",
      script: "./server.js",
      instances: '2',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
