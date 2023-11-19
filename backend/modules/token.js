const { string } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenSchema = new Schema({
    token : {type : String, required : true},
    id : {type : mongoose.SchemaTypes.ObjectId , ref : 'USER'}  
},{
    timestamps : true
}
)

module.exports = mongoose.model('TOKEN',tokenSchema,'token') ;