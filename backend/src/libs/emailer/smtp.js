const nodemailer = require("nodemailer");
const FormData = require("form-data");
const Mailgun = require("mailgun");

module.exports = function (fear) {
    const _this = {};
    const logger = fear.getLogger();

    _this.mailConfig = fear.mailinfo || {};
    _this.mailService = fear.mailinfo?.service || 'smtp';
    _this.transporter = null;
    _this.mailgunClient = null;

    // Initialize the appropriate mail service
    _this.initializeMailService = () => {
        if (_this.mailService === 'mailgun') {
            if (!_this.mailConfig.mailgun) {
                throw new Error('Missing Mailgun configuration. Please update mail configuration.');
            }

            const { apiKey, domain, region } = _this.mailConfig.mailgun;

            if (!apiKey || !domain) {
                logger.error('Mailgun requires apiKey and domain in configuration.')
                return;
            }

            const mailgun = new Mailgun(_this.mailConfig.mailgun);
            const clientOptions = {
                username: 'api',
                key: apiKey
            };

            // Add EU endpoint if region is specified
            if (region === 'EU') {
                clientOptions.url = 'https://api.eu.mailgun.net';
            }

            _this.mailgunClient = mailgun.client(clientOptions);
            _this.mailgunDomain = domain;

            logger.info('Mailgun client initialized successfully.');
        } else {
            // Default SMTP setup with nodemailer
            if (!_this.mailConfig.smtp || !_this.mailConfig.smtp[_this.mailService]) {
                throw new Error(`Missing mail configuration for service: ${_this.mailService}. Please update mail configuration.`);
            }

            _this.transporter = nodemailer.createTransport(_this.mailConfig.smtp[_this.mailService]);
            _this.transporter.verify()
                .then(() => logger.info('Mail transport setup complete.'))
                .catch((error) => logger.error('Error loading mail transport :: ', error));
        }
    };

    // Initialize on module load
    _this.initializeMailService();

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

    _this.sendViaMailgun = (options) => {
        const messageData = {
            from: options.from,
            to: Array.isArray(options.to) ? options.to : [options.to],
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        // Add reply-to if specified
        if (options.replyTo) {
            messageData['h:Reply-To'] = options.replyTo;
        }

        // Add CC if specified
        if (options.cc) {
            messageData.cc = Array.isArray(options.cc) ? options.cc : [options.cc];
        }

        // Add BCC if specified
        if (options.bcc) {
            messageData.bcc = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
        }

        return _this.mailgunClient.messages.create(_this.mailgunDomain, messageData)
            .then((data) => {
                logger.info(`Email sent successfully via Mailgun :: messageId: ${data.id}`);
                return {
                    success: true,
                    message: 'Email sent successfully',
                    messageId: data.id,
                    response: data
                };
            })
            .catch((error) => {
                logger.error('Error sending email via Mailgun :: ', error);
                return {
                    success: false,
                    message: error.message || 'Failed to send email',
                    error: error
                };
            });
    };

    _this.sendViaSMTP = (options) => {
        return _this.transporter.sendMail(options)
            .then((info) => {
                if (!info.messageId) {
                    logger.warn('Email sent but messageId not found :: ', info);
                }
                logger.info(`Email sent successfully via SMTP :: messageId: ${info.messageId}`);
                return {
                    success: true,
                    message: 'Email sent successfully',
                    messageId: info.messageId
                };
            })
            .catch((error) => {
                logger.error('Error sending email via SMTP :: ', error);
                return {
                    success: false,
                    message: error.message || 'Failed to send email',
                    error: error
                };
            });
    };

    _this.sendEmail = (options) => {
        const validation = _this.validateEmailOptions(options);

        if (!validation.isValid) {
            return Promise.reject(new Error(`Validation failed: ${validation.errors.join(', ')}`));
        }

        // Set default from address based on service
        let defaultFrom;
        if (_this.mailService === 'mailgun') {
            defaultFrom = _this.mailConfig.mailgun.from || `noreply@${_this.mailgunDomain}`;
        } else {
            defaultFrom = _this.mailConfig.smtp[_this.mailService].auth.user;
        }

        const emailOptions = {
            from: defaultFrom,
            ...options
        };

        // Route to appropriate sending method
        if (_this.mailService === 'mailgun') {
            return _this.sendViaMailgun(emailOptions);
        } else {
            return _this.sendViaSMTP(emailOptions);
        }
    };

    _this.handleError = (res, statusCode, error) => {
        logger.error(`E-Mailer Error :: `, error);
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'An error occurred',
            error
        });
    };

    _this.getDefaultFromAddress = () => {
        if (_this.mailService === 'mailgun') {
            return _this.mailConfig.mailgun.from || `noreply@${_this.mailgunDomain}`;
        }
        return _this.mailConfig.smtp[_this.mailService].auth.user;
    };

    _this.templates = {
        baseTemplate(content, title = "Email") {
            return `
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
            color: #242424;
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
            background: linear-gradient(135deg, #ea6666 0%, #410182 100%);
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
            `;
        },

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

            return _this.templates.baseTemplate(content, "New Project Inquiry");
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

            return _this.templates.baseTemplate(content, "New Contact Message");
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

    return {
        templates: _this.templates,
        sendEmail: _this.sendEmail,

        sendProjectEmail(req, res) {
            const data = req.body;
            const { $subject, email } = data;

            if (!email || !_this.isValidEmail(email)) {
                return _this.handleError(res, 400, { message: 'Valid email required' });
            }

            const htmlContent = _this.templates.projectTemplate(data);
            const textContent = _this.templates.generatePlainText(data, 'project');
            const options = {
                from: _this.getDefaultFromAddress(),
                replyTo: email,
                to: _this.getDefaultFromAddress(),
                subject: $subject || 'New Project Inquiry',
                html: htmlContent,
                text: textContent
            };

            return _this.sendEmail(options)
                .then((resp) => {
                    if (!resp.success) {
                        return _this.handleError(res, 500, resp);
                    }
                    return res.status(200).json({
                        success: true,
                        message: 'Project email sent successfully',
                        result: resp
                    });
                })
                .catch((error) => _this.handleError(res, 500, error));
        },

        sendContactEmail(req, res) {
            const { $email, $message, $subject } = req.body;

            if (!$email || !_this.isValidEmail($email)) {
                return _this.handleError(res, 400, { message: 'Valid email is required' });
            }
            if (!$message || $message.trim().length === 0) {
                return _this.handleError(res, 400, { message: 'Message is required' });
            }

            const htmlContent = _this.templates.contactTemplate(req.body);
            const textContent = _this.templates.generatePlainText(req.body, 'contact');

            const options = {
                from: _this.getDefaultFromAddress(),
                replyTo: $email,
                to: _this.getDefaultFromAddress(),
                subject: $subject || `Contact Form Message from ${$email}`,
                html: htmlContent,
                text: textContent
            };

            return _this.sendEmail(options)
                .then((resp) => {
                    if (!resp.success) {
                        return res.status(500).json(resp);
                    }
                    return res.status(200).json({
                        success: true,
                        message: 'Contact email sent successfully',
                        result: resp
                    });
                })
                .catch((error) => _this.handleError(res, 500, error));
        },

        sendSubscriptionEmail(req, res) {
            const { email, options = {} } = req.body;

            if (!email || !_this.isValidEmail(email)) {
                return _this.handleError(res, 400, { message: 'Valid email is required' });
            }

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

            return _this.sendEmail(emailOptions)
                .then((resp) => {
                    if (!resp.success) {
                        return _this.handleError(res, 500, resp);
                    }
                    return res.status(200).json({
                        success: true,
                        message: 'Subscription email sent successfully',
                        result: resp
                    });
                })
                .catch((error) => _this.handleError(res, 500, error));
        },
        sendTestMessage(req, res) {
          const mg = _this.mailgunClient  
          
          mg.messages.create("sandbox933b4315c0164f209bbf0bc7fb908598.mailgun.org", {
              from: "Mailgun Sandbox <postmaster@sandbox933b4315c0164f209bbf0bc7fb908598.mailgun.org>",
              to: ["Garrett Haptonstall <fear.dread@underworld.dog>"],
              subject: "Hello Garrett Haptonstall",
              text: "Congratulations Garrett Haptonstall, you just sent an email with Mailgun! You are truly awesome!",
            })
            .then((data) => {
                logger.info(data)
            })
            .catch(error => logger.error(error));
        }
    };
};