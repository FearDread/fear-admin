// modules/api-tester.js - API Endpoint Security Testing
const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs').promises;
const colorizer = require("../utils/colorizer");

const ApiAnalyzer = function () {

  this.testResults = [];
  this.vulnerabilities = [];
  this.payloads = {
    xss: [
      '<script>alert("XSS")</script>',
      '"><script>alert(1)</script>',
      'javascript:alert(1)',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>'
    ],
    sql: [
      "' OR '1'='1",
      "1' OR '1'='1' --",
      "admin'--",
      "' UNION SELECT NULL--",
      "1; DROP TABLE users--"
    ],
    nosql: [
      '{"$gt":""}',
      '{"$ne":null}',
      '{"$regex":".*"}',
      '[$ne]=1'
    ],
    cmdInjection: [
      '; ls -la',
      '| cat /etc/passwd',
      '`whoami`',
      '$(whoami)',
      '& dir'
    ],
    pathTraversal: [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system.ini',
      '....//....//....//etc/passwd',
      '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
    ],
    xxe: [
      '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM "file:///etc/passwd">]><root>&test;</root>'
    ]
  };

  this.commonHeaders = {
    'User-Agent': 'Security-AI-Agent/2.0',
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  };

}

ApiAnalyzer.prototype = {

  async testEndpoint(args) {
    const url = (args) ? args[0] : null;
    const method = (args && args.length > 0) ? (args[1]).toUpperCase() : 'GET';

    if (!url || url === null) {
      console.log(colorizer.red('Usage: test-endpoint <url> [method] [body]\n'));
      console.log(colorizer.header('Examples:'));
      console.log('  test-endpoint https://api.example.com/users');
      console.log('  test-endpoint https://api.example.com/login POST');
      console.log('  test-endpoint https://api.example.com/user/123 GET\n');
      return;
    }

    console.log(colorizer.box(`\nAPI Endpoint Security Test`));
    console.log(`URL: ${url}`);
    console.log(`Method: ${method}`);
    console.log(colorizer.grey(`Started: ${new Date().toLocaleString()}\n`));

    this.testResults = [];
    this.vulnerabilities = [];
    // Run security tests
    this.test.entries.forEach(async (func) => {
      await this.test[func](url, method);
    })
      .then(() => this.displayResults())
      .catch((err) => {
        console.log("error running tests", err);
      })
    /*
        await this.testBasicSecurity(url, method);
        await this.testHeaders(url);
        await this.testAuthentication(url, method);
        await this.testRateLimiting(url, method);
        await this.testInputValidation(url, method);
        await this.testHTTPMethods(url);
    */

  },

  async testCollection(args) {
    const filePath = args[0];

    if (!filePath) {
      console.log('Usage: test-collection <json-file>\n');
      console.log('Example JSON format:');
      console.log(JSON.stringify({
        name: "API Test Collection",
        endpoints: [
          { url: "https://api.example.com/users", method: "GET" },
          { url: "https://api.example.com/login", method: "POST" }
        ]
      }, null, 2));
      console.log();
      return;
    }

    await fs.readFile((filePath, 'utf8'))
      .then((data) => {
        const collection = JSON.parse(data);
        console.log(`\nTesting API Collection: ${collection.name}`);
        console.log(`===============================================`);
        console.log(`Endpoints: ${collection.endpoints.length}\n`);

        for (const endpoint of collection.endpoints) {
          this.testEndpoint([endpoint.url, endpoint.method]).catch((err) => { });
          this.sleep(1000);
        }
      })
      .catch((err) => {
        console.log(`Failed to load collection: ${err.message}\n`);
      });
  },

  async exportReport(args) {
    const filename = args[0] || `api-test-report-${Date.now()}.json`;

    const report = {
      timestamp: new Date().toISOString(),
      vulnerabilities: this.vulnerabilities,
      testResults: this.testResults,
      summary: {
        critical: this.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
        high: this.vulnerabilities.filter(v => v.severity === 'HIGH').length,
        medium: this.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
        low: this.vulnerabilities.filter(v => v.severity === 'LOW').length
      }
    };

    await fs.writeFile(filename, JSON.stringify(report, null, 2))
      .then(() => console.log(`\nReport exported to: ${filename}\n`))
      .catch((err) => console.log(`Export failed: ${err.message}\n`));
  },

  async makeRequest(url, method, body = null, customHeaders = {}) {
    return new Promise((resolve) => {
      const parsedUrl = new URL(url);
      const lib = parsedUrl.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: { ...this.commonHeaders, ...customHeaders },
        timeout: 5000,
        rejectUnauthorized: false // For self-signed certs
      };

      if (body) {
        options.headers['Content-Length'] = Buffer.byteLength(body);
      }

      const req = lib.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', (err) => {
        resolve({ error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ error: 'Request timeout' });
      });

      if (body) {
        req.write(body);
      }

      req.end();
    });
  },

  addResult(type, name, detail) {
    this.testResults.push({ type, name, detail });
  },

  addVulnerability(severity, name, detail, remediation) {
    this.vulnerabilities.push({ severity, name, detail, remediation });
  },

  displayResults() {
    console.log('\n\nTest Results');
    console.log(`===================================\n`);

    // Display vulnerabilities by severity
    const critical = this.vulnerabilities.filter(v => v.severity === 'CRITICAL');
    const high = this.vulnerabilities.filter(v => v.severity === 'HIGH');
    const medium = this.vulnerabilities.filter(v => v.severity === 'MEDIUM');
    const low = this.vulnerabilities.filter(v => v.severity === 'LOW');

    if (critical.length > 0) {
      console.log('CRITICAL Vulnerabilities:');
      critical.forEach(v => this.printVulnerability(v));
      console.log();
    }

    if (high.length > 0) {
      console.log('HIGH Vulnerabilities:');
      high.forEach(v => this.printVulnerability(v));
      console.log();
    }

    if (medium.length > 0) {
      console.log('MEDIUM Vulnerabilities:');
      medium.forEach(v => this.printVulnerability(v));
      console.log();
    }

    if (low.length > 0) {
      console.log('LOW Vulnerabilities:');
      low.forEach(v => this.printVulnerability(v));
      console.log();
    }

    if (this.vulnerabilities.length === 0) {
      console.log(colorizer.green('No vulnerabilities detected!\n'));
    }

    // Summary
    console.log('Summary:');
    console.log(`  Critical: ${critical.length}`);
    console.log(`  High: ${high.length}`);
    console.log(`  Medium: ${medium.length}`);
    console.log(`  Low: ${low.length}`);
    console.log(`  Total Tests: ${this.testResults.length}`);
    console.log();

    // Security Score
    const score = this.calculateSecurityScore(critical.length, high.length, medium.length, low.length);
    console.log(`Security Score: ${score}/100`);
    console.log();
  },

  printVulnerability(v) {
    console.log(`  • ${v.name}`);
    console.log(`    Issue: ${v.detail}`);
    console.log(`    Fix: ${v.remediation}`);
  },

  calculateSecurityScore(critical, high, medium, low) {
    let score = 100;
    score -= critical * 25;
    score -= high * 15;
    score -= medium * 10;
    score -= low * 5;
    return Math.max(0, score);
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  tests: {

    async security(url, method) {
      console.log('Testing Basic Security...');

      try {
        // Test HTTPS
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol === 'http:') {
          this.addVulnerability('HIGH', 'Insecure Protocol',
            'API uses HTTP instead of HTTPS', 'Use HTTPS for all endpoints');
        } else {
          this.addResult('PASS', 'HTTPS Protocol', 'Endpoint uses HTTPS');
        }

        // Make basic request
        const response = await this.makeRequest(url, method);

        if (response.statusCode) {
          this.addResult('INFO', 'Status Code', `Response: ${response.statusCode}`);
        }

        // Check for server header
        if (response.headers && response.headers.server) {
          this.addVulnerability('LOW', 'Server Header Exposed',
            `Server: ${response.headers.server}`, 'Remove or obfuscate Server header');
        }

        // Check for X-Powered-By
        if (response.headers && response.headers['x-powered-by']) {
          this.addVulnerability('LOW', 'Technology Stack Exposed',
            `X-Powered-By: ${response.headers['x-powered-by']}`, 'Remove X-Powered-By header');
        }

      } catch (err) {
        console.log(`  ⚠️  Request failed: ${err.message}`);
      }
    },

    async headers(url) {
      console.log('Testing Security Headers...');

      try {
        const response = await this.makeRequest(url, 'GET');
        const headers = response.headers || {};

        // Critical security headers
        const requiredHeaders = {
          'strict-transport-security': { severity: 'HIGH', name: 'HSTS' },
          'x-frame-options': { severity: 'MEDIUM', name: 'X-Frame-Options' },
          'x-content-type-options': { severity: 'MEDIUM', name: 'X-Content-Type-Options' },
          'content-security-policy': { severity: 'HIGH', name: 'CSP' },
          'x-xss-protection': { severity: 'LOW', name: 'X-XSS-Protection' },
          'referrer-policy': { severity: 'LOW', name: 'Referrer-Policy' }
        };

        for (const [header, info] of Object.entries(requiredHeaders)) {
          if (!headers[header]) {
            this.addVulnerability(info.severity, `Missing ${info.name}`,
              `${info.name} header not set`, `Add ${header} header`);
          } else {
            this.addResult('PASS', info.name, `Header present: ${headers[header]}`);
          }
        }

        // Check CORS
        if (headers['access-control-allow-origin'] === '*') {
          this.addVulnerability('MEDIUM', 'Open CORS Policy',
            'CORS allows all origins (*)', 'Restrict CORS to specific origins');
        }

      } catch (err) {
        console.log(`  ⚠️  Header test failed: ${err.message}`);
      }
    },

    async authentication(url, method) {
      console.log('Testing Authentication...');

      try {
        // Test without auth
        const noAuthResponse = await this.makeRequest(url, method);

        if (noAuthResponse.statusCode === 200) {
          this.addVulnerability('HIGH', 'No Authentication Required',
            'Endpoint accessible without authentication', 'Implement authentication');
        } else if (noAuthResponse.statusCode === 401 || noAuthResponse.statusCode === 403) {
          this.addResult('PASS', 'Authentication Required', 'Endpoint requires authentication');
        }

        // Test with invalid token
        const invalidAuthResponse = await this.makeRequest(url, method, null, {
          'Authorization': 'Bearer invalid_token_12345'
        });

        if (invalidAuthResponse.statusCode === 200) {
          this.addVulnerability('CRITICAL', 'Broken Authentication',
            'Endpoint accepts invalid tokens', 'Validate authentication tokens');
        }

        // Test common default credentials
        const defaultCreds = [
          { user: 'admin', pass: 'admin' },
          { user: 'admin', pass: 'password' },
          { user: 'root', pass: 'root' }
        ];

        for (const cred of defaultCreds) {
          const basicAuth = Buffer.from(`${cred.user}:${cred.pass}`).toString('base64');
          const response = await this.makeRequest(url, method, null, {
            'Authorization': `Basic ${basicAuth}`
          });

          if (response.statusCode === 200) {
            this.addVulnerability('CRITICAL', 'Default Credentials',
              `Accepts default credentials: ${cred.user}/${cred.pass}`, 'Change default credentials');
            break;
          }
        }

      } catch (err) {
        console.log(`  ⚠️  Authentication test failed: ${err.message}`);
      }
    },

    async limiting(url, method) {
      console.log('Testing Rate Limiting...');

      try {
        const requests = 15;
        let successCount = 0;
        let rateLimited = false;

        for (let i = 0; i < requests; i++) {
          const response = await this.makeRequest(url, method);
          if (response.statusCode === 429) {
            rateLimited = true;
            break;
          } else if (response.statusCode === 200) {
            successCount++;
          }
          await this.sleep(100); // Small delay
        }

        if (!rateLimited && successCount === requests) {
          this.addVulnerability('MEDIUM', 'No Rate Limiting',
            'Endpoint accepts unlimited requests', 'Implement rate limiting');
        } else if (rateLimited) {
          this.addResult('PASS', 'Rate Limiting', 'Endpoint has rate limiting');
        }

      } catch (err) {
        console.log(`  ⚠️  Rate limit test failed: ${err.message}`);
      }
    },

    async validation(url, method) {
      console.log('Testing Input Validation...');

      if (method === 'GET') {
        await this.testQueryParams(url);
      } else if (method === 'POST' || method === 'PUT') {
        await this.testBodyPayloads(url, method);
      }
    },

    async params(url) {
      const parsedUrl = new URL(url);

      // Test XSS in query params
      for (const payload of this.payloads.xss.slice(0, 2)) {
        const testUrl = `${url}${url.includes('?') ? '&' : '?'}test=${encodeURIComponent(payload)}`;
        const response = await this.makeRequest(testUrl, 'GET');

        if (response.body && response.body.includes(payload)) {
          this.addVulnerability('HIGH', 'XSS Vulnerability',
            'Unsanitized input reflected in response', 'Sanitize and encode all user input');
          break;
        }
      }

      // Test SQL injection
      for (const payload of this.payloads.sql.slice(0, 2)) {
        const testUrl = `${url}${url.includes('?') ? '&' : '?'}id=${encodeURIComponent(payload)}`;
        const response = await this.makeRequest(testUrl, 'GET');

        if (response.body && (response.body.includes('SQL') || response.body.includes('syntax'))) {
          this.addVulnerability('CRITICAL', 'SQL Injection',
            'SQL error messages exposed', 'Use parameterized queries');
          break;
        }
      }

      // Test path traversal
      for (const payload of this.payloads.pathTraversal.slice(0, 2)) {
        const testUrl = `${url}${url.includes('?') ? '&' : '?'}file=${encodeURIComponent(payload)}`;
        const response = await this.makeRequest(testUrl, 'GET');

        if (response.body && (response.body.includes('root:') || response.body.includes('[extensions]'))) {
          this.addVulnerability('CRITICAL', 'Path Traversal',
            'Directory traversal possible', 'Validate and sanitize file paths');
          break;
        }
      }
    },

    async payloads(url, method) {
      // Test JSON injection
      const jsonPayloads = [
        { test: this.payloads.xss[0] },
        { id: this.payloads.sql[0] },
        { filter: this.payloads.nosql[0] }
      ];

      for (const payload of jsonPayloads) {
        const response = await this.makeRequest(url, method, JSON.stringify(payload));

        if (response.statusCode === 500) {
          this.addVulnerability('MEDIUM', 'Insufficient Input Validation',
            'Server error on malformed input', 'Implement proper input validation');
          break;
        }
      }

      // Test oversized payload
      const largePayload = JSON.stringify({ data: 'A'.repeat(10000000) }); // 10MB
      const response = await this.makeRequest(url, method, largePayload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        this.addVulnerability('LOW', 'No Payload Size Limit',
          'Endpoint accepts very large payloads', 'Implement payload size limits');
      }
    },

    async http(url) {
      console.log('Testing HTTP Methods...');

      const methods = ['OPTIONS', 'HEAD', 'PUT', 'DELETE', 'PATCH', 'TRACE'];
      const allowedMethods = [];

      for (const method of methods) {
        const response = await this.makeRequest(url, method);

        if (response.statusCode !== 405 && response.statusCode !== 501) {
          allowedMethods.push(method);
        }
      }

      if (allowedMethods.includes('TRACE')) {
        this.addVulnerability('LOW', 'TRACE Method Enabled',
          'TRACE method can lead to XST attacks', 'Disable TRACE method');
      }

      if (allowedMethods.length > 0) {
        this.addResult('INFO', 'Allowed Methods', `Methods: ${allowedMethods.join(', ')}`);
      }
    },
  },
}

module.exports = ApiAnalyzer;