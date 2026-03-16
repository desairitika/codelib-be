const mongoose = require('mongoose');

const env = require('./env'); // Import your environment variables file

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 60000
};

let dbInstance = null;

async function connectToDatabase() {
  const logger = require('../src/utils/logger');
  try {
    const uri = env.MONGODB_URI;
    await mongoose.connect(uri, options);

    dbInstance = mongoose.connection;

    dbInstance.once('connected', () => {
      logger.info('Connected to database');
    });
    dbInstance.on('error', (err) => {
      logger.error('Failed to connect to database', { error: err.message });
    });
    dbInstance.on('disconnected', () => {
      logger.info('Disconnected from database');
    });
  } catch (error) {
    const loggerLocal = require('../src/utils/logger');
    loggerLocal.error('Error connecting to database', { error: error.message });
    throw error; // Rethrow the error to handle it in the caller function
  }
}

function getDatabaseInstance() {
  if (!dbInstance) {
    throw new Error('Database connection has not been established. Call connectToDatabase() first.');
  }
  return dbInstance;
}

module.exports = { connectToDatabase, getDatabaseInstance };