const fs = require('fs');
const path = require('path');
const colorizer = require('../utils/colorizer');

/**
 * Payment Data Security Auditor
 * 
 * PURPOSE: Security auditing and compliance testing
 * - Scans JSON files for exposed payment card data
 * - Validates format of card numbers and routing numbers
 * - Generates security reports for PCI DSS compliance
 * - Educational tool for understanding payment data structures
 * 
 * DISCLAIMER: For legitimate security testing only.
 * Do NOT use with stolen or unauthorized payment data.
 */

class PaymentDataAuditor {
  constructor() {
    this.name = 'Payment Data Security Auditor';
    this.version = '1.0.0';
    
    // Official test card numbers for reference
    this.testCards = {
      visa: ['4242424242424242', '4000056655665556'],
      mastercard: ['5555555555554444', '2223003122003222'],
      amex: ['378282246310005', '371449635398431'],
      discover: ['6011111111111117', '6011000990139424'],
      dinersclub: ['3056930009020004', '36227206271667'],
      jcb: ['3566002020360505', '3566111111111113']
    };

    // BIN ranges for card identification (first 6 digits)
    this.binRanges = {
      visa: /^4[0-9]{5}/,
      mastercard: /^(5[1-5][0-9]{4}|222[1-9][0-9]{2}|22[3-9][0-9]{3}|2[3-6][0-9]{4}|27[01][0-9]{3}|2720[0-9]{2})/,
      amex: /^3[47][0-9]{4}/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{2}/,
      dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{3}/,
      jcb: /^(?:2131|1800|35[0-9]{2})[0-9]{2}/,
      unionpay: /^62[0-9]{4}/
    };
  }

  /**
   * Luhn Algorithm - validates card number checksum
   */
  validateLuhn(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    // Loop through digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Identify card type from BIN (Bank Identification Number)
   */
  identifyCardType(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    const bin = digits.substring(0, 6);

    for (const [type, pattern] of Object.entries(this.binRanges)) {
      if (pattern.test(bin)) {
        return type.toUpperCase();
      }
    }

    return 'UNKNOWN';
  }

  /**
   * Validate ABA Routing Number (US Bank Routing)
   */
  validateRoutingNumber(routing) {
    const digits = routing.replace(/\D/g, '');

    if (digits.length !== 9) {
      return false;
    }

    // ABA routing number checksum algorithm
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i], 10) * weights[i];
    }

    return sum % 10 === 0;
  }

  /**
   * Check if a card is a known test card
   */
  isTestCard(cardNumber) {
    const clean = cardNumber.replace(/\D/g, '');
    
    for (const testCardList of Object.values(this.testCards)) {
      if (testCardList.includes(clean)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Analyze JSON file for payment data exposure
   */
  async analyzeFile(args) {
    if (!args || args.length === 0) {
      console.log(colorizer.error('Usage: analyze-payment-data <json-file>'));
      console.log(colorizer.info('Example: analyze-payment-data data.json'));
      return;
    }

    const filePath = args[0];

    if (!fs.existsSync(filePath)) {
      console.log(colorizer.error('File not found: ' + filePath));
      return;
    }

    try {
      console.log(colorizer.section('Payment Data Security Audit'));
      console.log(colorizer.cyan('File: ') + filePath);
      console.log();

      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);

      const results = this.scanObject(data);

      this.displayResults(results);
      this.displayRecommendations(results);

    } catch (err) {
      console.log(colorizer.error('Error analyzing file: ' + err.message));
    }
  }

  /**
   * Recursively scan object for payment data
   */
  scanObject(obj, path = '', results = null) {
    if (!results) {
      results = {
        cardsFound: [],
        routingFound: [],
        accountsFound: [],
        exposedPaths: [],
        securityIssues: []
      };
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.scanObject(item, `${path}[${index}]`, results);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;

        // Check if this might be payment data based on key names
        const keyLower = key.toLowerCase();
        const isSensitiveKey = 
          keyLower.includes('card') ||
          keyLower.includes('credit') ||
          keyLower.includes('routing') ||
          keyLower.includes('account') ||
          keyLower.includes('payment') ||
          keyLower.includes('bank');

        if (typeof value === 'string' || typeof value === 'number') {
          const stringValue = String(value).replace(/\D/g, '');

          // Check for card numbers (13-19 digits)
          if (stringValue.length >= 13 && stringValue.length <= 19) {
            if (this.validateLuhn(stringValue)) {
              const cardType = this.identifyCardType(stringValue);
              const isTest = this.isTestCard(stringValue);

              results.cardsFound.push({
                path: currentPath,
                type: cardType,
                masked: this.maskCard(stringValue),
                isTestCard: isTest,
                length: stringValue.length
              });

              if (!isTest) {
                results.securityIssues.push({
                  severity: 'CRITICAL',
                  type: 'EXPOSED_CARD',
                  path: currentPath,
                  message: 'Real credit card data detected'
                });
              }

              results.exposedPaths.push(currentPath);
            }
          }

          // Check for routing numbers (9 digits)
          if (stringValue.length === 9 && this.validateRoutingNumber(stringValue)) {
            results.routingFound.push({
              path: currentPath,
              masked: this.maskRouting(stringValue)
            });

            results.securityIssues.push({
              severity: 'HIGH',
              type: 'EXPOSED_ROUTING',
              path: currentPath,
              message: 'Bank routing number detected'
            });

            results.exposedPaths.push(currentPath);
          }

          // Check for bank account numbers (typically 8-17 digits)
          if (isSensitiveKey && stringValue.length >= 8 && stringValue.length <= 17) {
            if (!this.validateLuhn(stringValue)) { // Not a card number
              results.accountsFound.push({
                path: currentPath,
                masked: this.maskAccount(stringValue),
                length: stringValue.length
              });

              results.securityIssues.push({
                severity: 'HIGH',
                type: 'EXPOSED_ACCOUNT',
                path: currentPath,
                message: 'Potential bank account number detected'
              });

              results.exposedPaths.push(currentPath);
            }
          }
        } else if (typeof value === 'object') {
          this.scanObject(value, currentPath, results);
        }
      }
    }

    return results;
  }

  /**
   * Display audit results
   */
  displayResults(results) {
    console.log(colorizer.section('AUDIT RESULTS'));
    console.log();

    // Credit Cards
    if (results.cardsFound.length > 0) {
      console.log(colorizer.warning('⚠️  Credit Cards Detected: ' + results.cardsFound.length));
      results.cardsFound.forEach((card, i) => {
        const status = card.isTestCard ? 
          colorizer.green('[TEST CARD]') : 
          colorizer.red('[REAL CARD - SECURITY RISK]');
        
        console.log(colorizer.dim(`  ${i + 1}. ${card.path}`));
        console.log(colorizer.cyan('     Type: ') + card.type + ' ' + status);
        console.log(colorizer.cyan('     Number: ') + card.masked);
        console.log();
      });
    } else {
      console.log(colorizer.green('✓ No credit card numbers detected'));
      console.log();
    }

    // Routing Numbers
    if (results.routingFound.length > 0) {
      console.log(colorizer.warning('⚠️  Routing Numbers Detected: ' + results.routingFound.length));
      results.routingFound.forEach((routing, i) => {
        console.log(colorizer.dim(`  ${i + 1}. ${routing.path}`));
        console.log(colorizer.cyan('     Number: ') + routing.masked);
        console.log();
      });
    } else {
      console.log(colorizer.green('✓ No routing numbers detected'));
      console.log();
    }

    // Account Numbers
    if (results.accountsFound.length > 0) {
      console.log(colorizer.warning('⚠️  Account Numbers Detected: ' + results.accountsFound.length));
      results.accountsFound.forEach((account, i) => {
        console.log(colorizer.dim(`  ${i + 1}. ${account.path}`));
        console.log(colorizer.cyan('     Number: ') + account.masked);
        console.log();
      });
    } else {
      console.log(colorizer.green('✓ No account numbers detected'));
      console.log();
    }
  }

  /**
   * Display security recommendations
   */
  displayRecommendations(results) {
    if (results.securityIssues.length === 0) {
      console.log(colorizer.section('SECURITY STATUS'));
      console.log(colorizer.green('✓ No sensitive payment data detected'));
      console.log(colorizer.green('✓ File appears to be PCI DSS compliant'));
      console.log();
      return;
    }

    console.log(colorizer.section('SECURITY ISSUES FOUND'));
    console.log();

    const critical = results.securityIssues.filter(i => i.severity === 'CRITICAL');
    const high = results.securityIssues.filter(i => i.severity === 'HIGH');

    if (critical.length > 0) {
      console.log(colorizer.red('🚨 CRITICAL ISSUES: ' + critical.length));
      critical.forEach((issue, i) => {
        console.log(colorizer.red(`  ${i + 1}. ${issue.message}`));
        console.log(colorizer.dim(`     Location: ${issue.path}`));
      });
      console.log();
    }

    if (high.length > 0) {
      console.log(colorizer.warning('⚠️  HIGH PRIORITY ISSUES: ' + high.length));
      high.forEach((issue, i) => {
        console.log(colorizer.warning(`  ${i + 1}. ${issue.message}`));
        console.log(colorizer.dim(`     Location: ${issue.path}`));
      });
      console.log();
    }

    console.log(colorizer.section('RECOMMENDATIONS'));
    console.log(colorizer.cyan('  1. Remove all real payment data from this file immediately'));
    console.log(colorizer.cyan('  2. Use tokenization or encryption for sensitive data'));
    console.log(colorizer.cyan('  3. Replace real data with official test cards (see show-test-cards)'));
    console.log(colorizer.cyan('  4. Review PCI DSS compliance requirements'));
    console.log(colorizer.cyan('  5. Implement proper data masking in logs and databases'));
    console.log();

    console.log(colorizer.info('For PCI DSS compliance, visit: https://www.pcisecuritystandards.org'));
    console.log();
  }

  /**
   * Mask credit card number
   */
  maskCard(cardNumber) {
    if (cardNumber.length <= 4) return cardNumber;
    const last4 = cardNumber.slice(-4);
    const masked = '*'.repeat(cardNumber.length - 4);
    return masked + last4;
  }

  /**
   * Mask routing number
   */
  maskRouting(routing) {
    if (routing.length !== 9) return routing;
    return '*****' + routing.slice(-4);
  }

  /**
   * Mask account number
   */
  maskAccount(account) {
    if (account.length <= 4) return account;
    return '****' + account.slice(-4);
  }

  /**
   * Show official test cards
   */
  showTestCards() {
    console.log(colorizer.section('Official Test Card Numbers'));
    console.log(colorizer.info('Use these for development and testing'));
    console.log();

    Object.entries(this.testCards).forEach(([type, cards]) => {
      console.log(colorizer.cyan(type.toUpperCase() + ':'));
      cards.forEach(card => {
        const formatted = card.match(/.{1,4}/g).join(' ');
        console.log(colorizer.dim('  ' + formatted));
      });
      console.log();
    });

    console.log(colorizer.info('Sources:'));
    console.log(colorizer.dim('  • Stripe: https://stripe.com/docs/testing'));
    console.log(colorizer.dim('  • PayPal: https://developer.paypal.com/tools/sandbox/card-testing/'));
    console.log();
  }

  /**
   * Explain Luhn algorithm
   */
  explainAlgorithm() {
    console.log(colorizer.section('Card Validation Algorithms'));
    console.log();

    console.log(colorizer.cyan('LUHN ALGORITHM (Mod 10):'));
    console.log(colorizer.dim('Used to validate credit card numbers'));
    console.log();
    console.log(colorizer.dim('Steps:'));
    console.log(colorizer.dim('  1. Start from the rightmost digit'));
    console.log(colorizer.dim('  2. Double every second digit'));
    console.log(colorizer.dim('  3. If doubled value > 9, subtract 9'));
    console.log(colorizer.dim('  4. Sum all digits'));
    console.log(colorizer.dim('  5. If sum % 10 = 0, card is valid'));
    console.log();

    console.log(colorizer.cyan('Example: 4242 4242 4242 4242'));
    console.log(colorizer.dim('  4 2 4 2 4 2 4 2 4 2 4 2 4 2 4 2'));
    console.log(colorizer.dim('  × ✓ × ✓ × ✓ × ✓ × ✓ × ✓ × ✓ × ✓'));
    console.log(colorizer.dim('  8 2 8 2 8 2 8 2 8 2 8 2 8 2 8 2 = 80'));
    console.log(colorizer.dim('  80 % 10 = 0 ✓ VALID'));
    console.log();

    console.log(colorizer.cyan('ABA ROUTING NUMBER VALIDATION:'));
    console.log(colorizer.dim('Used for US bank routing numbers'));
    console.log();
    console.log(colorizer.dim('Steps:'));
    console.log(colorizer.dim('  1. Must be exactly 9 digits'));
    console.log(colorizer.dim('  2. Multiply digits by weights [3,7,1,3,7,1,3,7,1]'));
    console.log(colorizer.dim('  3. Sum all products'));
    console.log(colorizer.dim('  4. If sum % 10 = 0, routing number is valid'));
    console.log();
  }

  /**
   * Show help
   */
  showHelp() {
    console.log(colorizer.section('Payment Data Security Auditor - Help'));
    console.log();
    console.log(colorizer.cyan('Commands:'));
    console.log(colorizer.bullet('analyze-payment-data <file>   - Scan JSON file for payment data'));
    console.log(colorizer.bullet('show-test-cards               - Show official test card numbers'));
    console.log(colorizer.bullet('explain-algorithm             - Explain validation algorithms'));
    console.log();
    console.log(colorizer.cyan('Purpose:'));
    console.log(colorizer.dim('  • Security auditing and PCI DSS compliance testing'));
    console.log(colorizer.dim('  • Detect exposed payment data in logs/files'));
    console.log(colorizer.dim('  • Educational tool for payment data structures'));
    console.log();
    console.log(colorizer.warning('⚠️  IMPORTANT:'));
    console.log(colorizer.dim('  • For legitimate security testing only'));
    console.log(colorizer.dim('  • Do NOT use with stolen or unauthorized data'));
    console.log(colorizer.dim('  • Always use official test cards for development'));
    console.log();
  }
}

module.exports = PaymentDataAuditor;