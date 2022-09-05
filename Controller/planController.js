const foodPlanModel = require("../Model/planModel.js");

async function getAllPlansController(req, res){
    try{
        let plans = await foodPlanModel.find();
        res.status(200).json({
            plans: plans
        })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}


async function createPlanController(req, res){
    try{
        let data = req.body;
        let newPlan = await foodPlanModel.create(data);
        res.status(201).json({
            message: "new plan created successfully",
            newPlan: newPlan,
        })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}


async function getPlanController(req, res){
    try{
        let id = req.params.planRoutes;
        let planData = await foodPlanModel.findById(id);
        res.status(200).json({
            message: "plan found",
            plan: planData,
        })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}

async function updatePlanController(req, res){
    try{
        let data = req.body;
        let id = req.params.planRoutes;
        const plan = await foodPlanModel.findById(id);
        for(let key in data){
            plan[key] = data[key];
        }
        await plan.save();
        res.status(200).json({
            message: "plan updated",
            plan: plan,
        })

    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}


async function deletePlanController(req, res){
    try{
        let id = req.params.planRoutes;
        const planDeleted = await foodPlanModel.findByIdAndDelete(id);
        res.status(200).json({
            message: "plan deleted",
            deletedPlan: planDeleted,    
        })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}

module.exports = {
    getAllPlansController,
    getPlanController,
    updatePlanController,
    deletePlanController,
    createPlanController
}