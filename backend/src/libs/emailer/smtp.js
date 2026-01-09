const nodemailer = require("nodemailer");

module.exports = function ( fear ) {
    const _this = {};
    const logger = fear.getLogger();

    _this.mailConfig = fear.mailinfo || {};
    _this.mailService = fear.mailinfo.service || 'google';
    _this.transporter = null;

    if (!_this.transporter) {
        _this.transporter = nodemailer.createTransport(_this.mailConfig.smtp[_this.mailService]);
        
        Promise.resolve(_this.transporter.verify())
            .then(() => { logger.info('Mail transport setup complete.');})
            .catch((error) => { logger.error('Error loading mail transport :: ', error);})
    } 

    _this.templates = {
        baseTemplate(content, title = "Email") {
            `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 40px 30px;
        }
        .field {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .field:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .value {
            color: #333;
            font-size: 16px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .message-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
    </div>
</body>
</html>
        `},

        projectTemplate(data) {
            const { fullname, company, email, phone, budget, about } = data;

            const content = `
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">New Project Inquiry</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">You have received a new project submission</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Full Name</div>
                <div class="value">${fullname || 'Not provided'}</div>
            </div>
            <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${email}" style="color: #667eea;">${email}</a></div>
            </div>
            ${company ? `
            <div class="field">
                <div class="label">Company</div>
                <div class="value">${company}</div>
            </div>
            ` : ''}
            ${phone ? `
            <div class="field">
                <div class="label">Phone Number</div>
                <div class="value"><a href="tel:${phone}" style="color: #667eea;">${phone}</a></div>
            </div>
            ` : ''}
            ${budget ? `
            <div class="field">
                <div class="label">Budget</div>
                <div class="value">${budget}</div>
            </div>
            ` : ''}
            ${about ? `
            <div class="field">
                <div class="label">Project Details</div>
                <div class="message-box">${about.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
        </div>
        <div class="footer">
            <p style="margin: 0;">Received on ${new Date().toLocaleString()}</p>
        </div>
    `;

            return baseTemplate(content, "New Project Inquiry");
        },

        contactTemplate(data) {
            const { $email, $message, $name } = data;

            const content = `
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">New Contact Message</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">You have received a new message</p>
        </div>
        <div class="content">
            ${$name ? `
            <div class="field">
                <div class="label">Name</div>
                <div class="value">${$name}</div>
            </div>
            ` : ''}
            <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${$email}" style="color: #667eea;">${$email}</a></div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="message-box">${$message.replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        <div class="footer">
            <p style="margin: 0;">Received on ${new Date().toLocaleString()}</p>
        </div>
    `;

            return baseTemplate(content, "New Contact Message");
        },

        generatePlainText(data, type = 'contact') {
            if (type === 'project') {
                const { fullname, company, email, phone, budget, about } = data;
                return `
New Project Inquiry
===================

Full Name: ${fullname || 'Not provided'}
Email: ${email}
${company ? `Company: ${company}\n` : ''}${phone ? `Phone: ${phone}\n` : ''}${budget ? `Budget: ${budget}\n` : ''}
Project Details:
${about || 'No details provided'}

Received: ${new Date().toLocaleString()}
        `.trim();
            }

            // Contact form
            const { $email, $message, $name } = data;
            return `
New Contact Message
===================

${$name ? `Name: ${$name}\n` : ''}Email: ${$email}

Message:
${$message}

Received: ${new Date().toLocaleString()}
    `.trim();
        },
    };
    _this.isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    _this.validateEmailOptions = (options) => {
        const errors = [];

        if (!options.to) errors.push('Recipient email (to) is required');
        if (!options.subject) errors.push('Subject is required');
        if (!options.html && !options.text) errors.push('Email content (html or text) is required');

        if (options.to && !_this.isValidEmail(options.to)) {
            errors.push('Invalid recipient email address');
        }

        if (options.from && !_this.isValidEmail(options.from)) {
            errors.push('Invalid sender email address');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    _this.sendEmail = async (options) => {
        const validation = _this.validateEmailOptions(options);

        if (!validation.isValid) throw new Error(`Validation failed: ${validation.errors.join(', ')}`);

        // Ensure we have default from address
        const emailOptions = {
            from: _this.mailConfig.smtp[_this.mailService].auth.user,
            ...options
        };

        return _this.transporter.sendMail(emailOptions)
            .then((info) => {
                if ( !info.messageId ) {
                    logger.error('Error retrieving messageId :: ', info);
                }
                return { success: true, message: 'Email sent successfully', messageId: info.messageId }
            })
            .catch((error) => ({ success: false, message: error.message || 'Failed to send email', error: error }));
    }

    return {
        sendEmail: _this.sendEmail,
        async sendProjectEmail(data) {
            const { $subject, email } = data;

            if (!email || !_this.isValidEmail(email)) throw new Error('Valid email address is required');

            const htmlContent = _this.templates.projectTemplate(data);
            const textContent = _this.templates.generatePlainText(data, 'project');

            const options = {
                from: _this.mailConfig.smtp[_this.mailService].auth.user,
                replyTo: email,
                to: _this.mailConfig.smtp[_this.mailService].auth.user,
                subject: $subject || 'New Project Inquiry',
                html: htmlContent,
                text: textContent
            };

            return await _this.sendEmail(_this.mailConfig, options).catch((error) => {
                console.error('Project email error:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to send project email',
                    error: error
                };
            })
        },

        async sendContactEmail(data) {
            const { $email, $message, $subject } = data;

            if (!$email || !_this.isValidEmail($email)) throw new Error('Valid email address is required');
            if (!$message || $message.trim().length === 0) throw new Error('Message is required');

            const htmlContent = _this.templates.contactTemplate(data);
            const textContent = _this.templates.generatePlainText(data, 'contact');

            const options = {
                from: _this.mailConfig.smtp[_this.mailService].auth.user,
                replyTo: $email,
                to: _this.mailConfig.smtp[_this.mailService].auth.user,
                subject: $subject || `Contact Form Message from ${$email}`,
                html: htmlContent,
                text: textContent
            };

            return _this.sendEmail(options).catch((error) => {
                console.error('Contact email error:', error);
                return {
                    success: false,
                    message: error.message || 'Failed to send contact email',
                    error: error
                };
            });
        },

        async sendSubscriptionEmail(req, res) {
            const { email, options } = req.body;

            if (!email) throw new Error('Valid email address is required');

            const { subject, customMessage } = options;
            const htmlContent = `
            <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Welcome! 🎉</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for subscribing</p>
            </div>
            <div class="content">
                <p style="font-size: 16px;">
                    ${customMessage || "You've successfully subscribed to our newsletter. We're excited to have you on board!"}
                </p>
                <p style="font-size: 16px;">
                    You'll receive updates and news directly to your inbox.
                </p>
            </div>
            <div class="footer">
                <p style="margin: 0;">If you didn't subscribe, you can safely ignore this email.</p>
            </div>
        `;

            const emailOptions = {
                to: email,
                subject: subject || 'Welcome to Our Newsletter!',
                html: _this.templates.baseTemplate(htmlContent, 'Subscription Confirmation'),
                text: customMessage || "Thank you for subscribing! You'll receive updates directly to your inbox."
            };

            return Promise.resolve(_this.sendEmail(emailOptions))
                .then((resp) => {
                    if ( !resp.success ) {
                        logger.error('Unable to send email :: ', resp);
                    }
                    return res.status(200).json({ success: true, result: resp })
                })
                .catch((error) => {
                    logger.error('Subscription email error:', error);
                    return res.status(400).json({ success: false, message: error.message || 'Failed to send subscription email', error: error });
                });
        },
    }
}