

const express = require('express')
const app = express();

const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
const userModel = require('./userModel');

//listen
app.listen(3000, function () {
    console.log("Server started at port 3000");
})

//post request from the user for signup new user
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


//post request from the user for login of existing user
app.post('/login', async function(req, res){
    try{
        let data = req.body;
        // console.log(data);
        let {email, password}= data;
        if(email && password){
            let user = await userModel.findOne({email:email});
            if(user){
                //user with given email exists
                if(user.password == password){
                    res.cookie("sample","cookie");
                    res.send("Login Successful");
                }
                else{
                    res.send("Enter valid credentials");
                }
            }else{
                res.send("Email doesn't exist! SignUp now...");
            }
        }else{
            res.send("Email or password fields can't be empty!!!");
        }
    }catch(error){
        res.send(error.message);
    }
})

//fetch the cookie sent previously
app.get('/users', function(req, res){
    console.log(req.cookies);
})