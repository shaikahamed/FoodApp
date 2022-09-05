
const mongoose = require("mongoose");
const foodReviewModel = require("./reviewModel");

let planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "plan name required."],
        unique:[true, "plan name should be unique."],
        maxlength: [40, "name too long (<40)"],
    },
    duration: {
        type: Number,
        required: [true, "plan duration required."],
    },
    price: {
        type: Number,
        required: [true, "plan price is required."],

    },
    discount: {
        type: Number,
        required: true,
        validate: {
            validator: function (){
                return this.price * 0.5 >= this.discount;
            },
            message: "discount can't be greater than 50% of the price.",
        }
    },
    reviews:{
        type: [mongoose.Schema.ObjectId],
        ref: foodReviewModel,
    },
    avgRating:{
        type:Number
    }
})

const foodPlanModel = mongoose.model("foodPlanModel", planSchema);

module.exports = foodPlanModel;