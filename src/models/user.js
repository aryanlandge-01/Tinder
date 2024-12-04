const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        // Validation of email using validator liabary.
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: 5,
        trim: true,
        validator(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough try combination of letter and character make sure length is greater than 8." + value)
            }
        }
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
        type: String,
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid URL: " + value)
            }
        }
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign(
        {_id: user._id},"Heil@007", 
        {
        expiresIn: "7d",
    });
    return token;
}

userSchema.methods.validatePassword = async function (InputPassword) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(InputPassword,passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);