const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config')

const register = async userData => {
  User.create(userData);
}

const login = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const passwordMatch = user.validatePassword(password);

  if (!passwordMatch) {
    throw { message: 'Invalid password', status: 404 };
  }

  const payload = { _id: user._id, username: user.username }
  const token = jwt.sign(payload, SECRET);

  return token;
}

module.exports = { register, login }