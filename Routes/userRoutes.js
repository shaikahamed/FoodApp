const express = require("express");

const {getAllUsersController, profileController} = require("../Controller/userController");

const {protectRoute} = require("../Controller/authController");

const userRouter = express.Router();

userRouter.get("/", protectRoute, profileController);

userRouter.get("/profile", protectRoute, getAllUsersController);

module.exports = {userRouter};