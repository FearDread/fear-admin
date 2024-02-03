const config = require('../config');
const nodeMailer = require('nodemailer');
const AppError = require('../utils/app.error');

exports.error = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
  
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new AppError(message, statusCode);
    }

    if (err.code === 11000) { 
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new AppError(message, statusCode);
    }

    if (err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Try again `;
        err = new AppError(message , statusCode);
    }

    res.status(statusCode);
    res.json({
      message: err.message,
      stack: err.stack,
    });
  };

exports.send_email = async (options) => {
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
};

exports.send_jwt_token = (user, status, res) => {
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
};
