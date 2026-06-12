const express = require("express")
const { adminAuth, userAuth } = require('./middlewares/auth')
const connectDb = require("./config/database")
const User = require('./models/users')
const { valitateSignupData } = require('./utils/validation')
const app = express();
const bcrypt = require('bcrypt')
const validator = require("validator")
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {


    try {
        const { firstName, lastName, emailId, password } = req.body
        valitateSignupData(req);


        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({ firstName, lastName, emailId, password: hashPassword })
        await user.save();
        res.send("Data is successfully saved");
    }
    catch (err) {
        res.status(400).send('ERROR: ' + err.message)
    }
})

app.get("/profile", userAuth, async (req, res) => {

    try {

        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send('ERROR: ' + err.message)
    }
})

app.post('/login', async (req, res) => {

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

            const isPasswordValid = await bcrypt.compare(password, user.password)
            // await bcrypt.compare('enteered password', "increpted password")

            if (isPasswordValid) {
                const token = jwt.sign({ _id: user._id }, "randoem@123", { expiresIn: "7d" }) // expire in 7 days
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

app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.find({ emailId: userEmail })
        console.log(user);
        if (user.length === 0) {
            res.status(404).send("user not found");
        }
        else {
            res.send(user)
        }
    }
    catch (err) {
        await res.status(400).send("Connot read request " + err);
    }

})

app.get('/feed', async (req, res) => {

    try {
        const user = await User.find({})
        if (user.length === 0) {
            res.status(404).send("user not found");
        }
        else {
            res.send(user)
        }
    }
    catch (err) {
        await res.status(400).send("Connot read request " + err);
    }

})

app.delete('/user', async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.findOneAndDelete(emailId)
        res.send("user deleted successfully....")
    }
    catch (err) {
        await res.status(400).send("Connot read request " + err);
    }
})

app.patch('/user/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATE = ['age', 'gender', 'photoUrl', 'skills'];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATE.includes(k)
        )

        if (!isUpdateAllowed) {
            throw new Error("updates are not allowed")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true })// returnDocument: "after" istead of this we can use new : true

        res.send("data is updated .......")
    }
    catch (err) {
        await res.status(400).send("invalid request " + err.message);
    }

})


connectDb()
    .then(() => {
        console.log("Db connect successfully")
        app.listen("3001", () => {
            console.log("server successfully listining")
        });
    })
    .catch((err) => {
        console.error("Opps... Database is not connected!")
    })
