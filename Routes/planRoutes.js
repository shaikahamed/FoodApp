const express = require("express");
const { getAllPlansController, createPlanController, 
    getPlanController, deletePlanController, updatePlanController } = require("../Controller/planController");


const planRouter = express.Router();

// planRouter.get("/");//get all plans

// planRouter.post("/");//create a new plan

//instead of writing as above we can do it as follows

planRouter.route("/")
    .get(getAllPlansController)
    .post(createPlanController);

// planRouter.patch("/:planRoutes");//update an existing plan

// planRouter.get("/:planRoutes");//get a plan based on id

// planRouter.delete("/:planRoutes");//delete a plan based on id

planRouter.route("/:planRoutes")
    .get(getPlanController)
    .patch(updatePlanController)
    .delete(deletePlanController)


module.exports = {planRouter};