

const express = require('express')
const app = express();

app.use(express.json());

const userModel = require('./userModel');

//listen
app.listen(3000, function () {
    console.log("Server started at port 3000");
})

//post request from the user
app.post('/signup', async function (req, res) {
    try {
        let data = req.body;
        let newUser = await userModel.create(data);
        console.log(newUser);
        res.json({
            message: "Data received",
            data: data
        })
    }catch(err){
        res.send(err.message);
    }
    
})