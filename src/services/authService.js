const { getUserByUsernameOrEmail, updateUserById } = require("../data/mongoose/user");
const { comparePasswords } = require("../utils/authUtils");
const { generateToken } = require("../utils/jwtUtils");
const { getResponseStructure } = require("../utils/helper");
const { dbErrorHandler } = require("../utils/errorHandler");
const { createUserPayload } = require("./commonService");
const OTPGenerator = require("otp-generator");
const env = require("../../config/env");
const { hashPassword } = require("../utils/authUtils");
const { sendMail, userOtpMap } = require("../utils/mailerUtils");

class AuthService {
  static async registerUser(userData) {
    try {
      return createUserPayload(userData);
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async loginUser(body) {
    const { username, password, email, remember } = body;
    try {
      if (!(username || email) || !password) return getResponseStructure(400, "error", "Invalid Payload");

      let usernameOrEmail = username ? username.toLowerCase().trim() : email.toLowerCase().trim();

      const user = await getUserByUsernameOrEmail(usernameOrEmail);
      if (!user) {
        return getResponseStructure(401, "error", "Invalid credentials!");
      }

      // Check password
      const isMatch = await comparePasswords(password.trim(), user.password);
      if (!isMatch) {
        return getResponseStructure(401, "error", "Invalid credentials!");
      }

      const token = generateToken(
        {
          name: user.name,
          lastname: user.lastname,
          id: user.id,
          role: user.role,
        },
        remember
      );

      return getResponseStructure(
        200,
        "message",
        "Success",
        {
          id: user?.id,
          name: user?.name,
          lastname: user?.lastname,
          role: user?.role,
          token: "Bearer " + token,
        },
        "user"
      );
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async forgotPassword(body, callback) {
    try {
      const { email } = body;
      const user = await getUserByUsernameOrEmail(email);

      if (user) {
        const otp = OTPGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        userOtpMap[email] = {
          otp,
          createdAt: new Date(),
        };

        const mailOptions = {
          from: `Codelib <${env.GMAIL_USER}>`,
          to: email,
          subject: "Password Reset OTP",
          text: `Your OTP for password reset is: ${otp}. This OTP is valid for a short period of time.`,
        };

        sendMail(mailOptions, (response) => {
          callback(response);
        });
      } else {
        callback(
          getResponseStructure(
            200,
            "message",
            "Password reset request processed. If the provided email is associated with an account, you will receive a password reset OTP."
          )
        );
      }
    } catch (error) {
      callback(dbErrorHandler(error));
    }
  }

  static async resetPassword(body) {
    try {
      const { email, otp, newPassword } = body;

      const otpEntry = userOtpMap[email];
      if (!otpEntry || otpEntry.otp !== otp) {
        return getResponseStructure(400, "error", "Invalid or expired OTP.");
      }

      // Check OTP expiry (10 minutes)
      const OTP_EXPIRY_MS = 10 * 60 * 1000;
      if (new Date() - new Date(otpEntry.createdAt) > OTP_EXPIRY_MS) {
        delete userOtpMap[email];
        return getResponseStructure(400, "error", "OTP has expired. Please request a new one.");
      }

      const user = await getUserByUsernameOrEmail(email);
      if (!user) {
        return getResponseStructure(404, "error", "User not found.");
      }
      const hashedPassword = await hashPassword(newPassword.trim());
      await updateUserById(user.id, { password: hashedPassword });
      delete userOtpMap[email];
      return getResponseStructure(200, "message", "Password reset successful");
    } catch (error) {
      return dbErrorHandler(error);
    }
  }
}

module.exports = AuthService;
