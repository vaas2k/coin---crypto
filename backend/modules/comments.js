const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentsSchema = new Schema({
     content : {type: String , required: true},
     author : {type : Schema.Types.ObjectId , ref : 'USER'},
     blog : {type: Schema.Types.ObjectId , ref : 'BLOG'}
} , { timestamps : true }
)

module.exports = mongoose.model('COMMENT',commentsSchema,'comments');