const express = require("express");
const {userAuth} = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest= require("../models/connectionRequest");
const User = require("../models/user");




requestRouter.post("/request/send/:status/:touserId",userAuth,
async (req,res) => {


    try {
        const fromUserId = req.user;
        const toUserId = req.params.touserId;
        const status = req.params.status;

        // Data Sanitization
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json(
                {
                    message: "Invalid status type: " + status
                }
            )
        }

        // If there is an existing ConnectionRequest and inhibit reverse connectionrequest attempt.

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId: toUserId,toUserId: fromUserId}
            ]
        });

        if(existingConnectionRequest){
            return res.status(400).json(
                {
                    message: "Connection Request Already Exits."
                }
            )
        }

        // Check if toUserId present in our database.
        const toUser = await User.findById(toUserId);

        if(!toUser) {
            return res.status(404).json(
            {
                message: "User not found."
            }
        )
        }

        // new instance of connectionrequest.
        const connectionRequest  = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });

        // res.send(req.user.userName + "You are trying to send a connection request.")

    } catch (error) {
        res.status(400).send(
            "Something went wrong." 
            +
            error
        )
    }
    
});


requestRouter.post("/request/review/:status/:requestId",
userAuth,
async (req,res) => {

    try {
        const loggedInUser = req.user;
        const {status,requestId} = req.params;

        // Validate the status
        const allowedStatus = ["accepted","rejected"]

        if (!allowedStatus.includes(status)){
            return res.status(400).json(
                {
                    message : "Invalid Status type " + status
                }
            )
        }

        // request Id should be valid.
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });

        if(!connectionRequest){
            return res.status(404).json({
                message: "Connection request not found."
            });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save()

        res.json({
            message: "Connection Request Accpeted " + status,
            data
        })

        // Richa => Mark
        // Is loggedIn == toUserId
        // status == interested

        

    } catch (error) {
        res.status.send("ERROR: ",error.message)
    }

});

module.exports = requestRouter;