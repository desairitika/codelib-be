const { getResponseStructure } = require("../utils/helper");

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    return passwordRegex.test(password);
}

function validateUserCred(userData) {
    const { username, email, password } = userData;
    // Check if email is valid
    if (email && !isValidEmail(email))
        return getResponseStructure(400, 'error', 'Invalid email format');

    // Check if username is too short
    if (username && username.length < 3)
        return getResponseStructure(400, 'error', 'Username must be at least 3 characters long');

    // Check if password is too weak (e.g., must contain at least one digit, one lowercase letter, and one uppercase letter)
    if (password && !isValidPassword(password))
        return getResponseStructure(400, 'error', 'Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 6 characters long');

    return "Success";
}

module.exports = {
    isValidEmail,
    isValidPassword,
    validateUserCred
};