const mongoose = require('mongoose');

const footballPlayerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  nicknames: {
    type: [String], 
    required: true,
  },
  difficultylevel: {
    type: Number, 
    required: true,
    min: 1, 
   
  },
  imageCache: {
    type: String, 
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  description: {
    type: String, 
    required: true,
    maxlength: 500, 
  },
}, { timestamps: true }); 

const FootballPlayer = mongoose.model('FootballPlayer', footballPlayerSchema);

module.exports = FootballPlayer;
