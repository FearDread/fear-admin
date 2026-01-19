const crypto = require('crypto');
const User = require('../../models/user');
//const { validateMongoDbId } = require('../utils/validateMongoDbId');

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

// Update password for authenticated user
exports.updatePassword = (req, res) => {
    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;

    //validateMongoDbId(_id);

    if (!currentPassword || !newPassword) {
        return response.error(res, 400, 'Current password and new password are required');
    }

    User.findById(_id)
        .then((user) => {
            if (!user) {
                return response.error(res, 404, 'User not found');
            }

            // Verify current password
            return user.isPasswordMatched(currentPassword)
                .then((isMatch) => {
                    if (!isMatch) {
                        return response.error(res, 401, 'Current password is incorrect');
                    }

                    user.password = newPassword;
                    return user.save();
                })
                .then((updatedUser) => {
                    // Send confirmation email
                    const mailService = req.app.get('mailService');
                    
                    return mailService.sendEmail({
                        to: updatedUser.email,
                        subject: 'Password Changed Successfully',
                        html: mailService.templates.passwordResetSuccessTemplate(updatedUser.email),
                        text: mailService.templates.generatePlainText({ email: updatedUser.email }, 'passwordResetSuccess')
                    })
                    .then(() => {
                        const userResponse = updatedUser.toJSON();
                        return response.success(res, { user: userResponse }, 200, 'Password updated successfully');
                    })
                    .catch((emailError) => {
                        // Log error but don't fail the password update
                        console.error('Failed to send confirmation email:', emailError);
                        const userResponse = updatedUser.toJSON();
                        return response.success(res, { user: userResponse }, 200, 'Password updated successfully');
                    });
                });
        })
        .catch((error) => {
            return response.error(res, 500, 'Error updating password', error.message);
        });
};

// Request password reset token
exports.forgotPasswordToken = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return response.error(res, 400, 'Email is required');
    }

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return response.error(res, 404, 'User not found with this email');
            }

            // Create reset token
            return user.createPasswordResetToken()
                .then((token) => {
                    return user.save()
                        .then(() => ({ user, token }));
                });
        })
        .then(({ user, token }) => {
            // Construct reset URL
            const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

            // Send email
            const mailService = req.app.get('mailService');
            
            return mailService.sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                html: mailService.templates.passwordResetTemplate(resetURL, user.email),
                text: mailService.templates.generatePlainText({ resetURL, email: user.email }, 'passwordReset')
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
            .catch((emailError) => {
                // Clear reset token if email fails
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                return user.save()
                    .then(() => {
                        return response.error(res, 500, 'Error sending password reset email', emailError.message);
                    });
            });
        })
        .catch((error) => {
            return response.error(res, 500, 'Error processing password reset request', error.message);
        });
};

// Reset password with token
exports.resetPassword = (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
        return response.error(res, 400, 'New password is required');
    }

    if (!token) {
        return response.error(res, 400, 'Reset token is required');
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
        .then((user) => {
            if (!user) {
                return response.error(res, 400, 'Token expired or invalid. Please try again');
            }

            // Update password and clear reset token
            user.password = password;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            return user.save();
        })
        .then((updatedUser) => {
            // Send confirmation email
            const mailService = req.app.get('mailService');

            return mailService.sendEmail({
                to: updatedUser.email,
                subject: 'Password Changed Successfully',
                html: mailService.templates.passwordResetSuccessTemplate(updatedUser.email),
                text: mailService.templates.generatePlainText({ email: updatedUser.email }, 'passwordResetSuccess')
            })
            .then(() => {
                const userResponse = updatedUser.toJSON();
                return response.success(
                    res,
                    { user: userResponse },
                    200,
                    'Password reset successfully'
                );
            })
            .catch((emailError) => {
                // Log error but don't fail the password reset
                console.error('Failed to send confirmation email:', emailError);
                const userResponse = updatedUser.toJSON();
                return response.success(
                    res,
                    { user: userResponse },
                    200,
                    'Password reset successfully'
                );
            });
        })
        .catch((error) => {
            return response.error(res, 500, 'Error resetting password', error.message);
        });
};

// Verify reset token validity (optional)
exports.verifyResetToken = (req, res) => {
    const { token } = req.params;

    if (!token) {
        return response.error(res, 400, 'Reset token is required');
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
        .then((user) => {
            if (!user) {
                return response.error(res, 400, 'Token expired or invalid');
            }

            return response.success(
                res,
                {
                    valid: true,
                    email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Partially masked email
                },
                200,
                'Token is valid'
            );
        })
        .catch((error) => {
            return response.error(res, 500, 'Error verifying token', error.message);
        });
};