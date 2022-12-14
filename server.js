const express = require('express')
const app = express();

const {userRouter} = require("./Routes/userRoutes");
const {authRouter} = require("./Routes/authRoutes");
const {planRouter} = require("./Routes/planRoutes");
const cookieParser = require('cookie-parser');
const foodReviewModel = require('./Model/reviewModel');
const foodPlanModel = require('./Model/planModel');
const { reviewRouter } = require('./Routes/reviewRoutes');


app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/plan",planRouter);
app.use("/api/v1/review",reviewRouter);

//secret key for jwt token
/*format of JWT
    var jwt = require('jsonwebtoken');
    var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
*/ 


//listen
app.listen(3000, function () {
    console.log("Server started at port 3000");
})
