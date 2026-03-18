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

async function getProblemSolvers(problemId) {
  try {
    const solutions = await Solution.find({ problem: problemId })
      .populate("createdBy", "name lastname username")
      .select("createdBy");

    // Extract unique users
    const uniqueUsersMap = new Map();
    solutions.forEach((sol) => {
      if (sol.createdBy && !uniqueUsersMap.has(sol.createdBy._id.toString())) {
        uniqueUsersMap.set(sol.createdBy._id.toString(), sol.createdBy);
      }
    });

    return Array.from(uniqueUsersMap.values());
  } catch (error) {
    logger.error("Error fetching problem solvers", error);
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
  getProblemSolvers,
};
