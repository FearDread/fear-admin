// modules/code-analyzer.js - Code Security Analysis
const fs = require('fs').promises;
const path = require('path');

class CodeAnalyzer {
  constructor() {
    this.vulnerabilityPatterns = [
      {
        pattern: /eval\s*\(/g,
        severity: 'CRITICAL',
        type: 'Code Injection',
        desc: 'Use of eval() can execute arbitrary code',
        cwe: 'CWE-95'
      },
      {
        pattern: /innerHTML\s*=/g,
        severity: 'HIGH',
        type: 'XSS',
        desc: 'Direct innerHTML assignment without sanitization',
        cwe: 'CWE-79'
      },
      {
        pattern: /document\.write\s*\(/g,
        severity: 'MEDIUM',
        type: 'XSS',
        desc: 'document.write can introduce XSS vulnerabilities',
        cwe: 'CWE-79'
      },
      {
        pattern: /password\s*[:=]\s*['"][^'"]+['"]/gi,
        severity: 'CRITICAL',
        type: 'Hardcoded Credentials',
        desc: 'Hardcoded password detected',
        cwe: 'CWE-798'
      },
      {
        pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
        severity: 'CRITICAL',
        type: 'Hardcoded Credentials',
        desc: 'Hardcoded API key detected',
        cwe: 'CWE-798'
      },
      {
        pattern: /secret\s*[:=]\s*['"][^'"]+['"]/gi,
        severity: 'CRITICAL',
        type: 'Hardcoded Credentials',
        desc: 'Hardcoded secret detected',
        cwe: 'CWE-798'
      },
      {
        pattern: /exec\s*\(|execSync\s*\(/g,
        severity: 'HIGH',
        type: 'Command Injection',
        desc: 'Shell command execution can be dangerous',
        cwe: 'CWE-78'
      },
      {
        pattern: /\$\{.*?\}/g,
        severity: 'MEDIUM',
        type: 'Template Injection',
        desc: 'Template literals with user input can be unsafe',
        cwe: 'CWE-94'
      },
      {
        pattern: /dangerouslySetInnerHTML/g,
        severity: 'HIGH',
        type: 'XSS',
        desc: 'React dangerouslySetInnerHTML requires sanitization',
        cwe: 'CWE-79'
      },
      {
        pattern: /Math\.random\(\)/g,
        severity: 'LOW',
        type: 'Weak Randomness',
        desc: 'Math.random() is not cryptographically secure',
        cwe: 'CWE-330'
      },
      {
        pattern: /crypto\.createCipher\(/g,
        severity: 'HIGH',
        type: 'Weak Crypto',
        desc: 'createCipher is deprecated, use createCipheriv',
        cwe: 'CWE-327'
      },
      {
        pattern: /req\.query\.|req\.params\.|req\.body\./g,
        severity: 'INFO',
        type: 'Input Validation',
        desc: 'User input should be validated and sanitized',
        cwe: 'CWE-20'
      }
    ];
    
    this.fileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
  }

  async analyzeCode(args) {
    const filePath = args[0];
    
    if (!filePath) {
      console.log('❌ Usage: analyze-code <file-path>\n');
      return;
    }
    
    try {
      const code = await fs.readFile(filePath, 'utf8');
      const lines = code.split('\n');
      const issues = [];
      
      // Analyze each pattern
      this.vulnerabilityPatterns.forEach(({ pattern, severity, type, desc, cwe }) => {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        
        while ((match = regex.exec(code)) !== null) {
          const lineNum = code.substring(0, match.index).split('\n').length;
          const lineContent = lines[lineNum - 1].trim();
          
          issues.push({
            severity,
            type,
            desc,
            cwe,
            line: lineNum,
            code: lineContent,
            match: match[0]
          });
        }
      });
      
      // Display results
      console.log(`\n🔎 Code Security Analysis`);
      console.log(`═══════════════════════════════════════`);
      console.log(`File: ${filePath}`);
      console.log(`Size: ${code.length} bytes`);
      console.log(`Lines: ${lines.length}`);
      console.log(`Issues Found: ${issues.length}\n`);
      
      if (issues.length === 0) {
        console.log('✅ No obvious security issues detected\n');
        return;
      }
      
      // Group by severity
      const critical = issues.filter(i => i.severity === 'CRITICAL');
      const high = issues.filter(i => i.severity === 'HIGH');
      const medium = issues.filter(i => i.severity === 'MEDIUM');
      const low = issues.filter(i => i.severity === 'LOW');
      const info = issues.filter(i => i.severity === 'INFO');
      
      if (critical.length > 0) {
        console.log('🔴 CRITICAL Issues:');
        critical.forEach(issue => this.printIssue(issue));
      }
      
      if (high.length > 0) {
        console.log('\n🟠 HIGH Issues:');
        high.forEach(issue => this.printIssue(issue));
      }
      
      if (medium.length > 0) {
        console.log('\n🟡 MEDIUM Issues:');
        medium.forEach(issue => this.printIssue(issue));
      }
      
      if (low.length > 0) {
        console.log('\n🟢 LOW Issues:');
        low.forEach(issue => this.printIssue(issue));
      }
      
      if (info.length > 0 && process.env.VERBOSE) {
        console.log('\nℹ️  INFO:');
        info.forEach(issue => this.printIssue(issue));
      }
      
      console.log('\n📊 Summary:');
      console.log(`  Critical: ${critical.length}`);
      console.log(`  High: ${high.length}`);
      console.log(`  Medium: ${medium.length}`);
      console.log(`  Low: ${low.length}`);
      console.log(`  Info: ${info.length}\n`);
      
    } catch (err) {
      console.log(`❌ Could not analyze file: ${err.message}\n`);
    }
  }

  printIssue(issue) {
    console.log(`  Line ${issue.line}: ${issue.type} (${issue.cwe})`);
    console.log(`  └─ ${issue.desc}`);
    console.log(`     Code: ${issue.code.substring(0, 80)}${issue.code.length > 80 ? '...' : ''}`);
  }

  async analyzeProject(args) {
    const dir = args[0] || '.';
    
    console.log(`\n🔍 Project Security Analysis`);
    console.log(`═══════════════════════════════════════`);
    console.log(`Directory: ${path.resolve(dir)}`);
    console.log(`Scanning...\n`);
    
    const files = await this.findCodeFiles(dir);
    console.log(`Found ${files.length} code files\n`);
    
    const allIssues = [];
    let filesWithIssues = 0;
    
    for (const file of files) {
      try {
        const code = await fs.readFile(file, 'utf8');
        const issues = [];
        
        this.vulnerabilityPatterns.forEach(({ pattern, severity, type, desc, cwe }) => {
          let match;
          const regex = new RegExp(pattern.source, pattern.flags);
          
          while ((match = regex.exec(code)) !== null) {
            const lineNum = code.substring(0, match.index).split('\n').length;
            issues.push({ file, severity, type, desc, cwe, line: lineNum });
          }
        });
        
        if (issues.length > 0) {
          filesWithIssues++;
          allIssues.push(...issues);
        }
      } catch (err) {
        console.log(`⚠️  Could not read ${file}: ${err.message}`);
      }
    }
    
    // Summary by file
    console.log('📁 Files with Issues:');
    const fileGroups = {};
    allIssues.forEach(issue => {
      const relPath = path.relative(dir, issue.file);
      if (!fileGroups[relPath]) fileGroups[relPath] = [];
      fileGroups[relPath].push(issue);
    });
    
    Object.entries(fileGroups).forEach(([file, issues]) => {
      const critical = issues.filter(i => i.severity === 'CRITICAL').length;
      const high = issues.filter(i => i.severity === 'HIGH').length;
      const medium = issues.filter(i => i.severity === 'MEDIUM').length;
      
      console.log(`  ${file}`);
      console.log(`    🔴 ${critical} 🟠 ${high} 🟡 ${medium}`);
    });
    
    // Overall summary
    const summary = {
      critical: allIssues.filter(i => i.severity === 'CRITICAL').length,
      high: allIssues.filter(i => i.severity === 'HIGH').length,
      medium: allIssues.filter(i => i.severity === 'MEDIUM').length,
      low: allIssues.filter(i => i.severity === 'LOW').length,
      info: allIssues.filter(i => i.severity === 'INFO').length
    };
    
    console.log('\n\n📊 Project Summary:');
    console.log(`  Total files scanned: ${files.length}`);
    console.log(`  Files with issues: ${filesWithIssues}`);
    console.log(`  Total issues: ${allIssues.length}`);
    console.log(`\n  By Severity:`);
    console.log(`    🔴 Critical: ${summary.critical}`);
    console.log(`    🟠 High: ${summary.high}`);
    console.log(`    🟡 Medium: ${summary.medium}`);
    console.log(`    🟢 Low: ${summary.low}`);
    console.log(`    ℹ️  Info: ${summary.info}\n`);
    
    if (summary.critical > 0) {
      console.log('⚠️  CRITICAL issues found! Address these immediately.\n');
    }
  }

  async findCodeFiles(dir, files = []) {
    try {
      const items = await fs.readdir(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        
        // Skip common directories
        if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(item)) {
          continue;
        }
        
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          await this.findCodeFiles(fullPath, files);
        } else if (this.fileExtensions.includes(path.extname(fullPath))) {
          files.push(fullPath);
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
    
    return files;
  }
}

module.exports = CodeAnalyzer;