const express = require("express");

const {signUpController, loginController, forgotPasswordController, resetPasswordController} = require("../Controller/authController");

const authRouter = express.Router();

authRouter.post("/signup", signUpController);

authRouter.post("/login", loginController);

authRouter.patch("/forgotPassword", forgotPasswordController);

authRouter.patch("/resetPassword", resetPasswordController);

module.exports = {authRouter};