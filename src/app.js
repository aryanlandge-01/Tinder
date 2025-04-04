const express = require("express");
require('dotenv').config();
const connectDB = require("./config/database");
const User = require("./models/user");
const { Model } = require("mongoose");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');
const cors = require("cors");
const app = express();
const http = require('http');
const initiazeSocket = require("./utils/socket")

require("./utils/cronjob");



// Api for user Signup.

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// app.use(userAuth());



const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


app.get("/",(req,res) => {
     res.send("hello welcome to devtinder.")
    // console.log("<h1>Welcome to dev Tinder</h1>");
})
const server = http.createServer(app);
initiazeSocket(server);

connectDB().then(() => {
    console.log("Database connection established");
    server.listen(3000,() => {
        console.log("Server is listening on port 3000");
    })
}).catch(err => {
    console.log(err,"Database not connected!")
});




