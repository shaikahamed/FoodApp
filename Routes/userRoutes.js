const express = require("express");

const {getAllUsersController, profileController} = require("../Controller/userController");

const {protectRoute} = require("../Controller/authController");

const userRouter = express.Router();

userRouter.get("/user", protectRoute, profileController);

userRouter.get("/users", protectRoute, getAllUsersController);

module.exports = {userRouter};