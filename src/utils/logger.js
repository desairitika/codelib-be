const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

function getTimestamp() {
  return new Date().toISOString();
}

function formatLog(level, message, data = null) {
  const timestamp = getTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
}

function error(message, data = null) {
  const logMessage = formatLog(logLevels.ERROR, message, data);
  console.error(logMessage);
  appendToFile('error.log', logMessage);
}

function warn(message, data = null) {
  const logMessage = formatLog(logLevels.WARN, message, data);
  console.warn(logMessage);
  appendToFile('warn.log', logMessage);
}

function info(message, data = null) {
  const logMessage = formatLog(logLevels.INFO, message, data);
  console.log(logMessage);
  appendToFile('info.log', logMessage);
}

function debug(message, data = null) {
  if (process.env.NODE_ENV === 'development') {
    const logMessage = formatLog(logLevels.DEBUG, message, data);
    console.debug(logMessage);
    appendToFile('debug.log', logMessage);
  }
}

function appendToFile(filename, message) {
  const logPath = path.join(logsDir, filename);
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dateLogPath = path.join(logsDir, `${dateStr}-${filename}`);
  
  fs.appendFile(dateLogPath, message + '\n', (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

module.exports = {
  error,
  warn,
  info,
  debug
};
