const createError = require("http-errors");
const { getResponseStructure } = require("./helper");
const logger = require("./logger");

function notFound(req, res, next) {
  next(createError(404));
}

function handleServerError(err, req, res, next) {
  const isDevelopment = req.app.get("env") === "development";
  const statusCode = err.status || err.statusCode || 500;
  
  // Log the error
  logger.error('Request error', {
    statusCode,
    message: err.message,
    path: req.path,
    method: req.method,
    stack: isDevelopment ? err.stack : undefined
  });

  res.locals.message = err.message;
  res.locals.error = isDevelopment ? err : {};

  // For API requests, return JSON response
  if (req.accepts('json')) {
    return res.status(statusCode).json(
      getResponseStructure(
        statusCode,
        'error',
        isDevelopment ? err.message : 'An error occurred processing your request',
        isDevelopment ? { stack: err.stack } : null
      )
    );
  }

  // For page requests, render error view
  res.status(statusCode);
  res.render("error", {
    title: "CodeLib - Error",
    message: err.message,
    status: statusCode,
    error: isDevelopment ? err : {}
  });
}

function dbErrorHandler(error) {
  logger.error('Database error', { errorName: error.name, code: error.code });
  
  if (error.code && error.code === 11000) {
    const errorMessage = error.message;
    const keyNameMatch = /index: ([^\s]+)/.exec(errorMessage);
    if (keyNameMatch) {
      const keyName = keyNameMatch[1].split("_")[0];
      return getResponseStructure(400, "error", `${keyName} already exists`);
    } else {
      return getResponseStructure(400, "error", `Duplicate key error: field already in use`);
    }
  } else if (error.name === "CastError") {
    return getResponseStructure(400, "error", `Invalid ID format`);
  } else if (error.name === "ValidationError") {
    const field = Object.keys(error.errors)[0];
    const message = error.errors[field]?.message || "Validation failed";
    return getResponseStructure(400, "error", message);
  } else {
    logger.error('Unhandled database error', { message: error.message });
    return getResponseStructure(500, "error", "An error occurred processing your request");
  }
}

module.exports = {
  notFound,
  handleServerError,
  dbErrorHandler,
};
