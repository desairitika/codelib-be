const AuthService = require('../services/authService');
const { handleServerError } = require('../utils/errorHandler');
const { getToken } = require('../utils/authUtils');
const { getResponseStructure } = require('../utils/helper')
const { addToBlacklist  } = require('../utils/blacklist');
const { sanitizeObject } = require('../utils/sanitizer');
const { validateUserCred } = require('../validators/credentialsValidator');
const logger = require('../utils/logger');

exports.registerUser = async (req, res) => {
    try {
        // Validate input
        const validationResult = validateUserCred(req.body);
        if (validationResult !== "Success") {
            return res.status(validationResult.code).json(validationResult);
        }

        // Sanitize input
        const sanitizedData = sanitizeObject(req.body);

        const response = await AuthService.registerUser(sanitizedData);
        res.status(response.code).json(response);
    } catch (error) {
        logger.error('Register user error', { error: error.message });
        handleServerError(error, req, res);
    }
}

exports.loginUser = async (req, res) => {
    try {
        // Validate input
        if (!req.body.username && !req.body.email) {
            return res.status(400).json(
                getResponseStructure(400, 'error', 'Username or email is required')
            );
        }
        if (!req.body.password) {
            return res.status(400).json(
                getResponseStructure(400, 'error', 'Password is required')
            );
        }

        // Sanitize input
        const sanitizedData = sanitizeObject(req.body);

        const response = await AuthService.loginUser(sanitizedData);
        res.status(response.code).json(response);
    } catch (error) {
        logger.error('Login user error', { error: error.message });
        handleServerError(error, req, res);
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        // Validate email
        if (!req.body.email) {
            return res.status(400).json(
                getResponseStructure(400, 'error', 'Email is required')
            );
        }

        const sanitizedData = sanitizeObject(req.body);

        await AuthService.forgotPassword(sanitizedData, (response) => {
            res.status(response.code).json(response);
        });
    } catch (error) {
        logger.error('Forgot password error', { error: error.message });
        handleServerError(error, req, res);
    }
}

exports.resetPassword = async (req, res) => {
    try {
        // Validate input
        if (!req.body.email || !req.body.otp || !req.body.newPassword) {
            return res.status(400).json(
                getResponseStructure(400, 'error', 'Email, OTP, and new password are required')
            );
        }

        const sanitizedData = sanitizeObject(req.body);

        const response = await AuthService.resetPassword(sanitizedData);
        res.status(response.code).json(response);
    } catch (error) {
        logger.error('Reset password error', { error: error.message });
        handleServerError(error, req, res);
    }
}

exports.logoutUser = async (req, res) => {
    const token = getToken(req); // Extract token from Authorization header
    let response;
    if (token) {
        // Add token to blacklist
        addToBlacklist(token);
        logger.info('User logged out successfully');
        response = getResponseStructure(200, 'message', 'Token revoked successfully');
    } else {
        logger.warn('Logout attempt without token');
        response = getResponseStructure(400, 'error', 'Token not provided')
    }
    res.status(response.code).json(response);
}
