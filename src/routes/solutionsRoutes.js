const express = require("express");
const router = express.Router();
const SolutionController = require("../controllers/solutionsController");
const { authenticateUser } = require("../middleware/authMiddleware");

router.get("/", authenticateUser, SolutionController.getAllSolutions);
router.post("/", authenticateUser, SolutionController.createSolution);
router.get("/:solutionId", authenticateUser, SolutionController.getSolutionById);
router.put("/:solutionId", authenticateUser, SolutionController.updateSolution);
router.delete("/:solutionId", authenticateUser, SolutionController.deleteSolution);

module.exports = router;
