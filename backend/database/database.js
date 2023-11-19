const dotenv = require('dotenv').config({path: '../.env'});

const mongoose = require('mongoose');
const {MONGODB_CONNECTION_STRING} = require('../config/config.js');

const ConnectionString = "mongodb+srv://salsuqe:hX7OfNHFiHzF3jzP@cluster0.7mzrs3c.mongodb.net/?retryWrites=true&w=majority";

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database connected to host: ${conn.connections[0].host}`);
    } catch (err) {
        console.error(`Error connecting to the database: ${err.message}`);
    }
};

module.exports = dbConnect;
