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
        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            throw new Error("Invalid Credentials.")
        }else{
            // Create a JWT Token
            const token = await jwt.sign({_id: user._id},"Heil@007") 
            // console.log(token);
            
        
            // Add the token to cookie and send the response back to the user.
            res.cookie("token",token);
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

app.get("/feed",async (req,res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).send("Something went Wrong.!!")
    }
})

app.get("/username",async (req,res) => {
    // res.send("You will get the userinfo here.")
    const useremail = req.body.emailId;
    
    try {
        const users = await User.findOne({emailId: useremail});

        // handling the error.
        if(!users){
            res.status(404).send("User not Found");
        }else{
            res.send(users);
        }
        
    } catch (error) {
        res.status(400).send("Something went wrong!!");
        // console.log(error);
    }
    // finding user via it's email.
    

})

app.get("/userId",async (req,res) => {
    const userid = req.body._id;

    try {
        const user = await User.findById(userid);
        if (!user){
            res.status(404).send("User not Found");
        }else{
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Something went wrong!!!")
    }
})

app.get("/",(req,res) => {
     res.send("hello welcome to devtinder.")
    // console.log("<h1>Welcome to dev Tinder</h1>");
})

app.delete("/delete",async (req,res) => {
    const userId = req.body.userId;

    try {
        // shorthand of {_id : userId} === userId directly.
       const user = await User.deleteMany();
    //    if (!user){
    //         res.status(404).send("User not found.")
    //    } else{
        res.send("user deleted Sucessfully");
    //    }
    } catch (error) {
        res.status(400).send("something went wrong!!")
    }
})

app.patch("/user/:userId",async (req,res) => {
    const userId = req.params?.userId;
    const data = req.body;

    console.log(req.body);

    try {
        // API level Validation or Data Santization.
        const ALLOWED_UPDATES = ["photoUrl","about","age","gender","skills"];

        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed){
            throw new Error("Update not allowed")
        }

        // if (data?.skills.length > 10) {
        //     throw new Error("Skills cannnot be more than 10.")
        // }


        const user = await User.findByIdAndUpdate(
            {_id: userId},
            data,
            {
            returnDocument: "after",
            runValidators: true
            }
        );
        
        if (!user){
            res.status(404).send("user not found.")
        }else {
            res.send("user details updated sucessfully.")
        }
        
        
    } catch (error) {
        res.status(400).send("User details not updated sucessfully." + error.message)
    }
})


connectDB().then(() => {
    console.log("Database connection established");
    app.listen(3000,() => {
        console.log("Server is listening on port 3000");
    })
}).catch(err => {
    console.log(err,"Database not connected!")
});




