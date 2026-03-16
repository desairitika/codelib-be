const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/commentsController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/", authenticateUser, CommentController.getAllComments);
router.post("/", authenticateUser, CommentController.createComment);
router.get("/:commentId", authenticateUser, CommentController.getCommentById);
router.put("/:commentId", authenticateUser, CommentController.updateComment);
router.delete("/:commentId", authenticateUser, CommentController.deleteComment);

module.exports = router;
