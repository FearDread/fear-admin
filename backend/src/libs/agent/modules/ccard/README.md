# Card Status Checker Module

## Overview
The Card Status Checker module verifies if credit cards are active/issued by performing authorization checks with payment processors. It integrates seamlessly with the Security AI Agent framework.

---

## 📦 Installation

### 1. Install Required Dependencies

```bash
# For Stripe support
npm install stripe

# For PayPal support
npm install @paypal/checkout-server-sdk

# For Authorize.Net support
npm install authorizenet
```

### 2. Place Module File
Save `card-status.js` to:
```
./modules/security/card-status.js
```

### 3. Update Agent Configuration
The module is already integrated in the updated `agent.js` file with these commands:
- `check-card-status`
- `check-card-batch`
- `configure-card-checker`
- `card-checker-help`

---

## 🔧 Configuration

### Method 1: Environment Variables (Recommended)

```bash
# Stripe
export STRIPE_SECRET_KEY="sk_test_your_key_here"
export STRIPE_TEST_MODE="true"

# PayPal
export PAYPAL_CLIENT_ID="your_client_id"
export PAYPAL_CLIENT_SECRET="your_client_secret"
export PAYPAL_TEST_MODE="true"

# Authorize.Net
export AUTHORIZENET_API_LOGIN="your_api_login"
export AUTHORIZENET_TRANSACTION_KEY="your_transaction_key"
export AUTHORIZENET_TEST_MODE="true"
```

### Method 2: Configuration File

Create `config/payment-processors.json`:

```json
{
  "stripe": {
    "secretKey": "sk_test_your_key_here",
    "testMode": true
  },
  "paypal": {
    "clientId": "your_client_id",
    "clientSecret": "your_client_secret",
    "testMode": true
  },
  "authorizenet": {
    "apiLogin": "your_api_login",
    "transactionKey": "your_transaction_key",
    "testMode": true
  }
}
```

### Method 3: Interactive Configuration

```bash
# Configure Stripe
configure-card-checker stripe sk_test_your_key_here

# Configure Authorize.Net
configure-card-checker authorizenet your_api_login your_transaction_key

# Set mode (test or live)
configure-card-checker mode test

# View current configuration
configure-card-checker
```

---

## 🚀 Usage Examples

### Check Single Card Status

```bash
# Using Stripe (default)
check-card-status 4242424242424242

# Using specific provider
check-card-status 4242424242424242 stripe
check-card-status 4242424242424242 authorizenet
```

**Output:**
```
══════════════════════════════════════════════════════
Card Status Check
══════════════════════════════════════════════════════
Card: 4242****4242
Provider: STRIPE
Mode: TEST

══════════════════════════════════════════════════════
Result
══════════════════════════════════════════════════════
Status: ACTIVE
Message: Card is active and valid
Card Brand: visa
Last 4: 4242
Funding: credit
Country: US
```

### Batch Check Multiple Cards

Create a file `cards.txt`:
```
4242424242424242
4000000000000002
5555555555554444
378282246310005
```

Run batch check:
```bash
check-card-batch cards.txt stripe
```

**Output:**
```
══════════════════════════════════════════════════════
Batch Card Status Check
══════════════════════════════════════════════════════
Cards to check: 4
Provider: STRIPE

[1/4] Checking 4242****4242...
[2/4] Checking 4000****0002...
[3/4] Checking 5555****4444...
[4/4] Checking 3782****0005...

══════════════════════════════════════════════════════
Batch Results Summary
══════════════════════════════════════════════════════
Total Cards: 4
Active: 2
Declined: 1
Expired: 0
Invalid: 0
Errors: 1

══════════════════════════════════════════════════════
Individual Results
══════════════════════════════════════════════════════
  1. ✓ 4242****4242 - active - Card is active and valid
  2. ✗ 4000****0002 - declined - Card was declined by issuer
  3. ✓ 5555****4444 - active - Card is active and valid
  4. ✗ 3782****0005 - error - Processing error occurred

Results exported to: card-status-2025-10-26T15-30-45.json
```

### View Help

```bash
card-checker-help
```

---

## 🧪 Test Cards

### Stripe Test Cards

| Card Number | Brand | Status | Use Case |
|------------|-------|--------|----------|
| 4242424242424242 | Visa | Success | Valid, active card |
| 4000000000000002 | Visa | Declined | Generic decline |
| 4000000000009995 | Visa | Declined | Insufficient funds |
| 4000000000009987 | Visa | Declined | Lost card |
| 4000000000009979 | Visa | Declined | Stolen card |
| 4000000000000069 | Visa | Declined | Expired card |
| 4000000000000127 | Visa | Active | Incorrect CVC |
| 5555555555554444 | Mastercard | Success | Valid card |
| 378282246310005 | Amex | Success | Valid card |
| 6011111111111117 | Discover | Success | Valid card |

### Authorize.Net Test Cards

| Card Number | Brand | Status |
|------------|-------|--------|
| 4007000000027 | Visa | Success |
| 4012888818888 | Visa | Success |
| 5424000000000015 | Mastercard | Success |
| 370000000000002 | Amex | Success |

---

## 🔒 Security Best Practices

### ⚠️ CRITICAL SECURITY REQUIREMENTS

1. **PCI DSS Compliance**
   - This module handles sensitive payment data
   - Production use requires PCI DSS Level 1 compliance
   - Use tokenization whenever possible

2. **Always Use Test Mode for Development**
   ```bash
   configure-card-checker mode test
   ```

3. **Never Log or Store Full Card Numbers**
   - Module automatically masks card numbers in logs
   - Export files contain masked data only

4. **Implement Rate Limiting**
   - Module includes 1-second delay between batch checks
   - Payment processors have strict rate limits
   - Monitor API usage to avoid blocks

5. **Use Environment Variables**
   - Never commit API keys to version control
   - Use `.env` files with `.gitignore`
   - Rotate keys regularly

6. **Secure API Keys**
   ```bash
   # Set restrictive permissions
   chmod 600 config/payment-processors.json
   
   # Use key management services in production
   # AWS Secrets Manager, HashiCorp Vault, etc.
   ```

7. **Fraud Detection**
   - Monitor for unusual patterns
   - Implement CAPTCHA for web interfaces
   - Log all verification attempts
   - Set up alerts for suspicious activity

---

## 📊 Response Status Codes

| Status | Description | Action |
|--------|-------------|--------|
| `active` | Card is valid and active | ✅ Proceed with transaction |
| `declined` | Card declined by issuer | ❌ Request different payment method |
| `expired` | Card has expired | ⚠️ Request updated card |
| `invalid` | Invalid card format/number | ❌ Check card number |
| `error` | Processing error occurred | 🔄 Retry or check configuration |
| `unknown` | Cannot determine status | ⚠️ Manual review required |
| `info` | Informational response | ℹ️ Read message |

---

## 🔌 API Integration Details

### Stripe Integration
- Uses **Payment Methods API** for card verification
- Creates **Setup Intent** for zero-dollar authorization
- Provides detailed card metadata (brand, country, funding type)
- Best for: Direct card verification without merchant account

### Authorize.Net Integration
- Uses **AUTH_ONLY** transaction type with $0.00 amount
- Returns transaction ID for tracking
- Requires active merchant account
- Best for: Traditional merchant card verification

### PayPal Integration
- Limited standalone verification support
- Requires transaction context (order/payment)
- Best for: PayPal-specific workflows

---

## 🐛 Troubleshooting

### "Provider not configured" Error
```bash
# Check configuration
configure-card-checker

# Set up provider
configure-card-checker stripe sk_test_your_key
```

### "Module not available" Error
```bash
# Install missing dependencies
npm install stripe authorizenet @paypal/checkout-server-sdk
```

### Rate Limit Errors
```bash
# Reduce batch size
# Increase delay between requests
# Contact provider to increase limits
```

### SSL/TLS Errors
```bash
# Update Node.js to latest LTS version
# Check system certificates
# Verify network connectivity
```

### Invalid Card Format
```bash
# Remove spaces and dashes
# Ensure 13-19 digits
# Verify Luhn checksum
```

---

## 📈 Advanced Features

### Custom Timeout Configuration
```javascript
// In card-status.js constructor
this.config = {
  testMode: true,
  timeout: 15000,  // 15 seconds
  retryAttempts: 3
};
```

### Webhook Integration
```javascript
// Listen for payment processor webhooks
// Update card status in real-time
// Implement in your web application
```

### Database Integration
```javascript
// Store verification results
// Track card history
// Implement fraud scoring
```

---

## 🔗 Useful Resources

### Documentation
- [Stripe API Docs](https://stripe.com/docs/api)
- [Authorize.Net Docs](https://developer.authorize.net/)
- [PayPal Docs](https://developer.paypal.com/docs/)

### Compliance
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [PCI SAQ (Self-Assessment)](https://www.pcisecuritystandards.org/document_library/)

### Testing
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Authorize.Net Test Guide](https://developer.authorize.net/hello_world/testing_guide/)

---

## 💡 Example Workflows

### E-Commerce Card Validation
```bash
# 1. Check format first (fast, free)
validate-card 4242424242424242

# 2. Verify with payment processor
check-card-status 4242424242424242 stripe

# 3. If active, proceed with transaction
```

### Bulk Card Database Cleanup
```bash
# 1. Export cards from database to file
# 2. Run batch verification
check-card-batch expired_cards.txt stripe

# 3. Review results
# 4. Update database based on status
```

### Fraud Detection Pipeline
```bash
# 1. Check suspicious cards
check-card-status 4000000000000002 stripe

# 2. Analyze BIN for fraud patterns
analyze-bin 400000

# 3. Generate security report
card-security-report suspicious_cards.txt
```

---

## 📝 License & Legal

**IMPORTANT DISCLAIMERS:**

1. This module is for **authorized testing only**
2. Requires proper **agreements with payment processors**
3. Must comply with **PCI DSS** in production
4. Not for **carding or fraudulent activity**
5. User assumes **all legal responsibility**

**Recommended Use Cases:**
- ✅ Validating customer payment methods
- ✅ Testing payment integration
- ✅ Fraud prevention systems
- ✅ Card-on-file verification
- ✅ Subscription management
- ❌ Unauthorized card testing
- ❌ Card number harvesting
- ❌ Fraud or illegal activity

---

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Run `card-checker-help` for command help
3. Enable debug mode: `DEBUG=1 node agent.js`
4. Review payment processor documentation
5. Contact your payment processor support

---

**Version:** 1.0.0  
**Last Updated:** October 26, 2025  
**Author:** Security AI Agent Team