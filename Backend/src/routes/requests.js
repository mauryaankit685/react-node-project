const express = require("express");
const requestsRouter = express.Router();

requestsRouter.post('/sendConnectionRequest', async (req, res) => {
    const user = req.user;
    console.log('Sending connection request...', user);
    res.send(user.firstName + "Connection request sent successfully!");
})

module.exports = requestsRouter;