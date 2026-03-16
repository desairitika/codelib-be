const Support = require("../../models/Support");

// Function to create a new user
async function createSupport(userData) {
  try {
    return await Support.create(userData);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createSupport
};
