const path = require('path');
const FearSSR = require('../../backend/src/FEARSSR');
const FearServer = require('../../backend/src/FEARServer');
const Router = require('./router');

require('dotenv').config();

const BUILD_DIR = path.resolve(__dirname, 'build');
const PUB_DIR = path.resolve(__dirname, 'public');

// 'spa'  → serve the legacy CRA build directly (original behavior)
// 'next' → API-only; a separately-running Next.js app (`next start`, :3000)
//          serves + renders the frontend and proxies /fear/api/* back here.
const FRONTEND_MODE = (process.env.FRONTEND_MODE || 'spa').toLowerCase();

async function main() {
  const server = new FearServer();

  server
    .initialize(
      { root: path.resolve() }, true,
      { multipleApps: true, apps: [] })
    .then((fear) => {
      if (FRONTEND_MODE === 'next') {
        // Next.js does its own SSR — the legacy streaming SSR path (FearSSR)
        // is CRA-specific and doesn't apply here, so skip attaching it.
        Router.attach(fear, { mode: 'next' });
      } else {
        FearSSR.attach(fear, PUB_DIR, {
          streaming: true, // false = buffer full HTML before sending (safer for some CDNs)
        });
        Router.attach(fear, BUILD_DIR, {
          verbose: process.env.NODE_ENV !== 'production',
        });
      }

      return server.startServer();
    })
    .then(() => {
      console.log('\nYour site is now available at:');
      if (FRONTEND_MODE === 'next') {
        const domain = process.env.HTTPS_DOMAIN || 'efear.store';
        console.log(`API      : https://${domain}/fear/api`);
        console.log(`Frontend : ${process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000'} (run separately, e.g. \`next start\`)\n`);
      } else {
        console.log(`https://${process.env.HTTPS_DOMAIN || 'efear.store'}\n`);
      }
    })
    .catch((error) => {
      console.error('Error during server initialization or startup:', error);
      process.exit(1);
    });
}

main().catch(error => process.exit(1));