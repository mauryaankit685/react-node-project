const express = require("express")
// const { adminAuth, userAuth } = require('./middlewares/auth')
const connectDb = require("./config/database")
const User = require('./models/users')
const { valitateSignupData } = require('./utils/validation')
const app = express();
const bcrypt = require('bcrypt')

app.use(express.json())

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

app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.find({ emailId: userEmail })
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
