const dotenv = require('dotenv').config();

const express = require('express');
const app = express();
const dbConnect = require('./database/database.js');
const router = require('./routs/routers.js');
const errorthrow = require('./middlewares/errorhandler.js');
const cookieparser = require('cookie-parser')
const cors = require('cors');
const {PORT} = require('./config/config.js');

const config = {
    credentials : true,
    origin : 'http://localhost:3000'
  };


app.use(cookieparser());
app.use(cors(config));
app.use(express.urlencoded());
app.use(express.json());
app.use('storage/',express.static("storage"));

app.use(router);
dbConnect();


app.use(errorthrow);

app.listen(PORT,console.log(`Server listeing on Port : ${PORT}`) );