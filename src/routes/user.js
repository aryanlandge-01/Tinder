const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName age gender photoUrl skills"


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
            }).populate("fromUserId",["firstName","lastName","age","gender","photoUrl","skills"]);

            res.json({
                message: "Data fetched successfully",
                data: connectionRequests
            })

        } catch (error) {
            res.status(400).send("error: " + error)
        }

})

userRouter.get(
    "/user/connections",
    userAuth,
    async (req,res) => {
        try {
            const loggedInUser = req.user;

            const connectionRequests = await ConnectionRequests.find(
                {
                    $or: [
                        {toUserId: loggedInUser._id,status: "accepted"},
                        {fromUserId: loggedInUser._id,status: "accepted"}
                    ]
                }
            ).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);


            const data = connectionRequests.map((row) =>  {
                if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                    return row.toUserId;
                }
                return row.fromUserId
            });

            res.json({
                message: "Connections Fetched Successfully",
                data: data
            });



        } catch (error) {
            res.status(400).json({
                message: "error " + error.message
            })
        }

})





module.exports = userRouter;