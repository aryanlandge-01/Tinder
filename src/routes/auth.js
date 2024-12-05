const express = require('express');
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const { Model } = require("mongoose");
const validator = require('validator');
const authRouter = express.Router();

authRouter.post("/signup",async (req,res) => {
    
    try {
        // validation 
        validateSignUpData(req)

        // Destructering the Data
        const {firstName,lastName,emailId,skills,age,gender,password} = req.body;

        // encrpt the password
        const passwordHash = await bcrypt.hash(password,10)
        // console.log(passwordHash)

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

authRouter.post("/login",async(req,res) => {
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

authRouter.post("/logout",async (req,res) => {
    res.cookie("token",null,{
        expires: new Date(Date.now())
    });

    res.send("You are successfully logout from the system.");
})

authRouter.patch("/forgotpassword",async (req,res) => {
    try {
        const emailId = req.body.emailId;
        const newPassword = req.body.newPassword;

        if(!validator.isEmail(emailId)){
            throw new Error("Invalid Email Address.")
        }

        const user = await User.findOne({emailId: emailId});

        if (user) {

            const passwordHash = await bcrypt.hash(newPassword,10);

            const updatedPassword = await User.findByIdAndUpdate(user._id,{password: passwordHash});

            res.send("Password has been updated Successfully.")

        } else {
            throw new Error("Signup Please!!!")
        }

    } catch (error) {
        res.status(400).send("Something went wrong." + error.message)
    }
})

module.exports = authRouter;