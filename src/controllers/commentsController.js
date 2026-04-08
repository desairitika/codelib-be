const CommentService = require("../services/commentsService");
const SolutionService = require("../services/solutionsService");
const logger = require("../utils/logger");

exports.getAllComments = async (req, res) => {
  try {
    const solutionId = req.baseUrl.split("/")[4];
    const response = await CommentService.getAllComments(solutionId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.createComment = async (req, res) => {
  try {
    const solutionId = req.baseUrl.split("/")[4];
    const data = req.body;
    data.user = req.user.id;
    data.solution = solutionId;
    let solution = await SolutionService.getSolutionById(solutionId);
    if (!solution.data) {
      return res.status(400).json({ error: "Invalid problem ID" });
    }
    const response = await CommentService.createComment(data);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const response = await CommentService.getCommentById(commentId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const data = req.body;
    const response = await CommentService.updateComment(commentId, data);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    let response = await CommentService.deleteComment(commentId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};
