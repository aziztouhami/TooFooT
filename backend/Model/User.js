const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  ranking: {
    type: Number,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Veuillez entrer une adresse e-mail valide'],
  },
  password: {
    type: String,
    required: true,
    
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  score: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0, 
  },
  tryNumber: {
    type: Number,
    default: 5, 
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
