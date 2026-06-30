const express = require("express");
const requestsRouter = express.Router();
const ConnectionRequestModel = require("../models/connection")
const { userAuth } = require('../middlewares/auth')

requestsRouter.post('/user/requests/received', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        // Your logic here
        const receivedRequests = await ConnectionRequestModel.find({ toUserId: userId, status: "interested" }).populate('fromUserId', 'firstName lastName');
        res.status(200).json({ message: "Received requests fetched successfully", data: receivedRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

requestsRouter.post('/user/connections', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const connections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: userId, status: "accepted" },
                { toUserId: userId, status: "accepted" }
            ]
        }).populate('fromUserId', 'firstName lastName gender about').populate('toUserId', 'firstName lastName gender about');
        res.status(200).json({ message: "Connections fetched successfully", data: connections });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

module.exports = requestsRouter;