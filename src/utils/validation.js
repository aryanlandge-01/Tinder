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

module.exports = {
    validateSignUpData, // This exports the function
};
