const { getDatabaseInstance } = require("../../../config/db");

const constants_collection = "constants";

module.exports = {
  async getUiConstants(filter) {
    try {
      const db = getDatabaseInstance();
      return db.collection(constants_collection).find(filter).sort().toArray();
    } catch (error) {
      throw error;
    }
  },
};
