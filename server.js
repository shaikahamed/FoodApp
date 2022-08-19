

const express = require('express')
const app = express();

app.use(express.json());

const userModel = require('./userModel');

//listen
app.listen(3000, function(){
    console.log("Server started at port 3000");
})

//post request from the user
app.post('/signup', async function(req, res){
    let data = req.body;
    console.log(data);
    let newUser = userModel.create(data);
    res.json({
        message: "Data received",
        data: data
    })
})