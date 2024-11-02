const express = require("express");

const app = express();

app.use("/hello",(req,res) => {
    res.send(
        "<h1>hello from the server.</h1>"
    )
})

app.use("/",(req,res) => {
    res.send("hello hello hello!");
})

app.listen(3000,() => {
    console.log("Server is listening on port 3000");
});


const deadpool = "Wolvorine";