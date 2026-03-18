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
        logger.warn('Failed to send real email, falling back to Ethereal Test Account', { error: error.message });
        
        try {
          // Create Ethereal Test Account dynamically
          let testAccount = await nodemailer.createTestAccount();
          let testTransporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: testAccount.user, // generated ethereal user
              pass: testAccount.pass, // generated ethereal password
            },
          });

          // Send mail with defined transport object
          let testInfo = await testTransporter.sendMail(mailOptions);
          
          console.log("\n=======================================================");
          console.log("             [LOCAL DEV TEST EMAIL SENT]               ");
          console.log(`To: ${mailOptions.to}`);
          console.log(`Preview URL: ${nodemailer.getTestMessageUrl(testInfo)}`);
          console.log("=======================================================\n");

          callback(
            getResponseStructure(
              200,
              'message',
              'Password reset request processed. A test email was generated in the backend console.'
            )
          );
        } catch(fallbackErr) {
          logger.error('Failed to send Ethereal fallback email', { error: fallbackErr.message });
          callback(getResponseStructure(500, 'error', 'Failed to send email.'));
        }
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
