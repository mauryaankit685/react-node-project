const express = require("express")

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from /test")
})

app.use("/", (req, res) => {
    res.send("Hello from /")
})

app.use((req, res) => {
    res.send("Hello from 3001 server is running now.")
})

app.listen("3001", () => {
    console.log("server successfully listining")
});