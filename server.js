const express = require('express')
const app = express();

const {userRouter} = require("./Routes/userRoutes");
const {authRouter} = require("./Routes/authRoutes");
const {planRouter} = require("./Routes/planRoutes");
const cookieParser = require('cookie-parser');
const foodReviewModel = require('./Model/reviewModel');


app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/plan",planRouter);


//for simplicity we write the controller for the plan review model here
app.post("/api/v1/review", async function(req, res){
    try{
        let data = req.body;
        let reviewModel = await foodReviewModel.create(data);
        res.status(201).json({
            message: "review created",
            data: data,
        })
    }catch(err){
        res.status(500).json({
            message: err.message,
        })
    }
})

//secret key for jwt token
/*format of JWT
    var jwt = require('jsonwebtoken');
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
*/ 


//listen
app.listen(3000, function () {
    console.log("Server started at port 3000");
})
