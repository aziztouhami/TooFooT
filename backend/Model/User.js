const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  pseudo: {
    type: String,
    required: true,
    unique: true,
  },
  classement: {
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
  niveau: {
    type: Number,
    default: 0, // Niveau initial
  },
  tryNumber: {
    type: Number,
    default: 5, // Nombre d'essais par défaut
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
