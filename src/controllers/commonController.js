const CommonService = require("../services/commonService");
const logger = require("../utils/logger");

exports.getConstants = async (req, res) => {
  try {
    const body = req.body || {};
    const response = await CommonService.getConstants(body);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.createConstants = async (req, res) => {
  try {
    const response = await CommonService.createConstants(req.body);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.updateConstants = async (req, res) => {
  try {
    const { constId } = req.params;
    const data = req.body;
    const response = await CommonService.updateConstants(constId, data);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};

exports.deleteConstants = async (req, res) => {
  try {
    const { constId } = req.params;
    let response = await CommonService.deleteConstants(constId);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error(error.message || error);
    res.status(500).json({ error: "Internal server error. Something went wrong on the server side." });
  }
};
