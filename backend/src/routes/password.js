const Password = require("../controllers/auth/password");

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();

    // Forgot password - sends reset email
    router.post('/forgot-password', Password.forgotPasswordToken);
    // Reset password with token
    router.post('/reset-password/:token', Password.resetPassword);
    // Update password (requires authentication) TODO: Add auth middleware
    router.put('/update-password', Password.updatePassword);
    // Verify reset token validity (optional - for frontend validation)
    router.get('/verify-reset-token/:token', Password.verifyResetToken);

    return router;
};