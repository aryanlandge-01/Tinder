
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        min: 5,
        trim: true
    },
    age: {
        type: Number,
        min: 18,
        max: 70
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid!!!")
            }
        },
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: "This is a default about the user."
    },
    skills: {
        type: [String],
    }
},
{
    timestamps: true,
}
);

// const UserModel = mongoose.model("User",userSchema);

module.exports = mongoose.model("User",userSchema);