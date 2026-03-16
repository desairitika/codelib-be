const { createUser } = require("../data/mongoose/user");
const { hashPassword } = require("../utils/authUtils");
const { validateUserCred } = require("../validators/credentialsValidator");
const { getResponseStructure } = require("../utils/helper");
const { dbErrorHandler } = require("../utils/errorHandler");
// const { getUiConstants } = require("../data/mongodb/commonDAL");
const { getAllConstants, createConstant, updateConstantById, deleteConstantById } = require("../data/mongoose/constant");
const { getCount } = require("../data/mongoose/problem");

async function createUserPayload(userData, apiName = "") {
  try {
    let { name, lastname, username, email, password, gender, role } = userData;
    const validation = validateUserCred(userData);
    if (validation != "Success") {
      return validation;
    }
    username = username ? username.toLowerCase().trim() : username;
    email = email ? email.toLowerCase().trim() : email;
    const hashedPassword = password ? await hashPassword(password.trim()) : password;
    // Create new user and save to DB
    const newUser = await createUser({
      name,
      lastname,
      username,
      email,
      password: hashedPassword,
      gender,
      ...(apiName == "users" && { role }),
    });

    return getResponseStructure(201, "message", "User created successfully", { username: newUser.username }, "user");
  } catch (err) {
    return dbErrorHandler(err);
  }
}

async function getConstants(payload) {
  try {
    const constants = await getAllConstants(payload);
    // const constants = await getUiConstants(payload);
    return getResponseStructure(200, "message", "Success", constants, "data");
  } catch (error) {
    return dbErrorHandler(error);
  }
}

async function createConstants(payload) {
  const keys = Object.keys(payload);
  try {
    if (keys.length) {
      let data = [];
      keys.forEach((key) => {
        if (Array.isArray(payload[key])) {
          let obj = {};
          payload[key].forEach((cat) => {
            data.push({
              type: key,
              label: cat,
              value: cat.trim().toLowerCase().replace(" ", ""),
            });
          });
        } else {
          data.push({
            type: key,
            label: payload[key],
            value: payload[key].trim().toLowerCase().replace(" ", ""),
          });
        }
      });
      const constants = await createConstant(data);
      return getResponseStructure(200, "message", "Success", constants, "data");
    } else {
      return getResponseStructure(400, "message", "Bad Request");
    }
  } catch (error) {
    return dbErrorHandler(error);
  }
}

async function updateConstants(constId, payload) {
  try {
    if (!Object.keys(payload).length) {
      return getResponseStructure(204, "message", "");
    }
    const updatedConstant = await updateConstantById(constId, payload);
    return getResponseStructure(200, "message", "Constant updated successfully", updatedConstant);
  } catch (error) {
    return dbErrorHandler(error);
  }
}

async function deleteConstants(constId) {
  try {
    await deleteConstantById(constId);
    return getResponseStructure(204, "message", "Constant Deleted Successful.");
  } catch (err) {
    return dbErrorHandler(err);
  }
}

module.exports = {
  createUserPayload,
  getConstants,
  createConstants,
  updateConstants,
  deleteConstants,
};
