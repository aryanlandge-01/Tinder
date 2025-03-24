const jwt = require('jsonwebtoken');
const User = require('../models/user');

// UserAuth Middleware
const userAuth = async (req,res,next) => {
    try {
       // Read the token from the req cookies.
       // const cookies = req.cookies;
       const {token} = req.cookies;

       if(!token){
          return  res.status(401).send("Unautorized Access.")
       }

       const decodedObj = await jwt.verify(token,process.env.JWT_SECRET);

        const {_id} = decodedObj;
        // Find the user.
        const user = await User.findById(_id);
        // Validate the user.
        if (!user) {
           throw new Error("User not found");
        }
        req.user = user;
        // we call next to move to the request handler.
        next();
    } catch (error) {
        res.status(400).send("Error: "+ error.message)
    }
}

// const adminAuth = (req,res,next) => {
//     const token = "abc"
//     const Isauthenticated = "abc" === token
//     if (Isauthenticated) {
//         // res.send("user data send successfully.")
//         console.log("Admin is authenticated.")
//         next()
//     } else {
//         res.status(401).send("Unauthorized Access.")
//     }
// }



module.exports = {
    userAuth
};