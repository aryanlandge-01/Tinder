const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // referance to the user collections.
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored","interested","accepted","rejected"],
            message: props => `${props.VALUE} is incorrect status type.`
        },
        required: true,
    }
},
{
    timestamps: true,
}
);

connectionRequestSchema.index({fromUserId: 1,toUserId: 1});

connectionRequestSchema.pre("save",function(next) {
    const connnectionRequest = this;
    // check if from and to user_id are same.
    if(connnectionRequest.fromUserId.equals(connnectionRequest.toUserId)){
        throw new Error("You cannot send the connection request to yourself.")
    }

    next();
});

const connectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = connectionRequestModel;