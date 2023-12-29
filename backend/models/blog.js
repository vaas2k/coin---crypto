const mongoose = require('mongoose');

const newBLOG = new mongoose.Schema({
    title : {type : String,require : true},
    content : {type :String , require : true},
    photoPath : {type : String, require : true}, 
    author : {type : mongoose.SchemaTypes.ObjectId , ref : 'User'}
})

module.exports = mongoose.model('Blog',newBLOG,'blogs');