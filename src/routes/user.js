const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age gender photoUrl skills"


// get all the pending connection request for the loggedIn User 
userRouter.get(
    "/user/request/receive",
    userAuth,
    async (req,res) => {
        
        try {
            const loggedInUser = req.user;

            const connectionRequest = await ConnectionRequests.find({
                toUserId: loggedInUser._id,
                status: "interested",
            }).populate("fromUserId",["firstName","lastName","age","gender","photoUrl","skills"]);

       

            console.log(connectionRequest);
            

            res.json({
                message: "Data fetched successfully",
                data: connectionRequest
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

userRouter.get("/feed",userAuth,async (req,res) => {
    try {
        // res.send("here is your feed")
        // ALL the card of the database should be shown
        // User should not his own card and accpeted and interested and ignored profile.

        const loggedInUser = req.user;

        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // Find all connection request that i have sent or received!!

        const connectionRequests = await ConnectionRequests.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {
                    _id: {$nin: Array.from (hideUsersFromFeed)} // not in array
                },
                {
                    _id: {$ne: loggedInUser._id} // not equal to 
                }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        


        res.status(200).send(users)

    } catch (error) {
        res.status(400).json({
            message: "Something went Wrong!!",
            err: error
        })
    }
})



module.exports = userRouter;