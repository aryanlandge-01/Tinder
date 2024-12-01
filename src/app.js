const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user")
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

app.get("/",(req,res) => {
     res.send("hello welcome to devtinder.")
    // console.log("<h1>Welcome to dev Tinder</h1>");
})



connectDB().then(() => {
    console.log("Database connection established");
    app.listen(3000,() => {
        console.log("Server is listening on port 3000");
    })
}).catch(err => {
    console.log(err,"Database not connected!")
});




