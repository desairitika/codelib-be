/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

// Remove potential XSS characters
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/[<>\"']/g, (char) => {
      const escapeMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[char];
    })
    .trim();
}

// Sanitize all string values in an object
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }

  return sanitized;
}

// Validate and sanitize email
function sanitizeEmail(email) {
  const sanitized = sanitizeString(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
}

// Validate and sanitize username (alphanumeric, underscore, hyphen only)
function sanitizeUsername(username) {
  const sanitized = sanitizeString(username).toLowerCase();
  const usernameRegex = /^[a-z0-9_-]+$/;
  
  if (!usernameRegex.test(sanitized)) {
    throw new Error('Username can only contain letters, numbers, underscore, and hyphen');
  }
  
  return sanitized;
}

module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeEmail,
  sanitizeUsername
};
