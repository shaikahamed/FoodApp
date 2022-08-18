//username and password for mongodbAtlas : dbUser,  Bf3HYQLjMB8NqXeh

const mongoose = require('mongoose');

const dbAuth = "mongodb+srv://dbUser:Bf3HYQLjMB8NqXeh@cluster0.ulh85mc.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbAuth).then(function(){
    console.log("Connected to MongoDb Atlas");
}).catch(function(err){
    console.log("Error in dbConnection :", err);
})