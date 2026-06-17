const validator = require("validator")
const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    }
    else if (firstName.lenght < 3 || firstName.lenght > 40) {
        throw new Error("first Name should be minmum 4-40 characters");
    }
    else if (lastName.lenght < 3 || lastName.lenght > 40) {
        throw new Error("Last Name should be minmum 4-40 characters");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email id!")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Your password is week please enter strong password!")
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'about', 'skills'];
    const isEditAllowed = Object.keys(req.body).every((k) =>
        allowedEditFields.includes(k)
    )
    if (!isEditAllowed) {
        throw new Error("Invalid fields for profile edit!");
    }
}

module.exports = { validateSignupData, validateEditProfileData };