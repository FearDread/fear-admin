const https = require('https');
const fs = require('fs');
const path = require('path');
const colorizer = require('../utils/colorizer');

/**
 * Crypto Exchange Rate Checker
 * Fetches and compares cryptocurrency exchange rates across multiple platforms
 */
class CryptoExchangeChecker {
  constructor() {
    this.name = 'Crypto Exchange Checker';
    this.cache = {
      rates: {},
      timestamp: null,
      ttl: 60000 // Cache for 1 minute
    };

    // Major cryptocurrency exchanges APIs
    this.exchanges = {
      coinbase: {
        name: 'Coinbase',
        apiUrl: 'api.coinbase.com',
        path: '/v2/exchange-rates?currency=',
        parseRate: (data, targetCurrency) => {
          if (data.data && data.data.rates && data.data.rates[targetCurrency]) {
            return parseFloat(data.data.rates[targetCurrency]);
          }
          return null;
        }
      },
      kraken: {
        name: 'Kraken',
        apiUrl: 'api.kraken.com',
        path: '/0/public/Ticker?pair=',
        pairFormat: (base, quote) => `${base}${quote}`,
        parseRate: (data) => {
          if (data.result) {
            const pair = Object.keys(data.result)[0];
            if (pair && data.result[pair] && data.result[pair].c) {
              return parseFloat(data.result[pair].c[0]);
            }
          }
          return null;
        }
      },
      binance: {
        name: 'Binance',
        apiUrl: 'api.binance.com',
        path: '/api/v3/ticker/price?symbol=',
        pairFormat: (base, quote) => `${base}${quote}`,
        parseRate: (data) => {
          if (data.price) {
            return parseFloat(data.price);
          }
          return null;
        }
      }
    };

    // Popular cryptocurrencies
    this.cryptos = {
      BTC: { name: 'Bitcoin', symbol: 'BTC' },
      ETH: { name: 'Ethereum', symbol: 'ETH' },
      USDT: { name: 'Tether', symbol: 'USDT' },
      BNB: { name: 'Binance Coin', symbol: 'BNB' },
      XRP: { name: 'Ripple', symbol: 'XRP' },
      ADA: { name: 'Cardano', symbol: 'ADA' },
      DOGE: { name: 'Dogecoin', symbol: 'DOGE' },
      SOL: { name: 'Solana', symbol: 'SOL' },
      DOT: { name: 'Polkadot', symbol: 'DOT' },
      MATIC: { name: 'Polygon', symbol: 'MATIC' }
    };

    // Fiat currencies
    this.fiatCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  }

  /**
   * Make HTTPS request
   */
  httpsRequest(hostname, path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: hostname,
        path: path,
        method: 'GET',
        headers: {
          'User-Agent': 'SecurityAgent/2.3',
          'Accept': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(new Error('Failed to parse JSON response'));
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Fetch rate from Coinbase
   */
  async fetchCoinbaseRate(baseCurrency, targetCurrency) {
    try {
      const exchange = this.exchanges.coinbase;
      const path = exchange.path + baseCurrency;
      const data = await this.httpsRequest(exchange.apiUrl, path);
      return exchange.parseRate(data, targetCurrency);
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetch rate from Kraken
   */
  async fetchKrakenRate(baseCurrency, targetCurrency) {
    try {
      const exchange = this.exchanges.kraken;
      const pair = exchange.pairFormat(baseCurrency, targetCurrency);
      const path = exchange.path + pair;
      const data = await this.httpsRequest(exchange.apiUrl, path);
      return exchange.parseRate(data);
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetch rate from Binance
   */
  async fetchBinanceRate(baseCurrency, targetCurrency) {
    try {
      const exchange = this.exchanges.binance;
      const pair = exchange.pairFormat(baseCurrency, targetCurrency);
      const path = exchange.path + pair;
      const data = await this.httpsRequest(exchange.apiUrl, path);
      return exchange.parseRate(data);
    } catch (err) {
      return null;
    }
  }

  /**
   * Check if cache is valid
   */
  isCacheValid() {
    if (!this.cache.timestamp) return false;
    return (Date.now() - this.cache.timestamp) < this.cache.ttl;
  }

  /**
   * Compare rates across exchanges
   */
  async compareRates(args) {
    if (args.length < 2) {
      console.log(colorizer.error('Usage: compare-rates <crypto> <fiat>'));
      console.log(colorizer.info('Example: compare-rates BTC USD'));
      console.log(colorizer.dim('Supported cryptos: ' + Object.keys(this.cryptos).join(', ')));
      console.log(colorizer.dim('Supported fiat: ' + this.fiatCurrencies.join(', ')));
      return Promise.resolve();
    }

    const crypto = args[0].toUpperCase();
    const fiat = args[1].toUpperCase();

    if (!this.cryptos[crypto]) {
      console.log(colorizer.error('Unsupported cryptocurrency: ' + crypto));
      console.log(colorizer.info('Supported: ' + Object.keys(this.cryptos).join(', ')));
      return Promise.resolve();
    }

    if (!this.fiatCurrencies.includes(fiat)) {
      console.log(colorizer.error('Unsupported fiat currency: ' + fiat));
      console.log(colorizer.info('Supported: ' + this.fiatCurrencies.join(', ')));
      return Promise.resolve();
    }

    console.log(colorizer.section(`Comparing ${crypto}/${fiat} Exchange Rates`));
    console.log(colorizer.dim('Fetching rates from multiple exchanges...'));
    console.log();

    const rates = {};

    // Fetch from Coinbase
    process.stdout.write(colorizer.dim('  Coinbase... '));
    rates.coinbase = await this.fetchCoinbaseRate(crypto, fiat);
    console.log(rates.coinbase ? colorizer.green('✓') : colorizer.red('✗'));

    // Fetch from Kraken
    process.stdout.write(colorizer.dim('  Kraken... '));
    rates.kraken = await this.fetchKrakenRate(crypto, fiat);
    console.log(rates.kraken ? colorizer.green('✓') : colorizer.red('✗'));

    // Fetch from Binance
    process.stdout.write(colorizer.dim('  Binance... '));
    rates.binance = await this.fetchBinanceRate(crypto, fiat);
    console.log(rates.binance ? colorizer.green('✓') : colorizer.red('✗'));

    console.log();

    // Display results
    const validRates = Object.entries(rates)
      .filter(([_, rate]) => rate !== null)
      .sort(([_, a], [__, b]) => a - b); // Sort by rate (best to worst for selling)

    if (validRates.length === 0) {
      console.log(colorizer.error('Failed to fetch rates from any exchange'));
      console.log(colorizer.dim('This may be due to API rate limits or unsupported pair'));
      return Promise.resolve();
    }

    console.log(colorizer.cyan('Exchange Rates:'));
    validRates.forEach(([exchange, rate], index) => {
      const exchangeName = this.exchanges[exchange].name;
      const badge = index === 0 ? colorizer.green(' [BEST BUY]') : 
                    index === validRates.length - 1 ? colorizer.yellow(' [BEST SELL]') : '';
      
      console.log(colorizer.bullet(
        exchangeName.padEnd(15) + 
        colorizer.bright(this.formatPrice(rate, fiat)) +
        badge
      ));
    });

    // Calculate spread
    if (validRates.length > 1) {
      const lowest = validRates[0][1];
      const highest = validRates[validRates.length - 1][1];
      const spread = highest - lowest;
      const spreadPercent = ((spread / lowest) * 100).toFixed(2);

      console.log();
      console.log(colorizer.cyan('Arbitrage Opportunity:'));
      console.log(colorizer.bullet('Spread: ' + this.formatPrice(spread, fiat) + 
                  ' (' + spreadPercent + '%)'));
      
      if (spreadPercent > 1) {
        console.log(colorizer.yellow('  ⚠ Significant price difference detected!'));
      }
    }

    // Calculate average
    const average = validRates.reduce((sum, [_, rate]) => sum + rate, 0) / validRates.length;
    console.log();
    console.log(colorizer.cyan('Average Rate: ') + colorizer.bright(this.formatPrice(average, fiat)));
    console.log();
    console.log(colorizer.dim('Note: Rates are indicative and may not reflect actual trading fees'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Get current price for a cryptocurrency
   */
  async getPrice(args) {
    if (args.length === 0) {
      console.log(colorizer.error('Usage: crypto-price <symbol> [fiat]'));
      console.log(colorizer.info('Example: crypto-price BTC USD'));
      console.log(colorizer.dim('Supported cryptos: ' + Object.keys(this.cryptos).join(', ')));
      return Promise.resolve();
    }

    const crypto = args[0].toUpperCase();
    const fiat = (args[1] || 'USD').toUpperCase();

    if (!this.cryptos[crypto]) {
      console.log(colorizer.error('Unsupported cryptocurrency: ' + crypto));
      return Promise.resolve();
    }

    console.log(colorizer.section(`${this.cryptos[crypto].name} (${crypto}) Price`));
    console.log(colorizer.dim('Fetching current price...'));
    console.log();

    const rate = await this.fetchCoinbaseRate(crypto, fiat);

    if (rate) {
      console.log(colorizer.cyan('Current Price: ') + 
                  colorizer.bright(colorizer.green(this.formatPrice(rate, fiat))));
      console.log(colorizer.dim('Source: Coinbase'));
    } else {
      console.log(colorizer.error('Failed to fetch price'));
    }

    console.log();
    return Promise.resolve();
  }

  /**
   * Track multiple cryptocurrencies
   */
  async trackPortfolio(args) {
    const cryptoList = args.length > 0 ? 
      args.map(c => c.toUpperCase()) : 
      ['BTC', 'ETH', 'BNB', 'XRP', 'ADA'];

    console.log(colorizer.section('Cryptocurrency Portfolio Tracker'));
    console.log(colorizer.dim('Tracking: ' + cryptoList.join(', ')));
    console.log();

    const results = [];

    for (const crypto of cryptoList) {
      if (!this.cryptos[crypto]) {
        console.log(colorizer.warning(`Skipping unsupported: ${crypto}`));
        continue;
      }

      process.stdout.write(colorizer.dim(`  Fetching ${crypto}... `));
      const rate = await this.fetchCoinbaseRate(crypto, 'USD');
      
      if (rate) {
        results.push({ crypto, rate });
        console.log(colorizer.green('✓'));
      } else {
        console.log(colorizer.red('✗'));
      }
    }

    console.log();
    console.log(colorizer.cyan('Current Prices (USD):'));
    
    results.forEach(({ crypto, rate }) => {
      const name = this.cryptos[crypto].name;
      console.log(colorizer.bullet(
        crypto.padEnd(8) + 
        name.padEnd(20) + 
        colorizer.bright(this.formatPrice(rate, 'USD'))
      ));
    });

    console.log();
    return Promise.resolve();
  }

  /**
   * Calculate conversion between cryptocurrencies
   */
  async convert(args) {
    if (args.length < 3) {
      console.log(colorizer.error('Usage: crypto-convert <amount> <from> <to>'));
      console.log(colorizer.info('Example: crypto-convert 1 BTC ETH'));
      return Promise.resolve();
    }

    const amount = parseFloat(args[0]);
    const fromCrypto = args[1].toUpperCase();
    const toCrypto = args[2].toUpperCase();

    if (isNaN(amount) || amount <= 0) {
      console.log(colorizer.error('Invalid amount'));
      return Promise.resolve();
    }

    if (!this.cryptos[fromCrypto] || !this.cryptos[toCrypto]) {
      console.log(colorizer.error('Unsupported cryptocurrency'));
      return Promise.resolve();
    }

    console.log(colorizer.section('Crypto Conversion'));
    console.log(colorizer.dim('Calculating conversion rate...'));
    console.log();

    // Convert through USD as intermediate
    const fromRate = await this.fetchCoinbaseRate(fromCrypto, 'USD');
    const toRate = await this.fetchCoinbaseRate(toCrypto, 'USD');

    if (!fromRate || !toRate) {
      console.log(colorizer.error('Failed to fetch conversion rates'));
      return Promise.resolve();
    }

    const usdValue = amount * fromRate;
    const convertedAmount = usdValue / toRate;

    console.log(colorizer.cyan('Conversion:'));
    console.log(colorizer.bullet(
      colorizer.bright(amount.toFixed(8)) + ' ' + fromCrypto + 
      ' → ' + 
      colorizer.bright(convertedAmount.toFixed(8)) + ' ' + toCrypto
    ));
    console.log();
    console.log(colorizer.dim('USD Equivalent: ' + this.formatPrice(usdValue, 'USD')));
    console.log(colorizer.dim('Source: Coinbase'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Show market summary
   */
  async marketSummary(args) {
    console.log(colorizer.section('Cryptocurrency Market Summary'));
    console.log(colorizer.dim('Top cryptocurrencies by market cap'));
    console.log();

    const topCryptos = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'ADA', 'DOGE', 'SOL'];
    const rates = [];

    for (const crypto of topCryptos) {
      const rate = await this.fetchCoinbaseRate(crypto, 'USD');
      if (rate) {
        rates.push({ crypto, rate });
      }
    }

    console.log(colorizer.cyan('Current Prices (USD):'));
    console.log(colorizer.dim('─'.repeat(60)));
    console.log(colorizer.dim(
      'Symbol'.padEnd(10) + 
      'Name'.padEnd(20) + 
      'Price'.padEnd(20)
    ));
    console.log(colorizer.dim('─'.repeat(60)));

    rates.forEach(({ crypto, rate }) => {
      const name = this.cryptos[crypto].name;
      console.log(
        colorizer.bright(crypto.padEnd(10)) + 
        name.padEnd(20) + 
        colorizer.green(this.formatPrice(rate, 'USD').padEnd(20))
      );
    });

    console.log(colorizer.dim('─'.repeat(60)));
    console.log();
    console.log(colorizer.dim('Data source: Coinbase'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Export rates to file
   */
  async exportRates(args) {
    const outputFile = args[0] || 'crypto-rates.json';
    
    console.log(colorizer.section('Exporting Cryptocurrency Rates'));
    console.log(colorizer.dim('Fetching rates...'));
    console.log();

    const data = {
      timestamp: new Date().toISOString(),
      rates: {}
    };

    for (const crypto of Object.keys(this.cryptos)) {
      const rate = await this.fetchCoinbaseRate(crypto, 'USD');
      if (rate) {
        data.rates[crypto] = {
          name: this.cryptos[crypto].name,
          usd: rate
        };
      }
    }

    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

    console.log(colorizer.green('✓ Rates exported to: ' + outputFile));
    console.log(colorizer.dim('  Cryptocurrencies: ' + Object.keys(data.rates).length));
    console.log(colorizer.dim('  Timestamp: ' + data.timestamp));
    console.log();

    return Promise.resolve();
  }

  /**
   * Show help for crypto commands
   */
  showHelp(args) {
    console.log(colorizer.section('Crypto Exchange Checker - Help'));
    console.log();

    const commands = [
      { cmd: 'compare-rates', desc: 'Compare rates across exchanges', example: 'compare-rates BTC USD' },
      { cmd: 'crypto-price', desc: 'Get current price for a crypto', example: 'crypto-price ETH' },
      { cmd: 'track-portfolio', desc: 'Track multiple cryptocurrencies', example: 'track-portfolio BTC ETH XRP' },
      { cmd: 'crypto-convert', desc: 'Convert between cryptocurrencies', example: 'crypto-convert 1 BTC ETH' },
      { cmd: 'market-summary', desc: 'Show market summary', example: 'market-summary' },
      { cmd: 'export-rates', desc: 'Export rates to JSON file', example: 'export-rates rates.json' }
    ];

    console.log(colorizer.cyan('Available Commands:'));
    commands.forEach(({ cmd, desc, example }) => {
      console.log(colorizer.bullet(colorizer.bright(cmd)));
      console.log(colorizer.dim('    ' + desc));
      console.log(colorizer.dim('    Example: ' + example));
      console.log();
    });

    console.log(colorizer.cyan('Supported Cryptocurrencies:'));
    Object.entries(this.cryptos).forEach(([symbol, info]) => {
      console.log(colorizer.dim('  ' + symbol + ' - ' + info.name));
    });

    console.log();
    console.log(colorizer.cyan('Supported Exchanges:'));
    Object.entries(this.exchanges).forEach(([key, exchange]) => {
      console.log(colorizer.dim('  ' + exchange.name));
    });

    console.log();
    console.log(colorizer.warning('Note: Rates are indicative and exclude trading fees'));
    console.log(colorizer.dim('Always verify rates on the actual exchange before trading'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Helper: Format price with currency symbol
   */
  formatPrice(price, currency) {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$'
    };

    const symbol = symbols[currency] || currency + ' ';
    
    if (price >= 1000) {
      return symbol + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return symbol + price.toFixed(2);
    } else if (price >= 0.01) {
      return symbol + price.toFixed(4);
    } else {
      return symbol + price.toFixed(8);
    }
  }
}

module.exports = CryptoExchangeChecker;