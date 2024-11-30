
const mongoose= require('mongoose')
require('dotenv').config();
mongoose.connect( process.env.BD).then(()=>console.error('connexion réussie')).catch((err)=>console.error('connexion échouée',err))
module.exports = mongoose