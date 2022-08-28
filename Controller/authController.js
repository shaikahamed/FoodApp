const userModel = require("../Model/userModel");
const jsonWebToken = require('jsonwebtoken');
const {nodeMailer} = require('../Utilities/nodeMailer');


let secretKey = 'jdfsladf3904jslkdjf';

async function signUpController(req, res) {
    try {
        let data = req.body;
        let newUser = await userModel.create(data);
        console.log(newUser);
        res.json({
            message: "Data received",
            data: data
        })
    } catch (err) {
        res.send(err.message);
    }

}

async function loginController(req, res) {
    try {
        let data = req.body;
        // console.log(data);
        let { email, password } = data;
        if (email && password) {
            let user = await userModel.findOne({ email: email });
            if (user) {
                //user with given email exists
                if (user.password == password) {
                    let token = jsonWebToken.sign({ data: user['_id'] }, secretKey);
                    console.log(token);
                    //store this token as a cookie on the user web browser
                    res.cookie("JWT", token);
                    res.send("Login Successful");
                }
                else {
                    res.send("Enter valid credentials");
                }
            } else {
                res.send("Email doesn't exist! SignUp now...");
            }
        } else {
            res.send("Email or password fields can't be empty!!!");
        }
    } catch (error) {
        res.send(error.message);
    }
}

//middleware for checking the correct user
function protectRoute(req, res, next) {
    try {
        let cookie = req.cookies;
        if (cookie.JWT) {
            let JWT = cookie.JWT;
            let token = jsonWebToken.verify(JWT, secretKey);
            console.log(token);
            let userId = token.data;
            req.userId = userId;
            next();
        } else {
            res.send("You need to login first.");
        }
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
}


async function forgotPasswordController(req, res) {
    try {
        let { email } = req.body;
        let user = await userModel.findOne({ email });
        if (user) {
            let otp = otpGenerator();
            let afterFiveMin = Date.now();
            let updatedUser = await userModel.findOneAndUpdate({ email }, { otp: otp, otpExpiry: afterFiveMin }, { new: true });
            console.log(updatedUser);
            await nodeMailer(email, otp);
            res.json({
                user: updatedUser,
                message: "OTP sent to mail."
            })
        }
        else {
            res.json({
                message:"mail doesn't exist!"
            })
        }
    } catch (error) {
        res.send(error.message);
    }
}

function otpGenerator() {
    return Math.floor(Math.random() * 1000000);
}

async function resetPasswordController(req, res) {
    try {
        let { email, otp, password, confirmPassword } = req.body;
        let updatedUser = await userModel.findOne({ email });
        let currentTime = Date.now();
        if (updatedUser.otpExpiry < currentTime) {
            if (updatedUser.otp != otp) {
                res.json({
                    message: "Incorrect OTP!",
                })
            }
            else {
                let user = await userModel.findOneAndUpdate({ otp }, { password, confirmPassword }, { runValidators: true, new: true });
                delete user.otp;
                delete user.otpExpiry;
                await user.save();
                res.json({
                    user: user,
                    message: "Password Updated.",
                })
            }
        } else {
            delete updatedUser.otp;
            delete updatedUser.otpExpiry;
            await updatedUser.save();
            res.json({
                message: "OTP Expired!",
            })
        }
    } catch (error) {
        res.send(error.message);
    }
}

module.exports = {
    signUpController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    protectRoute
}