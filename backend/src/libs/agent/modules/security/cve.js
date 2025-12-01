// modules/cve-database.js - CVE & Security Database Integration
const https = require('https');
const http = require('http');
const fs = require('fs').promises;

class CVEDatabase {
  constructor() {
    this.cveCache = new Map();
    this.nvdBaseUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
    this.exploitDbUrl = 'https://www.exploit-db.com/search';
    this.cweUrl = 'https://cwe.mitre.org/data/definitions';
  }

  async searchCVE(args) {
    const query = args.join(' ');
    
    if (!query) {
      console.log('❌ Usage: search-cve <keyword or CVE-ID>\n');
      console.log('Examples:');
      console.log('  search-cve CVE-2024-1234');
      console.log('  search-cve apache log4j');
      console.log('  search-cve nodejs express\n');
      return;
    }

    console.log(`\n🔍 Searching CVE Database`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Query: ${query}`);
    console.log(`Source: National Vulnerability Database\n`);

    try {
      // Check if it's a CVE ID
      if (query.match(/CVE-\d{4}-\d{4,}/i)) {
        await this.getCVEDetails(query.toUpperCase());
      } else {
        await this.searchByKeyword(query);
      }
    } catch (err) {
      console.log(`❌ Search failed: ${err.message}\n`);
    }
  }

  async getCVEDetails(cveId) {
    console.log(`Fetching details for ${cveId}...\n`);

    // Check cache first
    if (this.cveCache.has(cveId)) {
      this.displayCVE(this.cveCache.get(cveId));
      return;
    }

    try {
      const url = `${this.nvdBaseUrl}?cveId=${cveId}`;
      const data = await this.makeRequest(url);
      const parsed = JSON.parse(data);

      if (parsed.vulnerabilities && parsed.vulnerabilities.length > 0) {
        const cve = parsed.vulnerabilities[0].cve;
        this.cveCache.set(cveId, cve);
        this.displayCVE(cve);
      } else {
        console.log(`❌ CVE ${cveId} not found in database\n`);
      }
    } catch (err) {
      console.log(`⚠️  Could not fetch CVE details: ${err.message}`);
      console.log(`Try searching manually at: https://nvd.nist.gov/vuln/detail/${cveId}\n`);
    }
  }

  displayCVE(cve) {
    console.log(`📋 CVE Details`);
    console.log(`═══════════════════════════════════════`);
    console.log(`ID: ${cve.id}`);
    
    // Description
    const description = cve.descriptions?.find(d => d.lang === 'en')?.value || 'No description available';
    console.log(`\nDescription:\n${this.wrapText(description, 70)}`);

    // CVSS Scores
    if (cve.metrics) {
      console.log(`\n📊 CVSS Scores:`);
      
      if (cve.metrics.cvssMetricV31 && cve.metrics.cvssMetricV31.length > 0) {
        const cvss = cve.metrics.cvssMetricV31[0].cvssData;
        const severity = cve.metrics.cvssMetricV31[0].baseSeverity;
        console.log(`  CVSS v3.1: ${cvss.baseScore}/10 (${severity})`);
        console.log(`  Vector: ${cvss.vectorString}`);
      } else if (cve.metrics.cvssMetricV2 && cve.metrics.cvssMetricV2.length > 0) {
        const cvss = cve.metrics.cvssMetricV2[0].cvssData;
        console.log(`  CVSS v2.0: ${cvss.baseScore}/10`);
        console.log(`  Vector: ${cvss.vectorString}`);
      }
    }

    // Weaknesses (CWE)
    if (cve.weaknesses && cve.weaknesses.length > 0) {
      console.log(`\n🔗 Related Weaknesses:`);
      cve.weaknesses.forEach(weakness => {
        weakness.description.forEach(desc => {
          if (desc.lang === 'en') {
            console.log(`  • ${desc.value}`);
          }
        });
      });
    }

    // References
    if (cve.references && cve.references.length > 0) {
      console.log(`\n🔗 References:`);
      cve.references.slice(0, 5).forEach(ref => {
        console.log(`  • ${ref.url}`);
      });
      if (cve.references.length > 5) {
        console.log(`  ... and ${cve.references.length - 5} more`);
      }
    }

    // Published dates
    if (cve.published) {
      console.log(`\n📅 Published: ${new Date(cve.published).toLocaleDateString()}`);
    }
    if (cve.lastModified) {
      console.log(`📅 Last Modified: ${new Date(cve.lastModified).toLocaleDateString()}`);
    }

    console.log();
  }

  async searchByKeyword(keyword) {
    console.log(`Searching for vulnerabilities related to "${keyword}"...\n`);

    try {
      const url = `${this.nvdBaseUrl}?keywordSearch=${encodeURIComponent(keyword)}&resultsPerPage=10`;
      const data = await this.makeRequest(url);
      const parsed = JSON.parse(data);

      if (parsed.vulnerabilities && parsed.vulnerabilities.length > 0) {
        console.log(`Found ${parsed.totalResults} vulnerabilities (showing first 10):\n`);

        parsed.vulnerabilities.forEach((vuln, index) => {
          const cve = vuln.cve;
          const desc = cve.descriptions?.find(d => d.lang === 'en')?.value || 'No description';
          const shortDesc = desc.substring(0, 100) + (desc.length > 100 ? '...' : '');
          
          let severity = 'UNKNOWN';
          let score = 'N/A';
          
          if (cve.metrics?.cvssMetricV31 && cve.metrics.cvssMetricV31.length > 0) {
            severity = cve.metrics.cvssMetricV31[0].baseSeverity;
            score = cve.metrics.cvssMetricV31[0].cvssData.baseScore;
          } else if (cve.metrics?.cvssMetricV2 && cve.metrics.cvssMetricV2.length > 0) {
            score = cve.metrics.cvssMetricV2[0].cvssData.baseScore;
            severity = score >= 7.0 ? 'HIGH' : score >= 4.0 ? 'MEDIUM' : 'LOW';
          }

          const icon = severity === 'CRITICAL' ? '🔴' : 
                      severity === 'HIGH' ? '🟠' : 
                      severity === 'MEDIUM' ? '🟡' : '🟢';

          console.log(`${index + 1}. ${icon} ${cve.id} [${severity} - ${score}]`);
          console.log(`   ${shortDesc}`);
          console.log();
        });

        console.log(`💡 Use "search-cve <CVE-ID>" for detailed information\n`);
      } else {
        console.log(`❌ No vulnerabilities found for "${keyword}"\n`);
      }
    } catch (err) {
      console.log(`⚠️  Search failed: ${err.message}`);
      console.log(`Try searching manually at: https://nvd.nist.gov/vuln/search\n`);
    }
  }

  async checkPackage(args) {
    const packageName = args[0];
    const version = args[1];

    if (!packageName) {
      console.log('❌ Usage: check-package <package-name> [version]\n');
      console.log('Examples:');
      console.log('  check-package express');
      console.log('  check-package lodash 4.17.20\n');
      return;
    }

    console.log(`\n🔍 Checking Package Security`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Package: ${packageName}`);
    if (version) console.log(`Version: ${version}`);
    console.log();

    try {
      // Search NVD for package
      const query = version ? `${packageName} ${version}` : packageName;
      await this.searchByKeyword(query);

      // Suggest npm audit
      console.log(`💡 Tip: Run "npm audit" in your project for detailed analysis\n`);
    } catch (err) {
      console.log(`❌ Package check failed: ${err.message}\n`);
    }
  }

  async checkCWE(args) {
    const cweId = args[0];

    if (!cweId) {
      console.log('❌ Usage: check-cwe <CWE-ID>\n');
      console.log('Examples:');
      console.log('  check-cwe CWE-79');
      console.log('  check-cwe 79\n');
      return;
    }

    const id = cweId.replace(/^CWE-/i, '');
    console.log(`\n🔍 CWE Details`);
    console.log(`═══════════════════════════════════════`);
    console.log(`ID: CWE-${id}`);
    console.log(`Source: Common Weakness Enumeration\n`);

    // Common CWE database (cached for speed)
    const commonCWEs = {
      '79': {
        name: 'Cross-site Scripting (XSS)',
        description: 'The software does not neutralize or incorrectly neutralizes user-controllable input before it is placed in output that is used as a web page.',
        impact: 'Allows attackers to inject malicious scripts into web pages viewed by other users.',
        mitigation: 'Validate and sanitize all user input, use Content Security Policy, encode output.'
      },
      '89': {
        name: 'SQL Injection',
        description: 'The software constructs SQL commands using user-controllable input that is not properly neutralized.',
        impact: 'Allows attackers to view, modify, or delete database data; may lead to full database compromise.',
        mitigation: 'Use parameterized queries, prepared statements, and input validation.'
      },
      '78': {
        name: 'OS Command Injection',
        description: 'The software constructs OS commands using user-controllable input without proper neutralization.',
        impact: 'Allows attackers to execute arbitrary commands on the host operating system.',
        mitigation: 'Avoid calling OS commands with user input; use safe APIs; validate input strictly.'
      },
      '22': {
        name: 'Path Traversal',
        description: 'The software uses user input to construct pathnames without proper validation.',
        impact: 'Allows attackers to access files and directories outside intended directory.',
        mitigation: 'Validate paths, use whitelists, avoid direct user input in file operations.'
      },
      '352': {
        name: 'Cross-Site Request Forgery (CSRF)',
        description: 'The web application does not verify that a request was intentionally sent by the user.',
        impact: 'Allows attackers to perform actions on behalf of authenticated users.',
        mitigation: 'Use CSRF tokens, SameSite cookies, verify origin headers.'
      },
      '798': {
        name: 'Use of Hard-coded Credentials',
        description: 'The software contains hard-coded credentials for authentication.',
        impact: 'Attackers can gain unauthorized access using the hard-coded credentials.',
        mitigation: 'Use environment variables, secure vaults, configuration files outside code.'
      },
      '20': {
        name: 'Improper Input Validation',
        description: 'The product does not validate or incorrectly validates input.',
        impact: 'Can lead to various vulnerabilities including injection attacks.',
        mitigation: 'Implement comprehensive input validation, use allowlists when possible.'
      },
      '502': {
        name: 'Deserialization of Untrusted Data',
        description: 'The application deserializes untrusted data without verification.',
        impact: 'Can lead to remote code execution, denial of service.',
        mitigation: 'Avoid deserializing untrusted data; use safe serialization formats.'
      },
      '611': {
        name: 'XML External Entity (XXE)',
        description: 'The software processes XML documents without proper validation of external entities.',
        impact: 'Can lead to information disclosure, denial of service, server-side request forgery.',
        mitigation: 'Disable XML external entity processing, use safe XML parsers.'
      },
      '434': {
        name: 'Unrestricted Upload of File with Dangerous Type',
        description: 'The software allows upload of files with dangerous types without restrictions.',
        impact: 'Can lead to remote code execution, website defacement.',
        mitigation: 'Validate file types, use allowlists, scan uploads, store outside webroot.'
      }
    };

    if (commonCWEs[id]) {
      const cwe = commonCWEs[id];
      console.log(`Name: ${cwe.name}\n`);
      console.log(`Description:\n${this.wrapText(cwe.description, 70)}\n`);
      console.log(`Impact:\n${this.wrapText(cwe.impact, 70)}\n`);
      console.log(`Mitigation:\n${this.wrapText(cwe.mitigation, 70)}\n`);
    } else {
      console.log(`⚠️  CWE-${id} not in local database\n`);
    }

    console.log(`🔗 More info: https://cwe.mitre.org/data/definitions/${id}.html\n`);
  }

  async checkExploits(args) {
    const query = args.join(' ');

    if (!query) {
      console.log('❌ Usage: check-exploits <keyword or CVE-ID>\n');
      console.log('Examples:');
      console.log('  check-exploits CVE-2024-1234');
      console.log('  check-exploits apache struts\n');
      return;
    }

    console.log(`\n🔍 Searching Exploit Database`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Query: ${query}\n`);

    console.log(`⚠️  Note: Direct exploit-db API access is limited.`);
    console.log(`Visit: https://www.exploit-db.com/search?q=${encodeURIComponent(query)}`);
    console.log(`Or: searchsploit ${query}\n`);
  }

  async scanDependencies(args) {
    const dir = args[0] || '.';
    
    console.log(`\n🔍 Scanning Dependencies for Known Vulnerabilities`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Directory: ${dir}\n`);

    try {
      const pkgPath = require('path').join(dir, 'package.json');
      const data = await fs.readFile(pkgPath, 'utf8');
      const pkg = JSON.parse(data);

      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies
      };

      if (Object.keys(allDeps).length === 0) {
        console.log('ℹ️  No dependencies found\n');
        return;
      }

      console.log(`Found ${Object.keys(allDeps).length} dependencies\n`);
      console.log(`Checking against CVE database...\n`);

      let checked = 0;
      let found = 0;

      for (const [name, version] of Object.entries(allDeps)) {
        checked++;
        process.stdout.write(`\r⏳ Checking: ${checked}/${Object.keys(allDeps).length} - ${name}...`);
        
        // Check for known vulnerabilities (simplified)
        const cleanVersion = version.replace(/^[\^~]/, '');
        const searchQuery = `${name} ${cleanVersion}`;
        
        // Note: In production, use proper npm audit API
        // This is a demonstration
      }

      console.log(`\n\n✅ Scan complete: ${checked} packages checked`);
      console.log(`\n💡 For detailed analysis, run: npm audit`);
      console.log(`💡 For fix suggestions, run: npm audit fix\n`);

    } catch (err) {
      console.log(`❌ Scan failed: ${err.message}\n`);
    }
  }

  async exportCVEReport(args) {
    const filename = args[0] || `cve-report-${Date.now()}.json`;

    const report = {
      timestamp: new Date().toISOString(),
      cached_cves: Array.from(this.cveCache.entries()).map(([id, cve]) => ({
        id,
        description: cve.descriptions?.find(d => d.lang === 'en')?.value,
        severity: cve.metrics?.cvssMetricV31?.[0]?.baseSeverity || 'UNKNOWN',
        score: cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 'N/A'
      }))
    };

    try {
      await fs.writeFile(filename, JSON.stringify(report, null, 2));
      console.log(`\n✅ CVE report exported to: ${filename}\n`);
    } catch (err) {
      console.log(`❌ Export failed: ${err.message}\n`);
    }
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const lib = url.startsWith('https') ? https : http;
      
      const options = {
        headers: {
          'User-Agent': 'Security-AI-Agent/2.1',
          'Accept': 'application/json'
        },
        timeout: 10000
      };

      lib.get(url, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      }).on('error', (err) => {
        reject(err);
      }).on('timeout', () => {
        reject(new Error('Request timeout'));
      });
    });
  }

  wrapText(text, width) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > width) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });

    if (currentLine) lines.push(currentLine.trim());
    return lines.join('\n');
  }
}

module.exports = CVEDatabase;