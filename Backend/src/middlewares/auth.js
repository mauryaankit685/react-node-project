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
const userAuth = (req, res, next) => {
    const token = 'xyz'
    const auth = 'xyz'
    if (token == auth) {
        next()
    }
    else {
        res.status(401).send("you are not a authorized user")
    }
}
module.exports = {
    adminAuth, userAuth
}