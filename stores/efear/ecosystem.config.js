
module.exports = {
  apps: [
    {
      name: "efear.shop",
      script: "server.js",
      //args: "-s build -l 3000", // Serve the build folder on port 3000
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
