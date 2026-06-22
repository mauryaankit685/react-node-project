const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestsRouter = express.Router();
const ConnectionRequestModel = require("../models/connection")
const User = require("../models/users")

requestsRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatuses = ["interested", "ignored"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).send("Invalid status");
        }
        const allowedToUserIds = await User.find({ _id: toUserId });
        if (allowedToUserIds.length === 0) {
            return res.status(400).send("Invalid toUserId");
        }
        //  schema.pre used in connection.js to check if fromUserId and toUserId are same, so no need to check here again and can check here as well if the request is already sent or not, so that we can avoid duplicate requests.

        // if (toUserId.toString() === fromUserId.toString()) {
        //     return res.status(400).send("You cannot send a request to yourself");
        // }

        const existingRequest = await ConnectionRequestModel.findOne({
            $or:
                [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ]
        });
        // const reverseExistingRequest = await ConnectionRequestModel.findOne({ fromUserId: toUserId, toUserId: fromUserId });
        // if (reverseExistingRequest) {
        //     return res.status(400).send("You have already received a request from this user");
        // }
        if (existingRequest) {
            return res.status(400).send("Request already sent");
        }
        const connectionRequest = new ConnectionRequestModel({ fromUserId, toUserId, status })
        const data = await connectionRequest.save();
        res.json({ message: req.user.firstName + " is " + status + " in " + allowedToUserIds[0].firstName, data })
    }
    catch (err) {
        res.status(400).send("Cannot send request " + err);
    }

})

module.exports = requestsRouter;