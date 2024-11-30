const mongoose = require("mongoose");
// Referance to the cluster.

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://landgearyan0:Heil%40007@cluster0.49bey.mongodb.net/devTinder"
    );
};

module.exports = connectDB;
