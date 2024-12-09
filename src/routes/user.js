const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");


// get all the pending connection request for the loggedIn User 
userRouter.get(
    "/user/request/receive",
    userAuth,
    async (req,res) => {
        try {
            const loggedInUser = req.user;

            const connectionRequests = await ConnectionRequests.find({
                toUserId: loggedInUser._id,
                status: "interested",
            }).populate("fromUserId",["firstName","lastName","age","gender","photoUrl"]);

            res.json({
                message: "Data fetched successfully",
                data: connectionRequests
            })

        } catch (error) {
            res.status(400).send("error: " + error)
        }

})



module.exports = userRouter;