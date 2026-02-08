#!/usr/bin/env node

/**
 * Greenlock Domain Configuration Script
 * 
 * This script configures your domain(s) with Greenlock.
 * Run this once before starting your server.
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const domain = process.env.DOMAIN || process.argv[2];
const email = process.env.ADMIN_EMAIL || process.argv[3];
const altDomains = process.env.ALT_DOMAINS ? process.env.ALT_DOMAINS.split(',') : [];

if (!domain) {
  console.error('❌ Error: Domain is required');
  console.log('Usage: node configure-greenlock.js <domain> [email]');
  console.log('   OR: Set DOMAIN and ADMIN_EMAIL in .env file');
  process.exit(1);
}

if (!email) {
  console.error('❌ Error: Email is required');
  console.log('Usage: node configure-greenlock.js <domain> <email>');
  console.log('   OR: Set DOMAIN and ADMIN_EMAIL in .env file');
  process.exit(1);
}

const allDomains = [domain, ...altDomains.filter(d => d && d !== domain)];

console.log('🔧 Configuring Greenlock...\n');
console.log(`Domain: ${domain}`);
console.log(`Email: ${email}`);
if (altDomains.length > 0) {
  console.log(`Alt domains: ${altDomains.join(', ')}`);
}
console.log('');

try {
  const greenlockExpress = require('@root/greenlock-express');
  
  const configDir = process.env.GREENLOCK_DIR || path.join(__dirname, 'greenlock.d');
  
  // Ensure config directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log(`✓ Created config directory: ${configDir}`);
  }

  // Initialize Greenlock
  const greenlock = greenlockExpress.init({
    packageRoot: path.resolve(),
    configDir: configDir,
    maintainerEmail: email,
    cluster: false
  });

  console.log('✓ Greenlock initialized\n', greenlock);
  
  // Wait for Greenlock to be ready, then configure domains
  console.log('⏳ Configuring domain...');
  
  greenlock.ready((manager) => {
    console.log('manager = ', manager);
  manager.serveApp({
    agreeToTerms: true,
    subscriberEmail: email
  }).then(() => {
    console.log('✓ Set default configuration');
    
    return greenlock.manager.add({
      subject: domain,
      altnames: allDomains
    });
  }).then(() => {
    console.log(`✓ Domain configured: ${domain}`);
    if (altDomains.length > 0) {
      console.log(`✓ Alt domains added: ${altDomains.join(', ')}`);
    }
    console.log('');
    console.log('✅ Greenlock configuration complete!');
    console.log('You can now start your server.');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Configuration failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure @root/greenlock-express is installed');
    console.log('2. Check that your domain points to this server');
    console.log('3. Ensure ports 80 and 443 are accessible');
    process.exit(1);
  });})

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('');
  console.log('Make sure Greenlock is installed:');
  console.log('  npm install @root/greenlock-express');
  process.exit(1);
}