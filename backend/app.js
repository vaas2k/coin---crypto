const express = require('express');
const DBConnect = require('./Database/database');
const router = require('./router/router');
const ErrorHandler = require('./middlewares/errorhandler');
const cookieparser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cookieparser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(router);
app.use('storage/',express.static('storage'));

DBConnect();

app.use(ErrorHandler);
app.listen(9090,()=>{
    console.log(`Server Listening on ${9090}`);
})