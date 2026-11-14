const TokenService = require('../auth/token');

const noStore = (res) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.vary('Cookie');
};

module.exports = {
    fear: {
        success: (res, status = 200, data = {}, message = 'Response Success!') => {
            const envelope = {
                success: true,
                message,
                result: data,
                count: data.count || 0
            }

            return res.status(status).json(envelope);
        },

        fail: (res, status, message = 'Response Error!', error) => {
           return res.status(status).json({
              success: false,
              message,
              error: (process.env.NODE_ENV === 'development') ? error : null
            })
        }
    },
     /**
     * Authentication response helper
     */
    auth: {

        success: (res, user, token, statusCode = 200, message = "Authentication successful") => {
            noStore(res);
            const envelope = { success: true, message, user: user.toJSON(), token };

            return res
                .status(statusCode)
                .cookie("jwt", token, TokenService.getCookieOptions())
                .json({
                    envelope,
                    data: envelope,
                    result: envelope,
                });
        },

        fail: (res, statusCode, message, error = null) => {
            const body = { success: false, message };
            if (error && process.env.NODE_ENV === "development") body.error = error;
            return res.status(statusCode).json(body);
        }
    },

}