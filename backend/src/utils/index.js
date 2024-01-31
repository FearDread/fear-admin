const config = require('../config');
const nodeMailer = require('nodemailer');

class errorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = {
    error:errorHandler,
    send_jwt_token: (user, status, res) => {
        const token = user.getJWTToken();
        
        const options = {
            expires: new Date(
                Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        };

        res.status(statusCode).cookie("token", token, options).json({
            success: true,
            user,
            token,
        });
    },

    send_email: async (options) => {
        const transporter = nodeMailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            service: config.SMTP_SERVICE,
            auth: {
                user: config.SMTP_MAIL,
                pass: config.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: config.SMPT_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message, 
        };

        await transporter.sendMail(mailOptions);
    }
}