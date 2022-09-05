
const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    description:{
        type: String,
        required : [true, "description can't be empty."]
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
        required:[true, "rating required."]
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.ObjectId,
        required: [true, "you need to be a user to review, kindly login first."],
        ref: FoodUserModel,
    },
    plan:{
        type: mongoose.Schema.ObjectId,
        required: [true, "you need to select a plan to review"],
        ref: foodPlanModel,
    }
})

const foodReviewModel = mongoose.model('foodReviewModel', reviewSchema);

module.exports = foodReviewModel;