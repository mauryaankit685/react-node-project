const express = require("express")
const app = express();
const { adminAuth, userAuth } = require('./middlewares/auth')
// middleware is a checkpoint that is checking/modifing/stoping before reaching the request to the final api

app.use('/admin', adminAuth)

app.get('/user', userAuth, (req, res) => {
    // middleware
    res.send('user is here')
})

app.get('/admin/user', (req, res) => {
    // middleware
    res.send('data set successfully')
})

app.delete('/admin/remove', (req, res) => {
    // middleware
    res.send('data deleted successfully')
})


app.listen("3001", () => {
    console.log("server successfully listining")
});