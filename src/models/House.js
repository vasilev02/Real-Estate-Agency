const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 6,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    min: 1850,
    max: 2021,
    required: true,
  },
  city: {
    type: String,
    minlength: 4,
    required: true,
  },
  homeImage: {
    type: String,
    validate: /^https?/,
    required: true,
  },
  description: {
    type: String,
    maxlength: 60,
    required: true,
  },
  availablePieces: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  rentedHome: [{
    type: mongoose.Types.ObjectId,
    ref: 'User'
}],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },

});

const House = mongoose.model("House", houseSchema);

module.exports = House;
