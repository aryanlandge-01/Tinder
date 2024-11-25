const express = require("express");

const app = express();

app.use("/user",(req,res,next) => {
    next()
    res.send("Response!!")
    
},
(req,res,next) => {
    next()
    res.send("Response 1!")
},
(req,res,next) => {
    next()
    res.send("Response 2!")
},
(req,res,next) => {
    next()
    res.send("Response 3!")
}
)





app.listen(3000,() => {
    console.log("Server is listening on port 3000");
});


const deadpool = "Wolvorine";