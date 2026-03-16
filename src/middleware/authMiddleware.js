// middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwtUtils');
const { getToken } = require('../utils/authUtils');
const { isTokenBlacklisted } = require('../utils/blacklist');
const logger = require('../utils/logger');

// Attach blacklist helper (if routes need it) and keep requests consistent
function attachBlacklist(req, res, next) {
  req.isTokenBlacklisted = isTokenBlacklisted;
  next();
}

const authenticateUser = (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    logger.warn('Authentication attempt without token', { path: req.path });
    return res.status(401).json({
      code: 401,
      success: false,
      error: 'Unauthorized. Authentication is missing or invalid.',
    });
  }

  // Check if token is blacklisted
  if (isTokenBlacklisted(token)) {
    logger.warn('Attempt to use revoked token', { path: req.path });
    return res.status(401).json({
      code: 401,
      success: false,
      error: 'Token has been revoked. Please log in again.',
    });
  }

  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    logger.debug('User authenticated', { userId: decodedToken.id });
    next();
  } catch (error) {
    logger.warn('Token verification failed', { error: error.message });
    return res.status(401).json({
      code: 401,
      success: false,
      error: 'Unauthorized. Authentication is missing or invalid.',
    });
  }
};

const authorizeRole = (role) => (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Authentication is missing or invalid.' });
  }

  if ((Array.isArray(role) && !role.includes(user.role)) || (typeof role === 'string' && user.role !== role)) {
    return res.status(403).json({ error: 'Forbidden. User does not have permission to access this resource.' });
  }

  next();
};

// Middleware to reject blacklisted tokens (useful for protecting routes)
const checkBlacklistedUser = (req, res, next) => {
  const token = getToken(req);
  if (token && isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token revoked, please log in again' });
  }
  next();
};

module.exports = { authenticateUser, authorizeRole, checkBlacklistedUser, attachBlacklist }