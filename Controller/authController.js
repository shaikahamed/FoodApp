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
        res.status(500).json({
            result: err.message
        });
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
                    res.status(200).json({user});
                }
                else {
                    res.status(400).json({result:"Email or password incorrect"})
                }
            } else {
                res.status(400).json({result:"User with this email doesn't exist. Kindly SignUp"})
            }
        } else {
            res.status(400).json({result:"Kindly enter mail and password fields."})
        }
    } catch (error) {
        res.status(500).json({
            result: err.message
        });
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
        res.status(500).json({
            result: err.message
        });
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
        res.status(500).json({
            result: err.message
        });
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