const express = require("express")
const app = express();
const { adminAuth, userAuth } = require('./middlewares/auth')
// middleware is a checkpoint that is checking/modifing/stoping before reaching the request to the final api



app.get('/userData', (req, res) => {
    throw new Error("hdfkadas");
    res.send('userData')
})

app.use('/', (err, req, res, next) => {
    if (err) {
        console.log(err)
        res.status(500).send("somthing went wrong")

    }
})



// app.use('/admin', adminAuth)

// app.get('/user', userAuth, (req, res) => {
//     // middleware
//     res.send('user is here')
// })

// app.get('/admin/user', (req, res) => {
//     // middleware
//     res.send('data set successfully')
// })

// app.delete('/admin/remove', (req, res) => {
//     // middleware
//     res.send('data deleted successfully')
// })





app.listen("3001", () => {
    console.log("server successfully listining")
});