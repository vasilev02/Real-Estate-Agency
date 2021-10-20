const mongoose = require('mongoose');

const initDatabase = connectionString => mongoose.connect(connectionString);

module.exports = initDatabase
