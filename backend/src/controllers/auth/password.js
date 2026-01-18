const crypto = require('crypto');
const User = require('../models/User'); // Adjust path as needed
const { validateMongoDbId } = require('../utils/validateMongoDbId'); // Adjust path as needed

// Response helper
const response = {
    success: (res, data, statusCode = 200, message = "Operation successful") => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },

    error: (res, statusCode, message, error = null) => {
        const responseObj = { success: false, message };
        if (error && process.env.NODE_ENV === "development") {
            responseObj.error = error;
        }
        return res.status(statusCode).json(responseObj);
    }
};

exports.update = (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;

    validateMongoDbId(_id);

    if (!password) return response.error(res, 400, 'Password is required');

    User.findById(_id)
        .then((user) => {
            if (!user) return response.error(res, 404, 'User not found');

            user.password = password;
            return user.save();
        })
        .then((updatedUser) => {
            const userResponse = updatedUser.toJSON();
            return response.success(res, { user: userResponse }, 200, 'Password updated successfully');
        })
        .catch((err) => {
            return response.error(res, 500, 'Error updating password', err.message);
        });
};

exports.token = (req, res) => {
    let foundUser;
    const { email } = req.body;

    if (!email) return response.error(res, 400, 'Email is required');

    User.findOne({ email })
        .then((user) => {
            if (!user) return response.error(res, 404, 'User not found with this email');

            foundUser = user;
            return user.createPasswordResetToken();
        })
        .then((token) => foundUser.save().then(() => token);)
        .then((token) => {
            const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${token}`;
            const mailService = req.app.get('mailService');

            return mailService.sendEmail({
                to: email,
                subject: 'Password Reset Request',
                html: mailService.templates.passwordResetTemplate(resetURL, email),
                text: mailService.templates.generatePlainText({ resetURL, email }, 'passwordReset')
            });
        })
        .then(() => {
            return response.success(
                res,
                {
                    message: 'Password reset link sent to email',
                    expiresIn: '10 minutes'
                },
                200,
                'Password reset email sent successfully'
            );
        })
        .catch((error) => {
            if (foundUser) {
                foundUser.passwordResetToken = undefined;
                foundUser.passwordResetExpires = undefined;
                foundUser.save()
                    .then(() => response.error(res, 500, 'Error sending password reset email', error.message))
                    .catch((saveError) => response.error(res, 500, 'Error sending password reset email', error.message));
            } else {
                return response.error(res, 500, 'Error processing password reset request', error.message);
            }
        });
};

exports.reset = (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
        return response.error(res, 400, 'New password is required');
    }

    if (!token) {
        return response.error(res, 400, 'Reset token is required');
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    let foundUser;

    User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
        .then((user) => {
            if (!user) {
                return response.error(res, 400, 'Token expired or invalid. Please try again');
            }

            foundUser = user;
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            return user.save();
        })
        .then((savedUser) => {
            const mailService = req.app.get('mailService');
            
            mailService.sendEmail({
                to: foundUser.email,
                subject: 'Password Changed Successfully',
                html: mailService.templates.passwordResetSuccessTemplate(foundUser.email),
                text: mailService.templates.generatePlainText({ email: foundUser.email }, 'passwordResetSuccess')
            })
                .catch((emailError) => {
                    console.error('Failed to send confirmation email:', emailError);
                });

            const userResponse = savedUser.toJSON();
            return response.success(
                res,
                { user: userResponse },
                200,
                'Password reset successfully'
            );
        })
        .catch((error) => {
            return response.error(res, 500, 'Error resetting password', error.message);
        });
};

module.exports = {
    resetPassword: exports.reset,
    updatePassword: exports.update,
    forgotPasswordToken: exports.token,
};