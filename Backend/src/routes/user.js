const express = require("express");
const requestsRouter = express.Router();
const ConnectionRequestModel = require("../models/connection")
const { userAuth } = require('../middlewares/auth')
const User = require("../models/users")
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

        const data = connections.map(connection => {
            if (connection.fromUserId._id.toString() === userId.toString()) {
                return
                connection.toUserId

            } else {
                return connection.fromUserId
            }
        });

        res.status(200).json({ message: "Connections fetched successfully", data: data });
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
})

requestsRouter.post('/feed', userAuth, async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
        const page = parseInt(req.query.page) || 1; // Default page to 1 if not provided
        const skip = (page - 1) * limit;
        limit = limit > 50 ? 50 : limit; // Limit the maximum number of users to 50

        const userId = req.user._id;
        const conectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        }).select('fromUserId toUserId');

        const hideUserFromFeed = new Set();
        conectionRequests.forEach(request => {
            if (request.fromUserId.toString() === userId.toString()) {
                hideUserFromFeed.add(request.toUserId.toString());
            } else {
                hideUserFromFeed.add(request.fromUserId.toString());
            }
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: userId } }
            ]

        }).select('firstName lastName gender about')
            .skip(skip).limit(limit);
        res.status(200).json({ message: "Feed fetched successfully", data: users });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
})

module.exports = requestsRouter;