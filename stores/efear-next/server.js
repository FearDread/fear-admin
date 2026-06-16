const path = require('path');
const FearServer = require('../../backend/src/FEARServer');

require('dotenv').config();

async function main() {
  const server = new FearServer();

  await server
    .initialize(
      { root: path.resolve() },
      true,                          // ADD_PAYMENTS
      { multipleApps: true, apps: [] }  // skip static file setup
    )
    .then((fear) => {
      const app = fear.getApp();
      const logger = fear.getLogger();

      // Security headers on all API responses
      app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
      });

      // Health check
      app.get('/health', (_req, res) => {
        res.json({
          status: 'ok',
          timestamp: new Date().toISOString(),
          env: process.env.NODE_ENV || 'development',
        });
      });

      logger.info('═══════════════════════════════════════');
      logger.info('[FEAR Server] API server ready');
      logger.info('[FEAR Server] Next.js runs separately on :3000');
      logger.info('[FEAR Server] Express API on :' + (process.env.PORT || 4000));
      logger.info('═══════════════════════════════════════');

      return server.startServer();
    })
    .then(() => {
      console.log('\nAPI server running.');
      console.log(`Next.js frontend : http://localhost:3000`);
      console.log(`Express API      : http://localhost:${process.env.PORT || 4000}\n`);
    })
    .catch((error) => {
      console.error('Error during server initialization:', error);
      process.exit(1);
    });
}

main().catch(() => process.exit(1));