// modules/web-scraper.js - Web Scraping & Content Extraction
const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs').promises;
const colorizer = require('../utils/colorizer');

const WebScraper = function() {
  this.userAgent = 'Security-AI-Agent/2.2 (Web Scraper)';
  this.timeout = 10000;
  this.maxRedirects = 5;
}

WebScraper.prototype = {
    
  scrape(args) {
    const url = args[0];
    
    if (!url) {
      console.log(colorizer.error('Usage: scrape <url>'));
      console.log(colorizer.info('Examples:'));
      console.log(colorizer.dim('  scrape https://example.com'));
      console.log(colorizer.dim('  scrape https://news.ycombinator.com\n'));
      return Promise.resolve();
    }

    console.log(colorizer.header('Web Scraper'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('URL: ') + colorizer.bright(url));
    console.log(colorizer.cyan('Fetching content...\n'));

    return this.fetchURL(url)
      .then(data => {
        console.log(colorizer.success('Content fetched successfully\n'));
        
        const extracted = this.extractContent(data.body, url);
        this.displayResults(extracted, data);
        
        return extracted;
      })
      .catch(err => {
        console.log(colorizer.error('Scraping failed: ' + err.message + '\n'));
      });
  },

  fetchURL(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
      if (redirectCount >= this.maxRedirects) {
        return reject(new Error('Too many redirects'));
      }

      const parsedUrl = new URL(url);
      const lib = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'identity',
          'Connection': 'close'
        },
        timeout: this.timeout,
        rejectUnauthorized: false
      };

      const req = lib.request(options, res => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, url).href;
          console.log(colorizer.dim('  Redirecting to: ' + redirectUrl));
          return this.fetchURL(redirectUrl, redirectCount + 1)
            .then(resolve)
            .catch(reject);
        }

        let data = '';
        
        res.on('data', chunk => {
          data += chunk.toString();
        });

        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            url: url
          });
        });
      });

      req.on('error', err => {
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  },

  extractContent(html, url) {
    const extracted = {
      title: this.extractTitle(html),
      description: this.extractDescription(html),
      links: this.extractLinks(html, url),
      images: this.extractImages(html, url),
      headings: this.extractHeadings(html),
      text: this.extractText(html),
      meta: this.extractMeta(html),
      scripts: this.extractScripts(html),
      forms: this.extractForms(html)
    };

    return extracted;
  },

  extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : 'No title found';
  },

  extractDescription(html) {
    const match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    return match ? match[1].trim() : 'No description found';
  },

  extractLinks(html, baseUrl) {
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi;
    const links = [];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      try {
        const href = match[1];
        const text = match[2].trim() || '(no text)';
        const absoluteUrl = new URL(href, baseUrl).href;
        links.push({ url: absoluteUrl, text: text });
      } catch (err) {
        // Invalid URL, skip
      }
    }

    return links;
  },

  extractImages(html, baseUrl) {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
    const images = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      try {
        const src = match[1];
        const alt = match[2] || '(no alt text)';
        const absoluteUrl = new URL(src, baseUrl).href;
        images.push({ url: absoluteUrl, alt: alt });
      } catch (err) {
        // Invalid URL, skip
      }
    }

    return images;
  },

  extractHeadings(html) {
    const headings = [];
    
    for (let i = 1; i <= 6; i++) {
      const regex = new RegExp(`<h${i}[^>]*>([^<]+)</h${i}>`, 'gi');
      let match;
      
      while ((match = regex.exec(html)) !== null) {
        headings.push({
          level: i,
          text: match[1].trim()
        });
      }
    }

    return headings;
  },

  extractText(html) {
    // Remove scripts and styles
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text.substring(0, 500) + (text.length > 500 ? '...' : '');
  },

  extractMeta(html) {
    const metaRegex = /<meta\s+([^>]+)>/gi;
    const meta = [];
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
      const attrs = match[1];
      const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
      const contentMatch = attrs.match(/content=["']([^"']+)["']/i);
      
      if (nameMatch && contentMatch) {
        meta.push({
          name: nameMatch[1],
          content: contentMatch[1]
        });
      }
    }

    return meta;
  },

  extractScripts(html) {
    const scriptRegex = /<script[^>]*(?:src=["']([^"']+)["'])?[^>]*>/gi;
    const scripts = [];
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
      if (match[1]) {
        scripts.push(match[1]);
      }
    }

    return scripts;
  },

  extractForms(html) {
    const formRegex = /<form[^>]*action=["']([^"']+)["'][^>]*method=["']([^"']+)["'][^>]*>/gi;
    const forms = [];
    let match;

    while ((match = formRegex.exec(html)) !== null) {
      forms.push({
        action: match[1],
        method: match[2].toUpperCase()
      });
    }

    return forms;
  },

  displayResults(extracted, data) {
    console.log(colorizer.section('Page Information'));
    console.log(colorizer.cyan('Title: ') + colorizer.bright(extracted.title));
    console.log(colorizer.cyan('Description: ') + extracted.description);
    console.log(colorizer.cyan('Status: ') + (data.statusCode === 200 ? colorizer.green(data.statusCode) : colorizer.red(data.statusCode)));
    
    if (data.headers['content-type']) {
      console.log(colorizer.cyan('Content-Type: ') + data.headers['content-type']);
    }

    if (extracted.headings.length > 0) {
      console.log(colorizer.section('Headings (' + extracted.headings.length + ')'));
      extracted.headings.slice(0, 10).forEach(h => {
        const indent = '  '.repeat(h.level - 1);
        console.log(colorizer.dim(indent + 'H' + h.level + ':') + ' ' + h.text);
      });
      if (extracted.headings.length > 10) {
        console.log(colorizer.dim('  ... and ' + (extracted.headings.length - 10) + ' more'));
      }
    }

    if (extracted.links.length > 0) {
      console.log(colorizer.section('Links (' + extracted.links.length + ')'));
      extracted.links.slice(0, 10).forEach(link => {
        console.log(colorizer.bullet(link.text));
        console.log(colorizer.dim('    ' + link.url));
      });
      if (extracted.links.length > 10) {
        console.log(colorizer.dim('  ... and ' + (extracted.links.length - 10) + ' more'));
      }
    }

    if (extracted.images.length > 0) {
      console.log(colorizer.section('Images (' + extracted.images.length + ')'));
      extracted.images.slice(0, 5).forEach(img => {
        console.log(colorizer.bullet(img.alt));
        console.log(colorizer.dim('    ' + img.url));
      });
      if (extracted.images.length > 5) {
        console.log(colorizer.dim('  ... and ' + (extracted.images.length - 5) + ' more'));
      }
    }

    if (extracted.forms.length > 0) {
      console.log(colorizer.section('Forms (' + extracted.forms.length + ')'));
      extracted.forms.forEach(form => {
        console.log(colorizer.bullet(colorizer.yellow(form.method) + ' -> ' + form.action));
      });
    }

    if (extracted.scripts.length > 0) {
      console.log(colorizer.section('External Scripts (' + extracted.scripts.length + ')'));
      extracted.scripts.slice(0, 5).forEach(script => {
        console.log(colorizer.bullet(script));
      });
      if (extracted.scripts.length > 5) {
        console.log(colorizer.dim('  ... and ' + (extracted.scripts.length - 5) + ' more'));
      }
    }

    console.log(colorizer.section('Text Preview'));
    console.log(colorizer.dim(extracted.text));
    console.log();
  },

  scrapeLinks(args) {
    const url = args[0];
    
    if (!url) {
      console.log(colorizer.error('Usage: scrape-links <url>\n'));
      return Promise.resolve();
    }

    console.log(colorizer.header('Link Extractor'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('URL: ') + colorizer.bright(url) + '\n');

    return this.fetchURL(url)
      .then(data => {
        const links = this.extractLinks(data.body, url);
        
        console.log(colorizer.success('Found ' + links.length + ' links\n'));
        
        links.forEach((link, i) => {
          console.log(colorizer.numbered(i + 1, link.text));
          console.log(colorizer.dim('   ' + link.url));
        });
        console.log();
        
        return links;
      })
      .catch(err => {
        console.log(colorizer.error('Failed to extract links: ' + err.message + '\n'));
      });
  },

  scrapeImages(args) {
    const url = args[0];
    
    if (!url) {
      console.log(colorizer.error('Usage: scrape-images <url>\n'));
      return Promise.resolve();
    }

    console.log(colorizer.header('Image Extractor'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('URL: ') + colorizer.bright(url) + '\n');

    return this.fetchURL(url)
      .then(data => {
        const images = this.extractImages(data.body, url);
        
        console.log(colorizer.success('Found ' + images.length + ' images\n'));
        
        images.forEach((img, i) => {
          console.log(colorizer.numbered(i + 1, img.alt));
          console.log(colorizer.dim('   ' + img.url));
        });
        console.log();
        
        return images;
      })
      .catch(err => {
        console.log(colorizer.error('Failed to extract images: ' + err.message + '\n'));
      });
  },

  exportScrape(args) {
    const url = args[0];
    const filename = args[1] || 'scrape-' + Date.now() + '.json';
    
    if (!url) {
      console.log(colorizer.error('Usage: export-scrape <url> [filename]\n'));
      return Promise.resolve();
    }

    return this.fetchURL(url)
      .then(data => {
        const extracted = this.extractContent(data.body, url);
        
        const report = {
          url: url,
          timestamp: new Date().toISOString(),
          statusCode: data.statusCode,
          headers: data.headers,
          content: extracted
        };

        return fs.writeFile(filename, JSON.stringify(report, null, 2));
      })
      .then(() => {
        console.log(colorizer.success('Scrape data exported to: ' + filename + '\n'));
      })
      .catch(err => {
        console.log(colorizer.error('Export failed: ' + err.message + '\n'));
      });
  },

  analyzeSecurityHeaders(args) {
    const url = args[0];
    
    if (!url) {
      console.log(colorizer.error('Usage: analyze-headers <url>\n'));
      return Promise.resolve();
    }

    console.log(colorizer.header('Security Headers Analysis'));
    console.log(colorizer.separator());
    console.log(colorizer.cyan('URL: ') + colorizer.bright(url) + '\n');

    return this.fetchURL(url)
      .then(data => {
        const headers = data.headers;
        
        const securityHeaders = {
          'strict-transport-security': { present: !!headers['strict-transport-security'], severity: 'HIGH' },
          'content-security-policy': { present: !!headers['content-security-policy'], severity: 'HIGH' },
          'x-frame-options': { present: !!headers['x-frame-options'], severity: 'MEDIUM' },
          'x-content-type-options': { present: !!headers['x-content-type-options'], severity: 'MEDIUM' },
          'x-xss-protection': { present: !!headers['x-xss-protection'], severity: 'LOW' },
          'referrer-policy': { present: !!headers['referrer-policy'], severity: 'LOW' }
        };

        console.log(colorizer.section('Security Headers Status'));
        
        Object.entries(securityHeaders).forEach(([header, info]) => {
          const status = info.present ? colorizer.green('PRESENT') : colorizer.red('MISSING');
          const severity = info.severity;
          console.log(colorizer.bullet(header + ': ' + status + ' (' + severity + ')'));
          if (info.present && headers[header]) {
            console.log(colorizer.dim('    Value: ' + headers[header]));
          }
        });

        const missingCount = Object.values(securityHeaders).filter(h => !h.present).length;
        const score = Math.floor(((6 - missingCount) / 6) * 100);

        console.log(colorizer.section('Security Score: ' + 
          (score >= 80 ? colorizer.green(score) :
           score >= 50 ? colorizer.yellow(score) :
           colorizer.red(score)) + '/100'));
        console.log();
      })
      .catch(err => {
        console.log(colorizer.error('Analysis failed: ' + err.message + '\n'));
      });
  }
};

module.exports = WebScraper;