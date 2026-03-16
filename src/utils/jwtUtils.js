const jwt = require('jsonwebtoken');
const env = require('../../config/env');

// Generate a JWT token
function generateToken(payload, remember) {
   const expiresIn = remember ? '8h' : '1h';
   return jwt.sign(payload, env.SECRET_KEY, { expiresIn: expiresIn });
}

// Verify a JWT token
function verifyToken(token) {
   try {
      return jwt.verify(token, env.SECRET_KEY);
   } catch (error) {
      throw new Error('Invalid token');
   }
}

module.exports = {
   generateToken,
   verifyToken
};
