
const express = require("express");
const { createReviewController, getAllReviewController } = require("../Controller/reviewController");

const reviewRouter = express.Router();


reviewRouter.route("/").post(createReviewController).get(getAllReviewController);

module.exports = {reviewRouter};