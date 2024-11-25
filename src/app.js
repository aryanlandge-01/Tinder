const express = require("express");

const app = express();

const {userAuth,adminAuth} = require("./middlewares/auth")

app.use("/admin",adminAuth)

app.get("/admin/getalldata",(req,res) => {
    res.send("<h1>Here is your data</h1>");
})

app.get("/user/login",(req,res) => {
    res.send("user logged in successfully.")
})

app.get("/user/data",userAuth,(req,res) => {
    // console.log("I am just a middleware!");
    // next()
    res.send("User data sent")
})

app.use("/user",(req,res) => {
    res.send("User info.")
})





app.listen(3000,() => {
    console.log("Server is listening on port 3000");
});


const deadpool = "Wolvorine";