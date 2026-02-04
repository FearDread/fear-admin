#!/usr/bin/env node

/**
 * Example FEAR Server with HTTPS Auto-Encryption
 * 
 * This example demonstrates how to set up a FEAR server with automatic
 * HTTPS using Let's Encrypt (Greenlock).
 */

const path = require('path');
const FearServer = require('./src/FEARServer');

async function startServer() {
  const server = new FearServer();

  try {
    console.log('🚀 Initializing FEAR Server with HTTPS...\n');

    // 1. Initialize FEAR application
    await server.initialize(
      {
        root: path.resolve(),
        app: 'backend/admin/build',
        build: 'backend/admin/build',
        //basePath: '/admin' // Optional: serve React app at /admin
      },
      false, // ADD_PAYMENTS - set to true if you need payment routes
      {
        // React configuration
        enableCORS: true,
        corsOptions: {
          origin: process.env.CORS_ORIGIN || '*',
          credentials: true
        }
      },
      '.env' // Load environment variables from .env file
    );

    // 2. Setup HTTPS with auto-encryption
    // 
    // IMPORTANT: Before running in production:
    // - Ensure your domain DNS points to this server
    // - Ports 80 and 443 must be accessible
    // - Test with staging: true first
    
    if (process.env.HTTPS_ENABLED === 'true') {
      const httpsConfig = {
        mode: process.env.HTTPS_MODE || 'greenlock',
        httpsPort: parseInt(process.env.HTTPS_PORT) || 443,
        redirectHttp: process.env.HTTPS_REDIRECT !== 'false'
      };

      if (httpsConfig.mode === 'greenlock') {
        // Greenlock (Let's Encrypt) configuration
        Object.assign(httpsConfig, {
          domain: process.env.DOMAIN || 'yourdomain.com',
          email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
          staging: process.env.NODE_ENV !== 'production',
          configDir: process.env.GREENLOCK_DIR || './greenlock.d',
          altnames: process.env.ALT_DOMAINS 
            ? process.env.ALT_DOMAINS.split(',') 
            : []
        });

        console.log('📋 HTTPS Configuration:');
        console.log(`   Mode: Greenlock (Let's Encrypt)`);
        console.log(`   Domain: ${httpsConfig.domain}`);
        console.log(`   Email: ${httpsConfig.email}`);
        console.log(`   Staging: ${httpsConfig.staging ? 'YES (testing)' : 'NO (production)'}`);
        console.log(`   Port: ${httpsConfig.httpsPort}`);
        console.log(`   HTTP Redirect: ${httpsConfig.redirectHttp ? 'Enabled' : 'Disabled'}`);
        console.log('');

      } else if (httpsConfig.mode === 'manual') {
        // Manual SSL certificate configuration
        Object.assign(httpsConfig, {
          certPath: process.env.SSL_CERT_PATH || './ssl/certificate.crt',
          keyPath: process.env.SSL_KEY_PATH || './ssl/private.key',
          caPath: process.env.SSL_CA_PATH // Optional
        });

        console.log('📋 HTTPS Configuration:');
        console.log(`   Mode: Manual Certificates`);
        console.log(`   Certificate: ${httpsConfig.certPath}`);
        console.log(`   Private Key: ${httpsConfig.keyPath}`);
        console.log(`   CA Bundle: ${httpsConfig.caPath || 'None'}`);
        console.log(`   Port: ${httpsConfig.httpsPort}`);
        console.log(`   HTTP Redirect: ${httpsConfig.redirectHttp ? 'Enabled' : 'Disabled'}`);
        console.log('');
      }

      server.setupHTTPS(httpsConfig);
    } else {
      console.log('⚠️  HTTPS is disabled. Running in HTTP mode only.\n');
    }

    // 3. Start the server
    await server.startServer();

    console.log('\n✅ Server started successfully!');
    console.log('\nPress CTRL+C to stop the server.\n');

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...');
});

// Start the server
startServer();