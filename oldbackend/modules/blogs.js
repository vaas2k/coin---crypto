const mongoose = require('mongoose');

const { Schema } = mongoose;

const blogSchema = new Schema({
    
    title: {type:String , required : true},
    content : {type:String , required : true},
    photoPath : {type:String , required : true},
    author : {type : Schema.Types.ObjectId , ref : 'USER'}
    
} , { timestamps : true }
)

module.exports = mongoose.model('BLOG',blogSchema,'blogs');