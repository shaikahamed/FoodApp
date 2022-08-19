//username and password for mongodbAtlas : dbUser,  Bf3HYQLjMB8NqXeh

const mongoose = require('mongoose');

const dbAuth = "mongodb+srv://dbUser:Bf3HYQLjMB8NqXeh@cluster0.ulh85mc.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbAuth).then(function(){
    console.log("Connected to MongoDb Atlas");
}).catch(function(err){
    console.log("Error in dbConnection :", err);
})

//first create a schema for the database 

const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPassword:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNo:{
        type: String,
        maxLength:10, 
        minLength:10
    },
    pic:{
        type: String,
        default:"logo2.png"
    }
});

//Schemas should be converted into models to work with

const userModel = mongoose.model("FoodUserModel", userSchema);
module.exports = userModel;