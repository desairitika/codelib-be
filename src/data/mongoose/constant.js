const Constant = require("../../models/Constant");
const logger = require("../../utils/logger");
const { dbErrorHandler } = require("../../utils/errorHandler");

async function getAllConstants(filter) {
  try {
    return await Constant.find(filter).select("label value type icon -_id");
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function saveConstant(element) {
  try {
    return await Constant.create(element);
  } catch (err) {
    return dbErrorHandler(err);
  }
}

async function createConstant(data) {
  try {
    const constants = await Promise.all(
      data.map(async (element) => {
        return await saveConstant(element);
      })
    );
    return constants;
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function updateConstantById(constId, payload) {
  try {
    return await Constant.findByIdAndUpdate(constId, payload, {
      new: true,
    });
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

async function deleteConstantById(constId) {
  try {
    return await Constant.findByIdAndDelete(constId);
  } catch (error) {
    logger.error("Unexpected error:", error);
    throw error;
  }
}

module.exports = {
  getAllConstants,
  createConstant,
  updateConstantById,
  deleteConstantById
};
