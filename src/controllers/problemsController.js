const ProblemService = require("../services/problemsService");
const logger = require("../utils/logger");

exports.getAllProblems = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const response = await ProblemService.getAllProblems({}, parseInt(page), parseInt(limit));
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.getDashboardStats = async(req, res) => {
  try {
    const response = await ProblemService.getDashboardStats({});
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.getFilteredProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...data } = req.body;
    const filters = {};
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        if (key === "title") {
          filters[key] = { $regex: data[key], $options: "i" };
        } else {
          filters[key] = data[key];
        }
      }
    });

    const response = await ProblemService.getFilteredProblems(filters, page, limit);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user.id;
    const response = await ProblemService.createProblem(data);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;
    const response = await ProblemService.getProblemById(problemId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const data = req.body;
    const response = await ProblemService.updateProblem(problemId, data);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    let response = await ProblemService.deleteProblem(problemId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.downloadTemplate = async (req, res) => {
  try {
    const buffer = await ProblemService.downloadTemplate();
    // Set response headers
    res.setHeader("Content-Disposition", 'attachment; filename="template.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    logger.error('Error generating template', { error: error.message });
    res.status(500).send("Error generating template");
  }
};

exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }

    const message = await ProblemService.handleFileUpload(req.file.buffer, req.user.id);
    res.status(200).send({ message: message, code: 200 });
    // res.status(200).send({ message: "Data uploaded and inserted successfully.", code: 200 });
  } catch (error) {
    logger.error('Error processing the file', { error: error.message });
    res.status(500).send({ message: "Error processing the file", error: error.message });
  }
};
