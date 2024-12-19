const express = require('express');
var cors = require('cors')
const path = require('path');
const routes = require('./Routes/Routes.js');

const app = express();
app.use(cors())

app.use(express.json());

require('./Configuration/DataBase.js')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


require("dotenv").config();
const port=process.env.PORT;


app.use('/api', routes);


app.listen(port, () => console.log(`Server Started on port ${port}`));
