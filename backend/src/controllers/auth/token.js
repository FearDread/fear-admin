const jwt = require("jsonwebtoken");

const JWT_EXPIRES_IN = 24 * 60 * 60; // 24 hours in seconds
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ALGORITHM = "HS256"; 
const SAME_SITE_VALUES = ["strict", "lax", "none"];

/**
 * JWT Token utilities
 */
module.exports = class TokenService {

    static getSecret() {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not set");
        return secret;
    }

    /**
     * Generate JWT token for user
     * @param {object} user - User object
     * @returns {string} JWT token
     */
    static generateToken(user) {
        return jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role || 'user'
            },
            TokenService.getSecret(),
            {
                expiresIn: JWT_EXPIRES_IN,
                algorithm: ALGORITHM
            }
        );
    }

    /**
     * Verify JWT token
     * @param {string} token - JWT token to verify
     * @returns {object} Decoded token payload
     */
    static verifyToken(token) {
        return jwt.verify(token, TokenService.getSecret(), { algorithms: [ALGORITHM] });
    }

    /**
     * Get cookie options based on environment.
     * JWT_COOKIE_SAMESITE (strict | lax | none) is for a frontend served from a different
     * site than the API; "none" is only honoured over HTTPS, so it forces `secure`.
     * @returns {object} Cookie configuration
     */
    static getCookieOptions() {
        const requested = String(process.env.JWT_COOKIE_SAMESITE || "strict").toLowerCase();
        const sameSite = SAME_SITE_VALUES.includes(requested) ? requested : "strict";

        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || sameSite === "none",
            sameSite,
            maxAge: COOKIE_MAX_AGE,
        };
    }

    /**
     * Options for clearing the cookie. Browsers only drop a cookie when the attributes
     * match the ones it was set with, so derive these from getCookieOptions().
     */
    static getClearCookieOptions() {
        const { maxAge, ...options } = TokenService.getCookieOptions();
        return options;
    }
}