const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { checkBlacklistedUser, attachBlacklist } = require('../middleware/authMiddleware');
const { rateLimitAuth } = require('../middleware/rateLimitMiddleware');

// Attach blacklist helper for downstream handlers
router.use(attachBlacklist);

// Public auth endpoints (apply light rate limiting)
router.post('/register', rateLimitAuth, registerUser);
router.post('/login', rateLimitAuth, loginUser);
router.post('/forgot-password', rateLimitAuth, forgotPassword);
router.post('/reset-password', rateLimitAuth, resetPassword);

// Protected routes: check if token is blacklisted
router.use(checkBlacklistedUser);
router.get('/logout', logoutUser);

module.exports = router;
