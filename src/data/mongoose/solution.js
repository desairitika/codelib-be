const Solution = require("../../models/Solution");
const logger = require("../../utils/logger");

async function getAllSolutions(problemId) {
  try {
    return await Solution.find({ problem: problemId });
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function createSolution(data) {
  try {
    return await Solution.create(data);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function getSolutionById(id) {
  try {
    return await Solution.findById(id);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function updateSolutionById(id, data) {
  try {
    return await Solution.findByIdAndUpdate(id, data, {
      new: true,
    });
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function deleteSolutionById(id) {
  try {
    return await Solution.findByIdAndDelete(id);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

module.exports = {
  getAllSolutions,
  createSolution,
  getSolutionById,
  updateSolutionById,
  deleteSolutionById,
};
