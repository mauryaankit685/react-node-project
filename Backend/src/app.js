const express = require("express")
// const { adminAuth, userAuth } = require('./middlewares/auth')
const connectDb = require("./config/database")
const User = require('./models/users')
const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {
    // console.log(req.body)
    const user = new User(req.body)
    try {
        await user.save(user);
        res.send("Data is successfully saved");
    }
    catch (err) {
        res.status(400).send('data is not submitted. please contact to support team' + err.message)
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


// app.get('/userData', (req, res) => {
//     res.send('userData')
// })

// app.use('/', (err, req, res, next) => {
//     if (err) {
//         console.log(err)
//         res.status(500).send("somthing went wrong")

//     }
// })






