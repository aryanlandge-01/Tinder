const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { Model } = require("mongoose");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');
const app = express();

// Api for user Signup.

app.use(express.json());
app.use(cookieParser());
// app.use(userAuth());


app.post("/signup",async (req,res) => {
    
    try {
        // validation 
        validateSignUpData(req)

        // Destructering the Data
        const {firstName,lastName,emailId,skills,age,gender,password} = req.body;

        // encrpt the password
        const passwordHash = await bcrypt.hash(password,10)
        console.log(passwordHash)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            skills,
            gender
        })

        await user.save();
        res.send("user added sucessfully!!!!")
    } catch (error) {
        res.status(400).send("Error saving the user:" + error.message)
    }

});

app.post("/login",async(req,res) => {
    try {
        const {emailId,password} = req.body;

        if(!validator.isEmail(emailId)){
            throw new Error("Invalid email address.")
        }

        const user = await User.findOne({emailId: emailId});

        if (!user){
            throw new Error("Invalid Credentials.");
        }

        // match the password.
        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid){
            throw new Error("Invalid Credentials.")
        }else{
            // Create a JWT Token offloaded login to the User Schema Method.
            const token = await user.getJWT();
            
            // Add the token to cookie and send the response back to the user.
            res.cookie("token",token,{
                expires: new Date(Date.now() + 8 * 3600000),
            });

            res.send("Login Sucessfully.");
        }
        

    } catch (error) {
        res.status(400).send("Don't have any account signup please." + error)
    }
})

app.get("/profile",userAuth,async(req,res) => {
   try { 
    const user = req.user;
    res.send(user)
   } catch (error) {
       res.status(400).send("Something went wrong.")
   }
})

app.post("/sendConnectionRequest",userAuth,async (req,res) => {
    // const user = req.user;
    // console.log("Sending the connection request!!!");
    try {
        const user = req.user;
        console.log(user);
        const name = user.firstName;
        res.send(name + " Sent you Connection Request.🔗")
    } catch (error) {
        res.status(400).send(
            "Something went wrong." 
            +
            error
        )
    }
    
});



app.get("/",(req,res) => {
     res.send("hello welcome to devtinder.")
    // console.log("<h1>Welcome to dev Tinder</h1>");
})



connectDB().then(() => {
    console.log("Database connection established");
    app.listen(3000,() => {
        console.log("Server is listening on port 3000");
    })
}).catch(err => {
    console.log(err,"Database not connected!")
});




