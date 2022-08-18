

const express = require('express')
const app = express();


const userModel = require('./userModel');

//listen
app.listen(3000, function(){
    console.log("Server started at port 3000");
})

