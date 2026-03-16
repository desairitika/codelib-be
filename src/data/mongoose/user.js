const User = require("../../models/User");
const logger = require("../../utils/logger");

// Function to retrieve all users
async function getAllUsers() {
  try {
    return await User.find().select("-password -__v");
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

// Function to retrieve a user by ID
async function getUserById(userId) {
  try {
    return await User.findById(userId).select("-password -__v");
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

// Function to retrieve a user by ID
async function getUserByUsernameOrEmail(userNameOrEmail) {
  try {
    return await User.findOne({
      $or: [{ username: userNameOrEmail }, { email: userNameOrEmail }],
    });
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

// Function to create a new user
async function createUser(userData) {
  try {
    return await User.create(userData);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

// Function to update an existing user
async function updateUserById(userId, updatedUserData) {
  try {
    return await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    }).select("-password -__v");
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

// Function to delete a user
async function deleteUserById(userId) {
  try {
    return await User.findByIdAndDelete(userId);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsernameOrEmail,
  createUser,
  updateUserById,
  deleteUserById,
};
