const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String
  },
  cover:{
    data: Buffer,
    contentType: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define available roles
    default: 'user' // Default role is 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);