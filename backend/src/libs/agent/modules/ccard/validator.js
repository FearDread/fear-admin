const fs = require('fs');
const path = require('path');
const colorizer = require('../utils/colorizer');

/**
 * Card Validator Module
 * Educational module for validating and analyzing payment card numbers
 * DOES NOT GENERATE REAL CARD NUMBERS - For security testing education only
 */
class CardValidator {
  constructor() {
    this.name = 'Card Validator';
    
    // BIN (Bank Identification Number) database for card type detection
    this.binRanges = {
      visa: {
        name: 'Visa',
        prefixes: ['4'],
        lengths: [13, 16, 19],
        cvvLength: 3
      },
      mastercard: {
        name: 'Mastercard',
        prefixes: ['51', '52', '53', '54', '55', '2221-2720'],
        lengths: [16],
        cvvLength: 3
      },
      amex: {
        name: 'American Express',
        prefixes: ['34', '37'],
        lengths: [15],
        cvvLength: 4
      },
      discover: {
        name: 'Discover',
        prefixes: ['6011', '622126-622925', '644', '645', '646', '647', '648', '649', '65'],
        lengths: [16, 19],
        cvvLength: 3
      },
      dinersclub: {
        name: 'Diners Club',
        prefixes: ['300', '301', '302', '303', '304', '305', '36', '38'],
        lengths: [14, 16],
        cvvLength: 3
      },
      jcb: {
        name: 'JCB',
        prefixes: ['3528-3589'],
        lengths: [16, 19],
        cvvLength: 3
      },
      unionpay: {
        name: 'UnionPay',
        prefixes: ['62'],
        lengths: [16, 17, 18, 19],
        cvvLength: 3
      },
      maestro: {
        name: 'Maestro',
        prefixes: ['5018', '5020', '5038', '5893', '6304', '6759', '6761', '6762', '6763'],
        lengths: [12, 13, 14, 15, 16, 17, 18, 19],
        cvvLength: 3
      }
    };

    // Test card numbers from official payment processor documentation
    this.testCards = {
      stripe: [
        { number: '4242424242424242', type: 'Visa', description: 'Stripe test card - succeeds' },
        { number: '4000056655665556', type: 'Visa (debit)', description: 'Stripe test card - succeeds' },
        { number: '5555555555554444', type: 'Mastercard', description: 'Stripe test card - succeeds' },
        { number: '378282246310005', type: 'Amex', description: 'Stripe test card - succeeds' }
      ],
      paypal: [
        { number: '4111111111111111', type: 'Visa', description: 'PayPal test card' },
        { number: '5555555555554444', type: 'Mastercard', description: 'PayPal test card' }
      ]
    };
  }

  /**
   * Luhn Algorithm (Mod 10) - Used to validate card numbers
   */
  luhnCheck(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    // Process digits from right to left
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
   * Detect card type from number
   */
  detectCardType(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    
    for (const [key, card] of Object.entries(this.binRanges)) {
      for (const prefix of card.prefixes) {
        if (prefix.includes('-')) {
          // Handle ranges like "2221-2720"
          const [start, end] = prefix.split('-').map(Number);
          const cardPrefix = parseInt(digits.substring(0, start.toString().length), 10);
          if (cardPrefix >= start && cardPrefix <= end) {
            return { type: key, ...card };
          }
        } else {
          if (digits.startsWith(prefix)) {
            return { type: key, ...card };
          }
        }
      }
    }
    
    return { type: 'unknown', name: 'Unknown', prefixes: [], lengths: [], cvvLength: 3 };
  }

  /**
   * Validate a card number
   */
  validateCard(args) {
    if (args.length === 0) {
      console.log(colorizer.error('Usage: validate-card <card-number>'));
      console.log(colorizer.info('Example: validate-card 4242424242424242'));
      return Promise.resolve();
    }

    const cardNumber = args.join('').replace(/\s/g, '');
    const digits = cardNumber.replace(/\D/g, '');

    console.log(colorizer.section('Card Number Validation'));
    console.log(colorizer.cyan('  Card Number: ') + colorizer.dim(this.formatCardNumber(digits)));
    console.log();

    // Detect card type
    const cardType = this.detectCardType(digits);
    console.log(colorizer.cyan('  Card Type: ') + colorizer.bright(cardType.name));
    
    // Check length
    const lengthValid = cardType.lengths.includes(digits.length);
    const lengthStatus = lengthValid ? colorizer.green('✓ Valid') : colorizer.red('✗ Invalid');
    console.log(colorizer.cyan('  Length: ') + digits.length + ' ' + lengthStatus);
    
    if (!lengthValid && cardType.lengths.length > 0) {
      console.log(colorizer.dim('    Expected: ' + cardType.lengths.join(', ') + ' digits'));
    }

    // Luhn check
    const luhnValid = this.luhnCheck(digits);
    const luhnStatus = luhnValid ? colorizer.green('✓ Valid') : colorizer.red('✗ Invalid');
    console.log(colorizer.cyan('  Luhn Check: ') + luhnStatus);

    // Overall validation
    const isValid = lengthValid && luhnValid && cardType.type !== 'unknown';
    console.log();
    console.log(colorizer.cyan('  Overall Status: ') + 
      (isValid ? colorizer.green('✓ VALID FORMAT') : colorizer.red('✗ INVALID')));

    // Check if it's a known test card
    const testCard = this.findTestCard(digits);
    if (testCard) {
      console.log();
      console.log(colorizer.yellow('  ⚠ This is a known test card:'));
      console.log(colorizer.dim('    ' + testCard.description));
    }

    console.log();
    console.log(colorizer.warning('Note: This only validates format. Does not verify if card is active or has funds.'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Batch validate multiple cards
   */
  validateBatch(args) {
    if (args.length === 0) {
      console.log(colorizer.error('Usage: validate-batch <file.txt>'));
      console.log(colorizer.info('File should contain one card number per line'));
      return Promise.resolve();
    }

    const filePath = args[0];
    
    if (!fs.existsSync(filePath)) {
      console.log(colorizer.error('File not found: ' + filePath));
      return Promise.resolve();
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const cards = content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    console.log(colorizer.section('Batch Card Validation'));
    console.log(colorizer.dim('Processing ' + cards.length + ' card numbers...'));
    console.log();

    const results = {
      valid: 0,
      invalid: 0,
      details: []
    };

    cards.forEach((cardNumber, index) => {
      const digits = cardNumber.replace(/\D/g, '');
      const cardType = this.detectCardType(digits);
      const lengthValid = cardType.lengths.includes(digits.length);
      const luhnValid = this.luhnCheck(digits);
      const isValid = lengthValid && luhnValid && cardType.type !== 'unknown';

      if (isValid) results.valid++;
      else results.invalid++;

      results.details.push({
        number: this.maskCardNumber(digits),
        type: cardType.name,
        valid: isValid,
        luhn: luhnValid,
        length: lengthValid
      });

      const status = isValid ? colorizer.green('✓') : colorizer.red('✗');
      console.log(colorizer.numbered(index + 1, 
        status + ' ' + this.maskCardNumber(digits) + ' - ' + colorizer.dim(cardType.name)));
    });

    console.log();
    console.log(colorizer.cyan('Summary:'));
    console.log(colorizer.green('  Valid: ' + results.valid));
    console.log(colorizer.red('  Invalid: ' + results.invalid));
    console.log(colorizer.cyan('  Total: ' + cards.length));
    console.log();

    return Promise.resolve();
  }

  /**
   * Analyze BIN (Bank Identification Number)
   */
  analyzeBIN(args) {
    if (args.length === 0) {
      console.log(colorizer.error('Usage: analyze-bin <bin-number>'));
      console.log(colorizer.info('Example: analyze-bin 424242'));
      console.log(colorizer.dim('BIN is typically the first 6-8 digits of a card number'));
      return Promise.resolve();
    }

    const bin = args[0].replace(/\D/g, '');
    
    if (bin.length < 4) {
      console.log(colorizer.error('BIN must be at least 4 digits'));
      return Promise.resolve();
    }

    console.log(colorizer.section('BIN Analysis'));
    console.log(colorizer.cyan('  BIN: ') + colorizer.bright(bin));
    console.log();

    // Detect card type from BIN
    const cardType = this.detectCardType(bin + '0000000000');
    
    console.log(colorizer.cyan('  Card Network: ') + colorizer.bright(cardType.name));
    console.log(colorizer.cyan('  Valid Lengths: ') + cardType.lengths.join(', ') + ' digits');
    console.log(colorizer.cyan('  CVV Length: ') + cardType.cvvLength + ' digits');
    console.log();

    console.log(colorizer.dim('BIN Information:'));
    console.log(colorizer.dim('  • First digit: ' + bin[0] + ' - Major Industry Identifier (MII)'));
    
    const miiMap = {
      '0': 'ISO/TC 68 and other future industry assignments',
      '1': 'Airlines',
      '2': 'Airlines and other future industry assignments',
      '3': 'Travel and entertainment',
      '4': 'Banking and financial',
      '5': 'Banking and financial',
      '6': 'Merchandising and banking/financial',
      '7': 'Petroleum and other future industry assignments',
      '8': 'Healthcare, telecommunications and other future industry assignments',
      '9': 'National assignment'
    };
    
    console.log(colorizer.dim('    ' + (miiMap[bin[0]] || 'Unknown')));
    console.log(colorizer.dim('  • First 6 digits: Bank Identification Number (BIN)'));
    console.log(colorizer.dim('  • Identifies the institution that issued the card'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Show test cards from various payment processors
   */
  showTestCards(args) {
    console.log(colorizer.section('Official Test Card Numbers'));
    console.log(colorizer.warning('These cards are for testing ONLY and will not work in production'));
    console.log();

    Object.entries(this.testCards).forEach(([processor, cards]) => {
      console.log(colorizer.cyan(processor.toUpperCase() + ' Test Cards:'));
      cards.forEach(card => {
        console.log(colorizer.bullet(
          colorizer.bright(this.formatCardNumber(card.number)) + 
          ' - ' + card.type
        ));
        console.log(colorizer.dim('    ' + card.description));
      });
      console.log();
    });

    console.log(colorizer.info('Always use official test cards provided by your payment processor'));
    console.log(colorizer.dim('• Stripe: https://stripe.com/docs/testing'));
    console.log(colorizer.dim('• PayPal: https://developer.paypal.com/tools/sandbox/card-testing/'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Explain card validation algorithms
   */
  explainAlgorithm(args) {
    console.log(colorizer.section('Card Validation Algorithms'));
    console.log();

    console.log(colorizer.cyan('1. Luhn Algorithm (Mod 10 Check)'));
    console.log(colorizer.dim('   Used to validate card numbers and detect typos'));
    console.log();
    console.log(colorizer.dim('   How it works:'));
    console.log(colorizer.dim('   a) Start from the rightmost digit (check digit)'));
    console.log(colorizer.dim('   b) Moving left, double every second digit'));
    console.log(colorizer.dim('   c) If doubling results in > 9, subtract 9'));
    console.log(colorizer.dim('   d) Sum all digits'));
    console.log(colorizer.dim('   e) If sum % 10 = 0, the number is valid'));
    console.log();

    console.log(colorizer.cyan('   Example: 4242 4242 4242 4242'));
    console.log(colorizer.dim('   4 2 4 2 4 2 4 2 4 2 4 2 4 2 4 2'));
    console.log(colorizer.dim('   × 2   × 2   × 2   × 2   × 2   × 2   × 2   ×'));
    console.log(colorizer.dim('   8 2 8 2 8 2 8 2 8 2 8 2 8 2 8 2'));
    console.log(colorizer.dim('   Sum: 8+2+8+2+8+2+8+2+8+2+8+2+8+2+8+2 = 80'));
    console.log(colorizer.dim('   80 % 10 = 0 → Valid! ✓'));
    console.log();

    console.log(colorizer.cyan('2. BIN Validation'));
    console.log(colorizer.dim('   • First 6-8 digits identify the issuing institution'));
    console.log(colorizer.dim('   • First digit (MII) identifies the industry'));
    console.log(colorizer.dim('   • Different card types have specific BIN ranges'));
    console.log();

    console.log(colorizer.cyan('3. Length Validation'));
    console.log(colorizer.dim('   • Visa: 13, 16, or 19 digits'));
    console.log(colorizer.dim('   • Mastercard: 16 digits'));
    console.log(colorizer.dim('   • American Express: 15 digits'));
    console.log(colorizer.dim('   • Discover: 16 or 19 digits'));
    console.log();

    console.log(colorizer.cyan('4. CVV/CVC Validation'));
    console.log(colorizer.dim('   • Most cards: 3 digits on back'));
    console.log(colorizer.dim('   • American Express: 4 digits on front'));
    console.log(colorizer.dim('   • Never stored after authorization (PCI DSS)'));
    console.log();

    console.log(colorizer.info('Security Note:'));
    console.log(colorizer.warning('These algorithms only validate FORMAT, not if a card is:'));
    console.log(colorizer.dim('  • Actually issued and active'));
    console.log(colorizer.dim('  • Has sufficient funds'));
    console.log(colorizer.dim('  • Authorized for the transaction'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Generate educational report on card security
   */
  securityReport(args) {
    const outputFile = args[0] || 'card-security-report.txt';
    
    console.log(colorizer.section('Generating Card Security Report'));
    console.log();

    const report = this.generateSecurityReport();
    
    fs.writeFileSync(outputFile, report);
    
    console.log(colorizer.green('✓ Report saved to: ' + outputFile));
    console.log(colorizer.dim('  Lines: ' + report.split('\n').length));
    console.log(colorizer.dim('  Size: ' + (report.length / 1024).toFixed(2) + ' KB'));
    console.log();

    return Promise.resolve();
  }

  /**
   * Helper: Generate security report content
   */
  generateSecurityReport() {
    const date = new Date().toISOString().split('T')[0];
    
    return `
PAYMENT CARD SECURITY REPORT
Generated: ${date}
=============================================================================

1. CARD NUMBER STRUCTURE
   
   A payment card number consists of:
   - IIN/BIN (Issuer Identification Number): First 6-8 digits
   - Account Number: Middle digits
   - Check Digit: Last digit (calculated using Luhn algorithm)

2. VALIDATION METHODS

   a) Luhn Algorithm (Mod 10)
      - Industry standard since 1960s
      - Detects single-digit errors and most transpositions
      - Does NOT validate if card is real or active
      
   b) BIN Database Validation
      - Verifies card type matches expected patterns
      - Checks if BIN is from a known issuer
      
   c) Length Validation
      - Different card types have specific lengths
      - Visa: 13, 16, or 19 digits
      - Mastercard: 16 digits
      - Amex: 15 digits

3. SECURITY STANDARDS

   PCI DSS (Payment Card Industry Data Security Standard):
   - Never store CVV/CVC after authorization
   - Encrypt cardholder data in transit and at rest
   - Mask PAN (Primary Account Number) when displayed
   - Implement strong access controls
   - Regular security testing and monitoring

4. COMMON VULNERABILITIES

   a) Card Testing/Carding
      - Automated testing of card numbers
      - Prevention: Rate limiting, CAPTCHA, fraud detection
      
   b) BIN Attacks
      - Using valid BINs to generate card numbers
      - Prevention: Velocity checks, device fingerprinting
      
   c) Man-in-the-Middle
      - Intercepting card data in transit
      - Prevention: TLS/SSL encryption, tokenization
      
   d) SQL Injection
      - Extracting card data from databases
      - Prevention: Parameterized queries, input validation

5. BEST PRACTICES FOR DEVELOPERS

   a) Never Store Sensitive Data
      - Don't store CVV/CVC
      - Don't store magnetic stripe data
      - Use tokenization when possible
      
   b) Use Payment Processors
      - Stripe, PayPal, Square handle PCI compliance
      - Reduces your compliance scope
      - Better fraud protection
      
   c) Implement Proper Validation
      - Client-side: Luhn check, format validation
      - Server-side: Full validation, fraud checks
      - Never trust client-side validation alone
      
   d) Use Test Cards for Development
      - Official test cards from payment processors
      - Never use real card numbers in development
      - Implement test/production environment separation

6. TESTING GUIDELINES

   Approved Testing Methods:
   - Use official test cards from processors
   - Stripe: 4242 4242 4242 4242
   - PayPal: 4111 1111 1111 1111
   - Test in sandbox/test environments only
   
   NEVER:
   - Generate random card numbers for testing
   - Use real card numbers in test environments
   - Test against production payment systems
   - Share or expose test credentials

7. REGULATORY COMPLIANCE

   Key Regulations:
   - PCI DSS: Payment card security standards
   - GDPR: Data protection (EU)
   - CCPA: Consumer privacy (California)
   - SOX: Financial reporting accuracy
   
   Requirements:
   - Annual security audits
   - Vulnerability scanning
   - Penetration testing
   - Incident response plans
   - Employee security training

8. FRAUD PREVENTION TECHNIQUES

   a) Address Verification Service (AVS)
      - Matches billing address with card issuer
      
   b) CVV Verification
      - Ensures card is physically present
      
   c) 3D Secure (3DS)
      - Two-factor authentication for online payments
      - Verified by Visa, Mastercard SecureCode
      
   d) Device Fingerprinting
      - Tracks device characteristics
      - Identifies suspicious patterns
      
   e) Machine Learning
      - Behavioral analysis
      - Anomaly detection
      - Real-time risk scoring

9. INCIDENT RESPONSE

   If Card Data is Compromised:
   1. Immediately notify payment processor
   2. Contact law enforcement
   3. Preserve forensic evidence
   4. Notify affected cardholders
   5. Conduct security audit
   6. Implement corrective measures
   7. Document incident and response

10. RESOURCES

    Standards & Documentation:
    - PCI Security Standards Council: www.pcisecuritystandards.org
    - OWASP Payment Testing: owasp.org
    
    Payment Processor Documentation:
    - Stripe: stripe.com/docs/security
    - PayPal: developer.paypal.com/docs/security
    - Square: squareup.com/us/en/developers/security
    
    Security Testing:
    - OWASP ZAP: zaproxy.org
    - Burp Suite: portswigger.net
    - Metasploit: metasploit.com

=============================================================================
END OF REPORT

DISCLAIMER: This report is for educational purposes only. Always follow
your payment processor's guidelines and comply with PCI DSS requirements.
`;
  }

  /**
   * Helper: Format card number for display
   */
  formatCardNumber(number) {
    const digits = number.replace(/\D/g, '');
    const cardType = this.detectCardType(digits);
    
    // American Express: 4-6-5 format
    if (cardType.type === 'amex') {
      return digits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    
    // Most cards: 4-4-4-4 format
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  }

  /**
   * Helper: Mask card number for security
   */
  maskCardNumber(number) {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 8) return '****';
    
    const first4 = digits.substring(0, 4);
    const last4 = digits.substring(digits.length - 4);
    const masked = '*'.repeat(digits.length - 8);
    
    return first4 + masked + last4;
  }

  /**
   * Helper: Find if card is a known test card
   */
  findTestCard(number) {
    const digits = number.replace(/\D/g, '');
    
    for (const processor of Object.values(this.testCards)) {
      for (const card of processor) {
        if (card.number === digits) {
          return card;
        }
      }
    }
    
    return null;
  }
}

module.exports = CardValidator;