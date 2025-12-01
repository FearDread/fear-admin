const colorizer = require('../utils/colorizer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Card Status Checker Module
 * Tests if credit cards are active/issued by performing authorization checks
 * with payment processors (Stripe, PayPal, Authorize.net, etc.)
 * 
 * IMPORTANT: This module requires PCI DSS compliance and proper API credentials.
 * Only use in authorized testing environments.
 */
class CardStatusChecker {
    constructor() {
        this.providers = {
            stripe: null,
            paypal: null,
            authorizenet: null,
            braintree: null
        };

        this.config = {
            testMode: true, // Always start in test mode
            timeout: 10000,
            retryAttempts: 2
        };

        this.loadConfiguration();
    }

    /**
     * Load API credentials from environment or config file
     */
    async loadConfiguration() {
        try {
            // Try to load from config file
            const configPath = path.join(process.cwd(), 'config', 'payment-processors.json');
            const configData = await fs.readFile(configPath, 'utf8');
            const config = JSON.parse(configData);

            if (config.stripe) {
                this.initializeStripe(config.stripe);
            }
            if (config.paypal) {
                this.initializePayPal(config.paypal);
            }
            if (config.authorizenet) {
                this.initializeAuthorizeNet(config.authorizenet);
            }
        } catch (err) {
            // Fall back to environment variables
            this.loadFromEnvironment();
        }
    }

    /**
     * Load credentials from environment variables
     */
    loadFromEnvironment() {
        if (process.env.STRIPE_SECRET_KEY) {
            this.initializeStripe({
                secretKey: process.env.STRIPE_SECRET_KEY,
                testMode: process.env.STRIPE_TEST_MODE !== 'false'
            });
        }

        if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
            this.initializePayPal({
                clientId: process.env.PAYPAL_CLIENT_ID,
                clientSecret: process.env.PAYPAL_CLIENT_SECRET,
                testMode: process.env.PAYPAL_TEST_MODE !== 'false'
            });
        }

        if (process.env.AUTHORIZENET_API_LOGIN && process.env.AUTHORIZENET_TRANSACTION_KEY) {
            this.initializeAuthorizeNet({
                apiLogin: process.env.AUTHORIZENET_API_LOGIN,
                transactionKey: process.env.AUTHORIZENET_TRANSACTION_KEY,
                testMode: process.env.AUTHORIZENET_TEST_MODE !== 'false'
            });
        }
    }

    /**
     * Initialize Stripe API
     */
    initializeStripe(config) {
        try {
            const stripe = require('stripe')(config.secretKey);
            this.providers.stripe = {
                client: stripe,
                testMode: config.testMode
            };
            console.log(colorizer.success('Stripe initialized in ' + (config.testMode ? 'TEST' : 'LIVE') + ' mode'));
        } catch (err) {
            console.log(colorizer.warning('Stripe SDK not available. Run: npm install stripe'));
        }
    }

    /**
     * Initialize PayPal API
     */
    initializePayPal(config) {
        try {
            const paypal = require('@paypal/checkout-server-sdk');
            const environment = config.testMode
                ? new paypal.core.SandboxEnvironment(config.clientId, config.clientSecret)
                : new paypal.core.LiveEnvironment(config.clientId, config.clientSecret);

            this.providers.paypal = {
                client: new paypal.core.PayPalHttpClient(environment),
                testMode: config.testMode
            };
            console.log(colorizer.success('PayPal initialized in ' + (config.testMode ? 'SANDBOX' : 'LIVE') + ' mode'));
        } catch (err) {
            console.log(colorizer.warning('PayPal SDK not available. Run: npm install @paypal/checkout-server-sdk'));
        }
    }

    /**
     * Initialize Authorize.Net API
     */
    initializeAuthorizeNet(config) {
        try {
            const ApiContracts = require('authorizenet').APIContracts;
            const ApiControllers = require('authorizenet').APIControllers;

            this.providers.authorizenet = {
                ApiContracts,
                ApiControllers,
                credentials: {
                    apiLogin: config.apiLogin,
                    transactionKey: config.transactionKey
                },
                testMode: config.testMode
            };
            console.log(colorizer.success('Authorize.Net initialized in ' + (config.testMode ? 'TEST' : 'LIVE') + ' mode'));
        } catch (err) {
            console.log(colorizer.warning('Authorize.Net SDK not available. Run: npm install authorizenet'));
        }
    }

    /**
     * Check card status using specified provider
     */
    async checkCardStatus(args) {
        const [cardNumber, provider = 'stripe'] = args;

        if (!cardNumber) {
            console.log(colorizer.error('Usage: check-card-status <card_number> [provider]'));
            console.log(colorizer.info('Providers: stripe, paypal, authorizenet'));
            return;
        }

        // Validate card number format
        if (!this.validateCardFormat(cardNumber)) {
            console.log(colorizer.error('Invalid card number format'));
            return;
        }

        console.log(colorizer.section('Card Status Check'));
        console.log(colorizer.cyan('Card: ') + this.maskCardNumber(cardNumber));
        console.log(colorizer.cyan('Provider: ') + provider.toUpperCase());
        console.log(colorizer.cyan('Mode: ') + (this.config.testMode ? 'TEST' : 'LIVE'));
        console.log();

        let result;
        const E = (err) => {
            console.log(colorizer.error('Status check failed: ' + err.message));
            if (process.env.DEBUG) {
                console.log(colorizer.dim(err.stack));
            }
        }

        switch (provider.toLowerCase()) {
            case 'stripe':
                await this.checkWithStripe(cardNumber)
                    .then(result => this.displayResult(result))
                    .catch(err => E(err))

                break;
            case 'paypal':
                result = await this.checkWithPayPal(cardNumber)
                    .then(result => this.displayResult(result))
                    .catch(err => E(err));
                break;
            case 'authorizenet':
                result = await this.checkWithAuthorizeNet(cardNumber)
                    .then(result => this.displayResult(result))
                    .catch(err => E(err));
                break;
            default:
                console.log(colorizer.error('Unknown provider: ' + provider));
                return;
        }
    }

    /**
     * Check card status using Stripe
     * Uses $0.00 authorization to verify card without charging
     */
    async checkWithStripe(cardNumber) {
        if (!this.providers.stripe) {
            throw new Error('Stripe not configured. Set STRIPE_SECRET_KEY environment variable.');
        }

        const stripe = this.providers.stripe.client;

        try {
            // Create a payment method to test the card
            const paymentMethod = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: cardNumber,
                    exp_month: 12,
                    exp_year: new Date().getFullYear() + 1,
                    cvc: '123'
                }
            });

            // If we got here, the card format is valid
            // Now try to create a setup intent to verify the card is active
            const setupIntent = await stripe.setupIntents.create({
                payment_method: paymentMethod.id,
                confirm: true,
                payment_method_types: ['card']
            });

            return {
                status: 'active',
                provider: 'Stripe',
                cardBrand: paymentMethod.card.brand,
                cardLast4: paymentMethod.card.last4,
                cardCountry: paymentMethod.card.country,
                funding: paymentMethod.card.funding,
                checks: {
                    cvcCheck: paymentMethod.card.checks?.cvc_check,
                    addressCheck: paymentMethod.card.checks?.address_line1_check,
                    zipCheck: paymentMethod.card.checks?.address_postal_code_check
                },
                message: 'Card is active and valid'
            };

        } catch (err) {
            return this.parseStripeError(err);
        }
    }

    /**
     * Parse Stripe error to determine card status
     */
    parseStripeError(err) {
        const code = err.code || err.type;

        const errorMap = {
            'card_declined': { status: 'declined', message: 'Card was declined by issuer' },
            'expired_card': { status: 'expired', message: 'Card has expired' },
            'incorrect_cvc': { status: 'active', message: 'Card exists but CVC incorrect' },
            'incorrect_number': { status: 'invalid', message: 'Card number is invalid' },
            'invalid_number': { status: 'invalid', message: 'Card number format is invalid' },
            'invalid_expiry_month': { status: 'invalid', message: 'Invalid expiry month' },
            'invalid_expiry_year': { status: 'invalid', message: 'Invalid expiry year' },
            'processing_error': { status: 'unknown', message: 'Processing error occurred' },
            'rate_limit': { status: 'unknown', message: 'Rate limit exceeded' }
        };

        const errorInfo = errorMap[code] || {
            status: 'error',
            message: err.message || 'Unknown error occurred'
        };

        return {
            ...errorInfo,
            provider: 'Stripe',
            errorCode: code
        };
    }

    /**
     * Check card status using PayPal
     */
    async checkWithPayPal(cardNumber) {
        if (!this.providers.paypal) {
            throw new Error('PayPal not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.');
        }

        // PayPal verification logic
        // Note: PayPal doesn't support direct card verification without a transaction
        return {
            status: 'info',
            provider: 'PayPal',
            message: 'PayPal requires a transaction context for card verification',
            suggestion: 'Use Stripe or Authorize.Net for standalone card verification'
        };
    }

    /**
     * Check card status using Authorize.Net
     */
    async checkWithAuthorizeNet(cardNumber) {
        if (!this.providers.authorizenet) {
            throw new Error('Authorize.Net not configured. Set AUTHORIZENET_API_LOGIN and AUTHORIZENET_TRANSACTION_KEY.');
        }

        const { ApiContracts, ApiControllers, credentials } = this.providers.authorizenet;

        return new Promise((resolve, reject) => {
            const merchantAuth = new ApiContracts.MerchantAuthenticationType();
            merchantAuth.setName(credentials.apiLogin);
            merchantAuth.setTransactionKey(credentials.transactionKey);

            const creditCard = new ApiContracts.CreditCardType();
            creditCard.setCardNumber(cardNumber);
            creditCard.setExpirationDate('1225'); // Use far future date

            const payment = new ApiContracts.PaymentType();
            payment.setCreditCard(creditCard);

            const transactionRequest = new ApiContracts.TransactionRequestType();
            transactionRequest.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHONLYTRANSACTION);
            transactionRequest.setPayment(payment);
            transactionRequest.setAmount(0.00); // Zero auth

            const request = new ApiContracts.CreateTransactionRequest();
            request.setMerchantAuthentication(merchantAuth);
            request.setTransactionRequest(transactionRequest);

            const ctrl = new ApiControllers.CreateTransactionController(request.getJSON());

            if (this.providers.authorizenet.testMode) {
                ctrl.setEnvironment('https://apitest.authorize.net/xml/v1/request.api');
            }

            ctrl.execute(() => {
                const response = ctrl.getResponse();
                const result = new ApiContracts.CreateTransactionResponse(response);

                if (result.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
                    resolve({
                        status: 'active',
                        provider: 'Authorize.Net',
                        message: 'Card is active and valid',
                        transactionId: result.getTransactionResponse().getTransId()
                    });
                } else {
                    const errors = result.getTransactionResponse().getErrors();
                    resolve({
                        status: 'declined',
                        provider: 'Authorize.Net',
                        message: errors ? errors.getError()[0].getErrorText() : 'Card declined',
                        errorCode: errors ? errors.getError()[0].getErrorCode() : 'unknown'
                    });
                }
            });
        });
    }

    /**
     * Batch check multiple cards
     */
    async checkBatch(args) {
        const [filePath, provider = 'stripe'] = args;

        if (!filePath) {
            console.log(colorizer.error('Usage: check-card-batch <file_path> [provider]'));
            console.log(colorizer.info('File should contain one card number per line'));
            return;
        }

        try {
            const content = await fs.readFile(filePath, 'utf8');
            const cards = content.split('\n').filter(line => line.trim());

            console.log(colorizer.section('Batch Card Status Check'));
            console.log(colorizer.cyan('Cards to check: ') + cards.length);
            console.log(colorizer.cyan('Provider: ') + provider.toUpperCase());
            console.log();

            const results = [];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i].trim();
                console.log(colorizer.dim(`[${i + 1}/${cards.length}] Checking ${this.maskCardNumber(card)}...`));

                try {
                    let result;
                    switch (provider.toLowerCase()) {
                        case 'stripe':
                            result = await this.checkWithStripe(card);
                            break;
                        case 'authorizenet':
                            result = await this.checkWithAuthorizeNet(card);
                            break;
                        default:
                            result = { status: 'error', message: 'Invalid provider' };
                    }

                    results.push({ card: this.maskCardNumber(card), ...result });

                    // Rate limiting delay
                    await this.delay(1000);

                } catch (err) {
                    results.push({
                        card: this.maskCardNumber(card),
                        status: 'error',
                        message: err.message
                    });
                }
            }

            console.log();
            this.displayBatchResults(results);

            // Offer to export
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const exportPath = `card-status-${timestamp}.json`;
            await fs.writeFile(exportPath, JSON.stringify(results, null, 2));
            console.log(colorizer.success(`Results exported to: ${exportPath}`));

        } catch (err) {
            console.log(colorizer.error('Batch check failed: ' + err.message));
        }
    }

    /**
     * Configure the module
     */
    async configure(args) {
        const [provider, ...credentials] = args;

        console.log(colorizer.section('Card Status Checker Configuration'));
        console.log();

        if (!provider) {
            this.showConfiguration();
            return;
        }

        switch (provider.toLowerCase()) {
            case 'stripe':
                if (credentials[0]) {
                    this.initializeStripe({ secretKey: credentials[0], testMode: true });
                    console.log(colorizer.success('Stripe configured successfully'));
                } else {
                    console.log(colorizer.error('Usage: configure-card-checker stripe <secret_key>'));
                }
                break;

            case 'authorizenet':
                if (credentials.length >= 2) {
                    this.initializeAuthorizeNet({
                        apiLogin: credentials[0],
                        transactionKey: credentials[1],
                        testMode: true
                    });
                    console.log(colorizer.success('Authorize.Net configured successfully'));
                } else {
                    console.log(colorizer.error('Usage: configure-card-checker authorizenet <api_login> <transaction_key>'));
                }
                break;

            case 'mode':
                this.config.testMode = credentials[0] === 'test';
                console.log(colorizer.success('Mode set to: ' + (this.config.testMode ? 'TEST' : 'LIVE')));
                break;

            default:
                console.log(colorizer.error('Unknown provider: ' + provider));
                console.log(colorizer.info('Supported providers: stripe, authorizenet'));
        }

        console.log();
    }

    /**
     * Show current configuration
     */
    showConfiguration() {
        console.log(colorizer.cyan('Current Configuration:'));
        console.log(colorizer.dim('  Mode: ') + (this.config.testMode ? 'TEST' : 'LIVE'));
        console.log();

        console.log(colorizer.cyan('Provider Status:'));
        Object.entries(this.providers).forEach(([name, config]) => {
            const status = config ? colorizer.green('✓ Configured') : colorizer.dim('✗ Not configured');
            console.log(colorizer.dim(`  ${name.padEnd(15)}: `) + status);
        });
        console.log();

        console.log(colorizer.cyan('Setup Commands:'));
        console.log(colorizer.dim('  configure-card-checker stripe <secret_key>'));
        console.log(colorizer.dim('  configure-card-checker authorizenet <api_login> <transaction_key>'));
        console.log(colorizer.dim('  configure-card-checker mode <test|live>'));
        console.log();

        console.log(colorizer.cyan('Environment Variables:'));
        console.log(colorizer.dim('  STRIPE_SECRET_KEY'));
        console.log(colorizer.dim('  PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET'));
        console.log(colorizer.dim('  AUTHORIZENET_API_LOGIN, AUTHORIZENET_TRANSACTION_KEY'));
        console.log();
    }

    /**
     * Show help information
     */
    showHelp() {
        console.log(colorizer.box('Card Status Checker - Help'));
        console.log();

        console.log(colorizer.section('COMMANDS'));
        console.log(colorizer.cyan('  check-card-status <number> [provider]'));
        console.log(colorizer.dim('    Check if a card is active with payment processor'));
        console.log();
        console.log(colorizer.cyan('  check-card-batch <file> [provider]'));
        console.log(colorizer.dim('    Batch check multiple cards from file'));
        console.log();
        console.log(colorizer.cyan('  configure-card-checker [provider] [credentials...]'));
        console.log(colorizer.dim('    Configure payment processor credentials'));
        console.log();
        console.log(colorizer.cyan('  card-checker-help'));
        console.log(colorizer.dim('    Show this help message'));
        console.log();

        console.log(colorizer.section('SUPPORTED PROVIDERS'));
        console.log(colorizer.dim('  • Stripe - Best for direct card verification'));
        console.log(colorizer.dim('  • Authorize.Net - Good for merchant verification'));
        console.log(colorizer.dim('  • PayPal - Limited standalone verification'));
        console.log();

        console.log(colorizer.section('SECURITY NOTES'));
        console.log(colorizer.warning('⚠ IMPORTANT: This module handles sensitive payment data'));
        console.log(colorizer.dim('  • Always use test mode for development'));
        console.log(colorizer.dim('  • Requires PCI DSS compliance in production'));
        console.log(colorizer.dim('  • Never log or store full card numbers'));
        console.log(colorizer.dim('  • Use tokenization when possible'));
        console.log(colorizer.dim('  • Implement rate limiting and fraud detection'));
        console.log();

        console.log(colorizer.section('TEST CARDS'));
        console.log(colorizer.dim('Stripe Test Cards:'));
        console.log(colorizer.dim('  4242424242424242 - Visa (Success)'));
        console.log(colorizer.dim('  4000000000000002 - Visa (Declined)'));
        console.log(colorizer.dim('  4000000000009995 - Visa (Insufficient Funds)'));
        console.log();

        return Promise.resolve();
    }

    /**
     * Display single check result
     */
    displayResult(result) {
        console.log(colorizer.section('Result'));

        const statusColor = {
            'active': colorizer.green,
            'declined': colorizer.red,
            'expired': colorizer.yellow,
            'invalid': colorizer.red,
            'error': colorizer.red,
            'unknown': colorizer.dim,
            'info': colorizer.cyan
        }[result.status] || colorizer.dim;

        console.log(colorizer.cyan('Status: ')); // + statusColor(result.status.toUpperCase()));
        console.log(colorizer.cyan('Message: ') + result.message);

        if (result.cardBrand) {
            console.log(colorizer.cyan('Card Brand: ') + result.cardBrand);
        }
        if (result.cardLast4) {
            console.log(colorizer.cyan('Last 4: ') + result.cardLast4);
        }
        if (result.funding) {
            console.log(colorizer.cyan('Funding: ') + result.funding);
        }
        if (result.cardCountry) {
            console.log(colorizer.cyan('Country: ') + result.cardCountry);
        }
        if (result.errorCode) {
            console.log(colorizer.cyan('Error Code: ') + result.errorCode);
        }

        console.log();
    }

    /**
     * Display batch results summary
     */
    displayBatchResults(results) {
        const summary = {
            total: results.length,
            active: results.filter(r => r.status === 'active').length,
            declined: results.filter(r => r.status === 'declined').length,
            expired: results.filter(r => r.status === 'expired').length,
            invalid: results.filter(r => r.status === 'invalid').length,
            error: results.filter(r => r.status === 'error').length
        };

        console.log(colorizer.section('Batch Results Summary'));
        console.log(colorizer.cyan('Total Cards: ') + summary.total);
        console.log(colorizer.green('Active: ') + summary.active);
        console.log(colorizer.red('Declined: ') + summary.declined);
        console.log(colorizer.yellow('Expired: ') + summary.expired);
        console.log(colorizer.red('Invalid: ') + summary.invalid);
        console.log(colorizer.dim('Errors: ') + summary.error);
        console.log();

        // Show individual results
        console.log(colorizer.section('Individual Results'));
        results.forEach((result, i) => {
            const statusIcon = {
                'active': '✓',
                'declined': '✗',
                'expired': '⚠',
                'invalid': '✗',
                'error': '✗'
            }[result.status] || '?';

            console.log(`${(i + 1).toString().padStart(3)}. ${statusIcon} ${result.card} - ${result.status} - ${result.message}`);
        });
        console.log();
    }

    /**
     * Validate card number format using Luhn algorithm
     */
    validateCardFormat(cardNumber) {
        const cleaned = cardNumber.replace(/\s|-/g, '');

        if (!/^\d{13,19}$/.test(cleaned)) {
            return false;
        }

        // Luhn algorithm
        let sum = 0;
        let isEven = false;

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i], 10);

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
     * Mask card number for display
     */
    maskCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s|-/g, '');
        if (cleaned.length < 8) return '****';
        return cleaned.slice(0, 4) + '****' + cleaned.slice(-4);
    }

    /**
     * Delay helper for rate limiting
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = CardStatusChecker;