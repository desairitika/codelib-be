const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/codelib-dev').then(() => {
  return mongoose.connection.collection('users').findOne({});
}).then(user => {
  console.log(user ? user.email : 'No user found');
  process.exit(0);
}).catch(console.error);
