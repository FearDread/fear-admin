const nodemailer = require("nodemailer");
const FormData = require("form-data");
const Mailgun = require("mailgun");
const templates = require('./templates');

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
        return _this.mailConfig.smtp[_this.mailService].auth.user || 'ghaptonstall@gmail.com';
    };
    _this.efear = templates;

    return {
        templates: templates,
        sendEmail: _this.sendEmail,
        sendOrderConfirmation(req, res) {

        },
        sendResetEmail(req, res) {

        },
        sendContactEmail(req, res) {
            const { $email, $message, $name } = req.body;
            const $subject = `Contact Form Message from ${$email}`;

            if (!$email || !_this.isValidEmail($email)) {
                return _this.handleError(res, 400, { message: 'Valid email is required' });
            }
            if (!$message || $message.trim().length === 0) {
                return _this.handleError(res, 400, { message: 'Message is required' });
            }

            const options = {
                from: _this.getDefaultFromAddress(),
                cc: _this.getDefaultFromAddress(),
                to: $email,
                subject: $subject,
                html: templates.contactForm({ $subject, $email, $message, $name })
            };

            return _this.sendEmail(options)
                .then((resp) => {
                    if (!resp.success) return res.status(500).json(resp);

                    return res.status(200).json({ success: true, message: 'Contact email sent successfully', result: resp });
                })
                .catch((error) => _this.handleError(res, 500, error));
        },

        sendSubscriptionEmail(req, res) {
            const { $email, $subject = 'Welcome to our Newsletter' } = req.body;

            if (!$email || !_this.isValidEmail($email)) {
                return _this.handleError(res, 400, { message: 'Valid email is required' });
            }

            const emailOptions = {
                to: $email,
                from: 'fear.dread@underworld.dog',
                cc: _this.getDefaultFromAddress(),
                subject: $subject,
                html: templates.promo(req.body),
            };

            return _this.sendEmail(emailOptions)
                .then((resp) => {
                    if (!resp.success) return _this.handleError(res, 500, resp);

                    return res.status(200).json({ success: true, message: 'Subscription email sent successfully', result: resp });
                })
                .catch((error) => _this.handleError(res, 500, error));
        },

        sendWelcomeEmail(req, res) {
            const { $email, data } = req.body;
            const $subject = 'Welcome to the Crew!';

            if (!$email || !_this.isValidEmail($email)) {
                return _this.handleError(res, 400, { message: 'Valid email is required' });
            }

            const opts = {
                to: $email,
                cc: _this.getDefaultFromAddress(),
                from: 'fear.dread@underworld.dog',
                subject: $subject,
                html: templates.welcome(data)
            }
            return _this.sendEmail(opts)
                .then((result) => {
                    if (!result.success) return _this.handleError(res, 500, result);

                    return res.status(200).json({ result, success: true, message: 'Welcome email sent' })
                })
                .catch((err) => _this.handleError(res, 500, err));
        },

        sendVchatWelcomeEmail(req, res) {
            const { $email, data = {} } = req.body;

            if (!$email || !_this.isValidEmail($email)) {
                return _this.handleError(res, 400, { message: 'Valid email is required' });
            }

            return _this.sendEmail({
                to: $email,
                from: 'fear.dread@underworld.dog',
                subject: 'Welcome to V-CHAT',
                html: templates.vchatWelcome(data),
                text: `Welcome to V-CHAT, ${data.firstName || 'there'}! Your account is live. Start a call: ${data.appUrl || ''}`
            })
                .then((result) => {
                    if (!result.success) return _this.handleError(res, 500, result);

                    return res.status(200).json({ success: true, message: 'V-CHAT welcome email sent', result });
                })
                .catch((error) => _this.handleError(res, 500, error));
        },

        // Route behind requireUser: this sends mail to arbitrary addresses.
        sendVchatInviteEmail(req, res) {
            const { $email, data = {} } = req.body;

            if (!$email || !_this.isValidEmail($email)) {
                return _this.handleError(res, 400, { message: 'Valid email is required' });
            }
            if (!/^https?:\/\//i.test(data.roomUrl || '')) {
                return _this.handleError(res, 400, { message: 'A valid roomUrl is required' });
            }

            const inviter = data.inviterName || 'Someone';

            return _this.sendEmail({
                to: $email,
                from: 'fear.dread@underworld.dog',
                subject: `${inviter} invited you to a V-CHAT call`,
                html: templates.vchatInvite(data),
                text: `${inviter} invited you to a V-CHAT call.${data.message ? `\n\n${data.message}` : ''}\n\nJoin: ${data.roomUrl}`
            })
                .then((result) => {
                    if (!result.success) return _this.handleError(res, 500, result);

                    return res.status(200).json({ success: true, message: 'Invitation sent', result });
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