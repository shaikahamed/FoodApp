

const userModel = require("../Model/userModel");

async function getAllUsersController(req, res){
    console.log(req.cookies);
    let users =  await userModel.find();
    res.json(users);
}

async function profileController(req, res){
    try{
        const userId = req.userId;
        //find user by given user Id
        let userData = await userModel.findById(userId);
        res.status(200).json({
            user: userData,
            message: "Data of logged in user fetched.",
        })
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    getAllUsersController,
    profileController
}