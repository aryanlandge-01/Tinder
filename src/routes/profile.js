const express = require("express");
const User = require("../models/user");
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const {validateEditProfileData} = require('../utils/validation');



profileRouter.get("/profile/view",userAuth,async(req,res) => {
    try { 
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("Something went wrong.")
    }
})

profileRouter.patch("/profile/edit",userAuth,async (req,res) => {
    try {
        // API level validation or Data Sanitization.
        if(!validateEditProfileData(req)){
            throw new Error("Invalid data edit.")
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        
        res.json({
            message: `${loggedInUser.firstName} your Profile updated successfully`,
            data: loggedInUser,
        });


    } catch (error) {
        res.status(400).send(error.message + "Something went wrong.")
    }
})



module.exports = profileRouter;