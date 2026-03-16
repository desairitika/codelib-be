const ROLES = require("../constants/roles");
const UserService = require("../services/usersService");
const logger = require("../utils/logger");

exports.getAllUsers = async (req, res) => {
  try {
    const response = await UserService.getAllUsers();
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const response = await UserService.createUser(userData);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.role != ROLES.ADMIN && req.user.id !== userId) {
      return res.status(403).json({ error: "Forbidden. User does not have permission to access this resource." });
    }
    const response = await UserService.getUserById(userId);
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = req.body;
    if (req.user.role != ROLES.ADMIN && req.user.id !== userId) {
      return res.status(403).json({ error: "Forbidden. User does not have permission to access this resource." });
    }
    // Check and add uploaded files to userData
    if (req.files) {
      if (req.files["img"]) {
        userData.img = {
          data: req.files["img"][0].buffer,
          contentType: req.files["img"][0].mimetype,
        };
      }
      if (req.files["cover"]) {
        userData.cover = {
          data: req.files["cover"][0].buffer,
          contentType: req.files["cover"][0].mimetype,
        };
      }
    }
    const updatedUserResponse = await UserService.updateUser(userId, userData);
    res.status(updatedUserResponse.code).json(updatedUserResponse);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    let response = await UserService.deleteUser(userId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};
