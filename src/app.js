const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { Model } = require("mongoose");
const app = express();

// Api for user Signup.

app.use(express.json());


app.post("/signup",async (req,res) => {
    // const userObj = {
    //     firstName: "Phil",
    //     lastName: "Dhumphy",
    //     emailId: "aryanlandge@gmail.com",
    //     password: "ganstaparadise"
    // };
    // // creating a new instance of user model.
    const user = new User(req.body);

    try {
        await user.save();
        res.send("user added sucessfully!!!!")
    } catch (error) {
        res.status(400).send("Error saving the user:" + err.message)
    }

});

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
        const users = await User.findOne({});

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
       const user = await User.findByIdAndDelete(userId);
    //    if (!user){
    //         res.status(404).send("User not found.")
    //    } else{
        res.send("user deleted Sucessfully");
    //    }
    } catch (error) {
        res.status(400).send("something went wrong!!")
    }
})

app.patch("/user",async (req,res) => {
    const userId = req.body.userId;
    const data = req.body;

    // console.log(req.body);

    try {
        const user = await User.findByIdAndUpdate({_id: userId},data,{returnDocument: "after"}
        );
        console.log(user);
        
        res.send("User Updated Sucessfully!!")
    } catch (error) {
        res.status(400).send("User details updated sucessfully.")
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




