const express = require("express");
const router = express.Router();
const { validateSignupData } = require('../utils/validation')
const bycrypt = require('bcrypt')
const User = require('../models/users')
const jwt = require("jsonwebtoken")
const validator = require("validator")
const passwordValidation = require('../models/users')
const { userAuth } = require('../middlewares/auth')


router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body
        validateSignupData(req);


        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({ firstName, lastName, emailId, password: hashPassword })
        await user.save();
        res.send("Data is successfully saved");
    }
    catch (err) {
        res.status(400).send('ERROR: ' + err.message)
    }
})

router.post('/login', async (req, res) => {

    try {

        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Email id is not valid")
        }
        else {
            const user = await User.findOne({ emailId: emailId });
            if (!user) {
                throw new Error("email is not present!")
            }
            const isPasswordValid = await user.passwordValidation(password);
            // const isPasswordValid = await bcrypt.compare(password, user.password)
            // await bcrypt.compare('enteered password', "increpted password")

            if (isPasswordValid) {
                const token = await user.getJWT();
                res.cookie('token', token)
                res.send("Login successful !")
            }
            else {
                throw new Error("password is not valid!")
            }
        }
    }
    catch (err) {
        res.status(400).send('ERROR: ' + err.message)
    }
})

router.post('/logout', async (req, res) => {
    res.clearCookie('token', null, {
        expires: new Date(Date.now()),
    })
    res.send("Logout successful !")
})


router.post('/resetPassword', userAuth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const finalUser = req.user;
    console.log(finalUser)
    try {
        const isPasswordValid = await finalUser.passwordValidation(oldPassword);
        if (!isPasswordValid) {
            throw new Error("Old password is not valid!");
        }
        const hashNewPassword = await bycrypt.hash(newPassword, 10);
        finalUser.password = hashNewPassword;
        await finalUser.save();
        res.send("Password updated successfully!");
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

module.exports = router;