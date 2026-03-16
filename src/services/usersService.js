const {
  getAllUsers,
  getUserById,
  getUserByUsernameOrEmail,
  updateUserById,
  deleteUserById,
} = require("../data/mongoose/user");
const { dbErrorHandler } = require("../utils/errorHandler");
const { createUserPayload } = require("./commonService");
const ROLES = require("../constants/roles");
const { getResponseStructure, convertPayloadToLower } = require("../utils/helper");
const { hashPassword } = require("../utils/authUtils");

class UserService {
  static async getAllUsers() {
    try {
      const users = await getAllUsers();
      return getResponseStructure(200, "message", "Success", users, 'users');
    } catch (err) {
      return dbErrorHandler(err);
    }
  }

  static async createUser(userData) {
    try {
      return createUserPayload(userData, "users");
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async getUserById(userId) {
    try {
      const user = await getUserById(userId);
      if (user.role != ROLES.ADMIN && user.id !== userId) {
        return null;
      }
      return getResponseStructure(200, "message", "Success", user, 'user');
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async updateUser(userId, userData) {
    try {
      const user = await getUserById(userId);
      if (user.role != ROLES.ADMIN && user.id !== userId) {
        return null;
      }
      userData = convertPayloadToLower(userData);
      if (userData.password) {
        userData.password = await hashPassword(userData.password.trim());
      }
      const updatedUser = await updateUserById(userId, userData);
      return getResponseStructure(200, "message", "User updated successfully", updatedUser, 'user');
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async deleteUser(userId) {
    try {
      await deleteUserById(userId);
      return getResponseStructure(204, "message", "User Deleted Successful.");
    } catch (err) {
      return dbErrorHandler(err);
    }
  }
}

module.exports = UserService;
