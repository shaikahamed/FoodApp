const express = require('express')
const app = express();
const cookieParser = require('cookie-parser');
const jsonWebToken = require('jsonwebtoken');

app.use(express.json());
app.use(cookieParser());
const userModel = require('./Model/userModel');

//secret key for jwt token
/*format of JWT
    var jwt = require('jsonwebtoken');
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
*/ 
let secretKey = 'jdfsladf3904jslkdjf';

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
                    let token = jsonWebToken.sign({ data:user['_id'] }, secretKey);
                    console.log(token);
                    //store this token as a cookie on the user web browser
                    res.cookie("JWT", token);
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

//fetch all the users available in mongodb using the jwt token sent previously
app.get('/users', protectRoute, async function(req, res){
    console.log(req.cookies);
    let users =  await userModel.find();
    res.json(users);
})

//fetch a particular user document once logs in using the jwt token cookie
app.get('/user', protectRoute, async function(req, res){
    try{
        const userId = req.userId;
        //find user by given user Id
        let userData = await userModel.findById(userId);
        res.json({
            userData: userData,
            message: "Data of logged in user fetched.",
        })
    }catch(error){
        res.send(error.message);
    }
})

//middleware for checking the correct user
function protectRoute(req, res, next){
    try{
        let cookie = req.cookies;
        if(cookie.JWT){
            let JWT = cookie.JWT;
            let token = jsonWebToken.verify(JWT, secretKey);
            console.log(token);
            let userId = token.data;
            req.userId = userId;
            next();
        }else{
            res.send("You need to login first.");
        }
    }catch(error){
        console.log(error.message);
        res.send(error.message);
    }
}

//forgot password
app.patch('/forgotPassword', async function(req, res){
    try{
        let {email} = req.body;
        let otp = otpGenerator();
        let afterFiveMin = Date.now();
        let updatedUser = await userModel.findOneAndUpdate({email},{otp:otp, otpExpiry:afterFiveMin},{new:true});
        console.log(updatedUser);
        res.json({
            user: updatedUser,
            message: "User record updated with OTP"
        })
    }catch(error){
        res.send(error.message);
    }
})

function otpGenerator(){
    return Math.floor(Math.random() * 1000000);
}

//reset password
app.patch('/resetPassword', async function(req, res){
    try{
        let {email,otp,password,confirmPassword} = req.body;
        let updatedUser = await userModel.findOne({email});
        let currentTime = Date.now();
        if(updatedUser.otpExpiry < currentTime){
            if(updatedUser.otp != otp){
                res.json({
                    message:"Incorrect OTP!",
                })
            }
            else{
                let user = await userModel.findOneAndUpdate({otp},{password, confirmPassword}, {runValidators: true, new: true});
                delete user.otp;
                delete user.otpExpiry;
                await user.save();
                res.json({
                    user:user,
                    message: "Password Updated.",
                })
            }
        }else{
            delete updatedUser.otp;
            delete updatedUser.otpExpiry;
            await updatedUser.save();
            res.json({
                message:"OTP Expired!",
            })
        }
    }catch(error){
        res.send(error.message);
    }
})