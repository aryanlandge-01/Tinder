const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name or Last name cannot be empty!");
    } else if (firstName.length < 2 || firstName.length > 50) {
        throw new Error("First name should be between 2 and 50 characters.");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "about",
        "skills",
        "photoUrl"
    ];

    // Reject empty body
    if (!req.body || Object.keys(req.body).length === 0) {
        return false;
    }

    // Check for allowed fields
    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );

    return isEditAllowed;
};


module.exports = {
    validateSignUpData,
    validateEditProfileData, // This exports the function
};
