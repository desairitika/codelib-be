const { createSupport } = require("../data/mongoose/support");
const { getResponseStructure } = require("../utils/helper");
const { dbErrorHandler } = require("../utils/errorHandler");

class SupportService {
  static async submitQuery(data) {
    try {
      if (!data || !data.email || !data.message) {
        return getResponseStructure(
          400,
          "error",
          "Either email or message is missing"
        );
      }
      const users = await createSupport(data);
      return getResponseStructure(
        200,
        "message",
        "We have received your message."
      );
    } catch (err) {
      return dbErrorHandler(err);
    }
  }
}

module.exports = SupportService;
