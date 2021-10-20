const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    minlength: 5,
    required: true
  },
  password: {
    type: String,
    minlength: 4,
    required: true
  }
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    });
});

userSchema.method('validatePassword', function (password) {
  return bcrypt.compare(password, this.password);
});

const User = mongoose.model('User', userSchema);
module.exports = User;