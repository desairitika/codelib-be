const Problem = require("../../models/Problem");
const logger = require("../../utils/logger");

async function getCount(filters){
  return await Problem.countDocuments(filters);
}

async function createProblem(body) {
  try {
    return await Problem.create(body);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function getAllProblems(filter, page, limit) {
  try {
    const skip = (page - 1) * limit;

    const problems = await Problem.find(filter)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);

    return problems;
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}


async function getProblemById(id) {
  try {
    return await Problem.findById(id);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function updateProblemById(id, data) {
  try {
    return await Problem.findByIdAndUpdate(id, data, {
      new: true,
    });
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function deleteProblemById(id) {
  try {
    return await Problem.findByIdAndDelete(id);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function createProblemsInBulk(dataArray) {
  try {
    return await Problem.insertMany(dataArray);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

module.exports = {
  getCount,
  getAllProblems,
  createProblem,
  getProblemById,
  updateProblemById,
  deleteProblemById,
  createProblemsInBulk
};
