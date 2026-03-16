const Comment = require("../../models/Comment");
const logger = require("../../utils/logger");

async function getAllComments(solutionId) {
  try {
    // include basic user info for display and sort by creation time asc
    return await Comment.find({ solution: solutionId })
      .populate("user", "name username")
      .sort({ createdAt: 1 });
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function createComment(data) {
  try {
    return await Comment.create(data);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function getCommentById(id) {
  try {
    return await Comment.findById(id);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function updateCommentById(id, data) {
  try {
    return await Comment.findByIdAndUpdate(id, data, {
      new: true,
    });
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function deleteCommentById(id) {
  try {
    return await Comment.findByIdAndDelete(id);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

module.exports = {
  getAllComments,
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
