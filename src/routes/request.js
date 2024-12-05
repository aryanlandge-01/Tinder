const express = require("express");
const {userAuth} = require('../middlewares/auth');
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest",userAuth,async (req,res) => {
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

module.exports = requestRouter;