const mongoose = require("mongoose")
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"]
        },
        message: `{VALUE} Status is not valid`,
        default: "pending"
    },
},
    { timestamps: true }
);
connectionRequestSchema.pre("save", async function (next) {

    if (this.fromUserId.toString() === this.toUserId.toString()) {
        throw new Error("You cannot send a request to yourself....");
    }

});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // 

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequestModel;
