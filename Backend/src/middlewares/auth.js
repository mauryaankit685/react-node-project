const jwt = require('jsonwebtoken')
const User = require("../models/users")
const adminAuth = (req, res, next) => {
    const token = 'xyz'
    const auth = 'xyz'
    if (token == auth) {
        next()
    }
    else {
        res.status(401).send("you are not a authorized user")
    }
}
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized: No token provided.")
        }
        else {
            const decodeedMsg = await jwt.verify(token, "randoem@123")
            const { _id } = decodeedMsg;
            const user = await User.findById({ _id: _id })
            if (user) {
                req.user = user;
                next()
            }
            else {
                res.status(401).send("you are not a authorized user")
            }
        }
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message)
    }
}
module.exports = {
    adminAuth, userAuth
}