const mongoose = require('mongoose');

const newCOMMENT = new mongoose.Schema({
    content : {type :String , require : true},
    blog : {type : mongoose.SchemaTypes.ObjectId , ref : 'Blog'},
    author : {type : mongoose.SchemaTypes.ObjectId , ref : 'User'}
})

module.exports = mongoose.model('Comment',newCOMMENT,'comments');