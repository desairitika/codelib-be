require("dotenv").config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/codelib-dev',
  SECRET_KEY: process.env.SECRET_KEY || 'development',
  GMAIL_USER: process.env.GMAIL_USER || 'desairitika157@gmail.com',
  GMAIL_PASS: process.env.GMAIL_PASS || 'ondvydrdggzsdzaw',
};

module.exports = env;
