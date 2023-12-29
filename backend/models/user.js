const mongoose = require('mongoose');

const newUSER = new mongoose.Schema({
    name : {type : String,require : true},
    username : {type :String , require : true},
    email : {type : String , require : true},
    password : {type : String, require : true}
})

module.exports = mongoose.model('User',newUSER,'users');