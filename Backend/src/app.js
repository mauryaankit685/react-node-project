const express = require("express")

const app = express();


// order of route is matter 

app.get("/user", (req, res) => {
    res.send("Hello from user")
})

app.post("/user", (req, res) => {
    res.send("user is post")
})

app.delete("/user", (req, res) => {
    res.send("user is deleted")
})

app.use("/test/2", (req, res) => {
    res.send("Hello from /test/2")
})

app.use("/test", (req, res) => {
    res.send("Hello from /test")
})

// app.use((req, res) => {
//     res.send("Hello from 3001 server is running now.")
// })

// app.use("/", (req, res) => {
//     res.send("Hello from /")
// })

app.listen("3001", () => {
    console.log("server successfully listining")
});