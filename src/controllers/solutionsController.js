const SolutionService = require("../services/solutionsService");
const ProblemsService = require("../services/problemsService");
const logger = require("../utils/logger");

exports.getAllSolutions = async (req, res) => {
  try {
    const problemId = req.baseUrl.split("/")[4];
    const response = await SolutionService.getAllSolutions(problemId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error('getAllSolutions error', { error: error.message });
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.createSolution = async (req, res) => {
  try {
    const data = req.body;
    let problemId = req.body.problem;
    data.createdBy = req.user.id;
    let problem = await ProblemsService.getProblemById(data.problem);
    if (!problem.data) {
      res.status(400).json({ error: "Invalid problem ID" });
    } else {
      const response = await SolutionService.createSolution(data);
      await ProblemsService.updateProblem(problemId, {
        $set: { ["solutions." + response.data.language.toString()]: response.data._id.toString(), status: "solved" },
      });
      res.status(response.code).json(response);
    }
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.getSolutionById = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const response = await SolutionService.getSolutionById(solutionId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.updateSolution = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const data = req.body;
    const response = await SolutionService.updateSolution(solutionId, data);
    // await ProblemsService.updateProblem(response.data.problem.toString(), {
    //   $set: {
    //     ["solutions." + response.data.language.toString()]: response.data._id.toString(),
    //   },
    // });
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.deleteSolution = async (req, res) => {
  try {
    const { solutionId } = req.params;
    let response = await SolutionService.deleteSolution(solutionId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};
