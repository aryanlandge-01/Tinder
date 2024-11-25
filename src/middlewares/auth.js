const userAuth = (req,res,next) => {
    const token = "abc"
    const Isauthenticated = "abc" === token
    if (Isauthenticated) {
        // res.send("user data send successfully.")
        console.log("user is authenticated.")
        next()
    } else {
        res.status(401).send("Unauthorized Access.")
    }
}

const adminAuth = (req,res,next) => {
    const token = "abc"
    const Isauthenticated = "abc" === token
    if (Isauthenticated) {
        // res.send("user data send successfully.")
        console.log("Admin is authenticated.")
        next()
    } else {
        res.status(401).send("Unauthorized Access.")
    }
}



module.exports = {
    userAuth,
    adminAuth
};