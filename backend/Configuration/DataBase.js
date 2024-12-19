const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB)
    .then(() => console.error('Connection successful'))
    .catch((err) => console.error('Connection failed', err));

module.exports = mongoose;
