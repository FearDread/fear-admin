module.exports = {
  apps: [
    {
      // Express/FEAR backend. Toggle FRONTEND_MODE to 'next' once the
      // Next.js app is ready to take over frontend rendering — see router.js.
      name: "efear.shop",
      script: "./server.js",
      instances: '2',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: "production",
        // FRONTEND_MODE: "next", // uncomment when cutting over to Next.js
      },
    },
    {
      // Next.js frontend — only needed once FRONTEND_MODE=next above.
      // Requires `next.config.js` output: 'standalone' or a plain `next build`.
      name: "efear-web",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      instances: '2',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};