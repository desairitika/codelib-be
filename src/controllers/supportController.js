const SupportService = require("../services/supportService");
const logger = require("../utils/logger");

exports.submitQuery = async (req, res) => {
  try {
    const data = req.body;
    const response = await SupportService.submitQuery(data);
    res.status(response.code).json(response);
  } catch (error) {
    logger.error('supportController error', { error: error.message });
    res.status(500).json({
      error: "Internal server error. Something went wrong on the server side.",
    });
  }
};
