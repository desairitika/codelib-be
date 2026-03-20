const config = require("../../config/env");
const { getResponseStructure } = require("./helper");
const nodemailer = require("nodemailer");
// const { google } = require("googleapis");

// const oauth2Client = new google.auth.OAuth2(
//   config.CLIENT_ID,
//   config.CLIENT_SECRET,
//   'https://developers.google.com/oauthplayground' // Redirect URL for testing
// );

// oauth2Client.setCredentials({
//   refresh_token: config.REFRESH_TOKEN
// });

const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS 
  }
});

const sendMail = async (mailOptions, callback) => {
  try {
    // Attempt to send with configured transporter
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        logger.error('Failed to send OTP email', { error: error.message });
        callback(getResponseStructure(500, 'error', 'Failed to send OTP to your email. Check Gmail configuration.'));
      } else {
        logger.info('Email sent', { response: info.response });
        callback(
          getResponseStructure(
            200,
            'message',
            'Password reset request processed. If the provided email is associated with an account, you will receive a password reset OTP.'
          )
        );
      }
    });
  } catch (err) {
    logger.error('Unexpected error sending email', { error: err.message });
    callback(getResponseStructure(500, 'error', 'Failed to send email.'));
  }
};
const userOtpMap = {}; // keyed by email: { otp, createdAt }

function clearOldOtps(duration) {
  const currentTime = Date.now();
  for (const email in userOtpMap) {
    if (Object.prototype.hasOwnProperty.call(userOtpMap, email)) {
      const entry = userOtpMap[email];
      if (!entry || !entry.createdAt) continue;
      if (currentTime - entry.createdAt.getTime() >= duration) {
        delete userOtpMap[email];
      }
    }
  }
}

setInterval(() => {
  clearOldOtps(5 * 60 * 1000); // Clear OTPs older than 5 min
}, 5 * 60 * 1000);

module.exports = {
  transporter,
  userOtpMap,
  sendMail,
};
