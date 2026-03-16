const express = require("express");
const multer = require("multer");
const router = express.Router();
const ProblemsController = require("../controllers/problemsController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get("/", authenticateUser, ProblemsController.getAllProblems);
router.post("/", authenticateUser, ProblemsController.createProblem);
router.get("/dashboardStats", authenticateUser, ProblemsController.getDashboardStats);
router.post("/filter", authenticateUser, ProblemsController.getFilteredProblems);
router.get("/download-template", authenticateUser, ProblemsController.downloadTemplate);
router.post("/upload-template", authenticateUser, upload.single("file"), ProblemsController.uploadTemplate);
router.get("/:problemId", authenticateUser, ProblemsController.getProblemById);
router.put("/:problemId", authenticateUser, ProblemsController.updateProblem);
router.delete("/:problemId", authenticateUser, ProblemsController.deleteProblem);

module.exports = router;
