const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017/iNotebook";
const connectToMongo=()=>{

    mongoose.connect(mongoURI)
        .then(()=>{
        console.log("connected to mongo successfully");
        }).catch((err)=>{
            console.log("Failed to connect to mongo");
            console.log(err);
        })
    }


module.exports=connectToMongo;