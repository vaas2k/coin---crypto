const mongoose = require('mongoose');

const newTOKEN = new mongoose.Schema({
    token : {type: String, require : true},
    id : {type : mongoose.SchemaTypes.ObjectId, ref : 'User'}
},{
    timestamps : true,
});

module.exports = mongoose.model('Token',newTOKEN,'token');