const {
  getAllSolutions,
  createSolution,
  getSolutionById,
  updateSolutionById,
  deleteSolutionById,
} = require("../data/mongoose/solution");
const { dbErrorHandler } = require("../utils/errorHandler");
const { getResponseStructure } = require("../utils/helper");

class SolutionService {
  static async getAllSolutions() {
    try {
      const solutions = await getAllSolutions(problemId);
      return getResponseStructure(200, "message", "Success", solutions);
    } catch (err) {
      return dbErrorHandler(err);
    }
  }

  static async createSolution(data) {
    try {
      const solution = await createSolution(data);
      return getResponseStructure(201, "message", "Solution created successfully", solution);
    } catch (err) {
      return dbErrorHandler(err);
    }
  }

  static async getSolutionById(solutionId) {
    try {
      const solution = await getSolutionById(solutionId);
      return getResponseStructure(200, "message", "Success", solution);
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async updateSolution(solutionId, body) {
    try {
      if(!Object.keys(body).length){
        return getResponseStructure(204, "message", "");
      }
      const updatedSolution = await updateSolutionById(solutionId, body);
      return getResponseStructure(200, "message", "Solution updated successfully", updatedSolution);
    } catch (error) {
      return dbErrorHandler(error);
    }
  }

  static async deleteSolution(solutionId) {
    try {
      await deleteSolutionById(solutionId);
      return getResponseStructure(204, "message", "Solution Deleted Successful.");
    } catch (err) {
      return dbErrorHandler(err);
    }
  }
}

module.exports = SolutionService;
