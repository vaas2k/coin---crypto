const mongoose = require('mongoose');

const MongoString = "mongodb+srv://salsuqe:hX7OfNHFiHzF3jzP@cluster0.7mzrs3c.mongodb.net/?retryWrites=true&w=majority";

const DBConnect = async () => {

    try{

        const conn = await mongoose.connect(MongoString,{
            useNewUrlParser: false,
            useUnifiedTopology: false,
        })

        console.log(`Database Connected Successfully to Host : ${conn.connections[0].host}`);
    }catch(err){
        console.log(err);
    }

}

module.exports = DBConnect;