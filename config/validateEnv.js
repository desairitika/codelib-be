/**
 * Validate that all required environment variables are set
 * This should be called at application startup before any other initialization
 */
function validateEnvironmentVariables() {
  const requiredVars = [
    'MONGODB_URI',
    'SECRET_KEY',
    'GMAIL_USER',
    'NODE_ENV',
    'PORT'
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  const logger = require('../src/utils/logger');
  if (missingVars.length > 0) {
    logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    logger.error('Please check your .env file or environment configuration');
    process.exit(1);
  }

  // Validate PORT is a valid number
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    logger.error(`Invalid PORT: ${process.env.PORT}. Must be a number between 1 and 65535`);
    process.exit(1);
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    logger.error(`Invalid NODE_ENV: ${process.env.NODE_ENV}. Must be one of: ${validEnvs.join(', ')}`);
    process.exit(1);
  }

  logger.info('All environment variables validated');
}

module.exports = { validateEnvironmentVariables };
